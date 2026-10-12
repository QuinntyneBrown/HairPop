import { prisma } from './prisma';

/** Seconds until `key` may act again, or null while it is under `max` hits in its window. */
export async function retryAfterSeconds(key: string, max: number): Promise<number | null> {
  const limit = await prisma.rateLimit.findUnique({ where: { key } });
  const now = Date.now();
  if (!limit || limit.resetAt.getTime() <= now || limit.hits < max) return null;
  return Math.max(1, Math.ceil((limit.resetAt.getTime() - now) / 1000));
}

/** Counts one hit against `key`; an expired window starts again at one. */
export async function recordHit(key: string, windowSeconds: number): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "RateLimit" ("key", "hits", "resetAt")
    VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT ("key") DO UPDATE SET
      "hits" = CASE WHEN "RateLimit"."resetAt" <= now() THEN 1 ELSE "RateLimit"."hits" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= now()
        THEN now() + make_interval(secs => ${windowSeconds})
        ELSE "RateLimit"."resetAt" END`;
}

export async function clearHits(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}
