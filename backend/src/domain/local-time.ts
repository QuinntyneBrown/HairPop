import { TIME_ZONE } from './booking';

const PARTS = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Milliseconds Toronto is ahead of UTC at `instant` (negative: it is behind). */
function offsetAt(instant: number): number {
  const parts = Object.fromEntries(
    PARTS.formatToParts(new Date(instant)).map((part) => [part.type, part.value]),
  );
  const local = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return local - (instant - (instant % 1000));
}

/** The instant of a wall-clock date (`YYYY-MM-DD`) and time (`HH:mm`) in Toronto. */
export function torontoInstant(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const [h, min] = time.split(':').map(Number) as [number, number];
  const wall = Date.UTC(y, m - 1, d, h, min);
  let instant = wall - offsetAt(wall);
  // Near a daylight-saving change the first guess can use the other side's offset.
  instant = wall - offsetAt(instant);
  return new Date(instant);
}

/** Whether `YYYY-MM-DD` names a real calendar date. */
export function isCalendarDate(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return false;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const value = new Date(Date.UTC(y, m - 1, d));
  return value.getUTCFullYear() === y && value.getUTCMonth() === m - 1 && value.getUTCDate() === d;
}
