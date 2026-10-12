/** A request's public reference: HP- and at least four digits, such as HP-1048. */
export function reference(number: number): string {
  return `HP-${String(number).padStart(4, '0')}`;
}

/** The number behind a reference, or null when it is not one. */
export function referenceNumber(ref: string): number | null {
  const match = /^HP-(\d{1,9})$/i.exec(ref);
  return match ? Number(match[1]) : null;
}

/** "Nia Okafor" → "Nia". */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export type AppointmentStatus =
  'awaiting_reply' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
type StoredStatus = Exclude<AppointmentStatus, 'completed'>;

/** Changes must be asked for at least this long before the agreed time (L2-021 AC4). */
export const CHANGE_NOTICE_HOURS = 48;
const HOUR_MS = 60 * 60 * 1000;

export interface Price {
  readonly kind: 'estimate' | 'agreed';
  readonly min: number;
  readonly max: number | null;
}

export interface AppointmentSummary {
  readonly reference: string;
  readonly status: AppointmentStatus;
  readonly service: string;
  readonly braider: { readonly slug: string; readonly name: string };
  readonly start: string;
  readonly timeZone: string;
  readonly price: Price;
}

export interface AllowedActions {
  readonly change: boolean;
  readonly cancel: boolean;
  readonly rebook: boolean;
  readonly review: boolean;
}

export interface AppointmentDetail extends AppointmentSummary {
  readonly durationHours: number;
  /** The studio address only once the braider has accepted (L2-019, L2-027 AC3). */
  readonly location: { readonly area: string; readonly address: string | null };
  readonly contact: { readonly email: string; readonly phone: string | null };
  readonly policy: { readonly changes: string; readonly cancellation: string };
  readonly preparation: readonly string[] | null;
  readonly pendingChange: { readonly start: string } | null;
  readonly allowed: AllowedActions;
  readonly unavailable: readonly 'preparation'[];
  readonly updatedAt: string;
}

export interface LifecycleRecord {
  readonly status: StoredStatus;
  readonly start: Date;
  readonly durationHours: number;
}

/** The status customers see: a confirmed appointment is completed once its time has passed. */
export function lifecycle(record: LifecycleRecord, now = new Date()): AppointmentStatus {
  const end = record.start.getTime() + record.durationHours * HOUR_MS;
  return record.status === 'confirmed' && end <= now.getTime() ? 'completed' : record.status;
}

export function isActive(status: AppointmentStatus): boolean {
  return status === 'awaiting_reply' || status === 'confirmed';
}

/** Whether the owner may still propose a new time (L2-021 AC4). */
export function canChange(record: LifecycleRecord, hasPendingChange: boolean, now = new Date()) {
  return (
    isActive(lifecycle(record, now)) &&
    !hasPendingChange &&
    record.start.getTime() - now.getTime() >= CHANGE_NOTICE_HOURS * HOUR_MS
  );
}

/** Whether the owner may still cancel: an active item whose time has not started (L2-022). */
export function canCancel(record: LifecycleRecord, now = new Date()) {
  return isActive(lifecycle(record, now)) && record.start.getTime() > now.getTime();
}

export function price(record: {
  estimateMin: number;
  estimateMax: number | null;
  agreedAmount: number | null;
}): Price {
  return record.agreedAmount === null
    ? { kind: 'estimate', min: record.estimateMin, max: record.estimateMax }
    : { kind: 'agreed', min: record.agreedAmount, max: record.agreedAmount };
}

/** Preparation checklist from the braider's general guidance and the service's own. */
export function preparationChecklist(...guidance: (string | null)[]): string[] | null {
  const items = guidance.flatMap((text) =>
    (text ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  );
  return items.length > 0 ? items : null;
}

const LOCAL_PARTS = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Toronto',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

/** A start in Toronto time as the mocks write it: "Sat 24 Oct at 10:00 am". */
export function localWhen(instant: Date): string {
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    LOCAL_PARTS.formatToParts(instant).find((p) => p.type === type)?.value ?? '';
  const period = part('dayPeriod').toLowerCase();
  return `${part('weekday')} ${part('day')} ${part('month')} at ${part('hour')}:${part('minute')} ${period}`;
}
