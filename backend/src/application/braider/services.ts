import { prisma } from '@/infrastructure/prisma';

export interface ServiceInput {
  readonly styleSlug: string;
  readonly name: string;
  readonly startingPrice: number;
  readonly typicalHours: number;
  readonly preparation: string | null;
  readonly published: boolean;
}

/** A braider's own service as the management app edits it (L2-026). */
export interface ManagedService extends ServiceInput {
  readonly id: string;
  readonly styleName: string;
  readonly version: number;
}

type ServiceRecord = Omit<ManagedService, 'styleName'> & { style: { name: string } };

function toManaged({ style, ...service }: ServiceRecord): ManagedService {
  return {
    id: service.id,
    styleSlug: service.styleSlug,
    styleName: style.name,
    name: service.name,
    startingPrice: service.startingPrice,
    typicalHours: service.typicalHours,
    preparation: service.preparation,
    published: service.published,
    version: service.version,
  };
}

const withStyle = { style: { select: { name: true } } } as const;

/** Published styles a service can be linked to. */
export function offerableStyles() {
  return prisma.style.findMany({
    where: { published: true },
    select: { slug: true, name: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
}

export async function offerableStyleSlugs(): Promise<string[]> {
  return (await offerableStyles()).map((style) => style.slug);
}

export async function listManagedServices(braiderId: string) {
  const [services, styles] = await Promise.all([
    prisma.braiderService.findMany({
      where: { braiderId, removedAt: null },
      include: withStyle,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    }),
    offerableStyles(),
  ]);
  return { data: services.map(toManaged), styles };
}

export async function addService(braiderId: string, input: ServiceInput): Promise<ManagedService> {
  return toManaged(
    await prisma.braiderService.create({ data: { braiderId, ...input }, include: withStyle }),
  );
}

export type EditResult<T> =
  | { readonly outcome: 'saved'; readonly value: T }
  | { readonly outcome: 'not_found' | 'forbidden' | 'stale' };

async function ownership(braiderId: string, id: string) {
  const service = await prisma.braiderService.findFirst({ where: { id, removedAt: null } });
  if (!service) return 'not_found' as const;
  return service.braiderId === braiderId ? ('owned' as const) : ('forbidden' as const);
}

/**
 * Saves the braider's edit to their own service against the version they loaded; a newer
 * version is reported as stale and kept (L2-047 AC4). Unpublishing removes it from matching and
 * booking while appointments keep their snapshots (L2-026 AC3).
 */
export async function editService(
  braiderId: string,
  id: string,
  version: number,
  changes: Partial<ServiceInput>,
): Promise<EditResult<ManagedService>> {
  const owner = await ownership(braiderId, id);
  if (owner !== 'owned') return { outcome: owner };
  const { count } = await prisma.braiderService.updateMany({
    where: { id, braiderId, version, removedAt: null },
    data: { ...changes, version: { increment: 1 } },
  });
  if (count === 0) return { outcome: 'stale' };
  const saved = await prisma.braiderService.findUniqueOrThrow({
    where: { id },
    include: withStyle,
  });
  return { outcome: 'saved', value: toManaged(saved) };
}

/** Removes the braider's own service from their list, matching and booking; history stays. */
export async function removeService(braiderId: string, id: string): Promise<EditResult<null>> {
  const owner = await ownership(braiderId, id);
  if (owner !== 'owned') return { outcome: owner };
  await prisma.braiderService.updateMany({
    where: { id, braiderId, removedAt: null },
    data: { removedAt: new Date(), published: false, version: { increment: 1 } },
  });
  return { outcome: 'saved', value: null };
}
