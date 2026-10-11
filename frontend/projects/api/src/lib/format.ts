import { IsoDateTime, Range } from './common';

/**
 * Formatting for contract values, shared by both apps so every screen writes prices, ranges and
 * dates the same way (docs/design-system/foundations/content.html). Times are shown in the
 * appointment's own time zone (L2 preamble).
 */

const dollars = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

/** "$180". */
export function money(amount: number): string {
  return `$${dollars.format(amount)}`;
}

/** "$160–$300", or "$180" when the range has no upper bound. */
export function moneyRange(range: Range): string {
  return range.max === null || range.max === range.min
    ? money(range.min)
    : `${money(range.min)}–${money(range.max)}`;
}

/** "4–7 hours", "5 hours", "1 hour". */
export function hoursRange(range: Range): string {
  if (range.max === null || range.max === range.min) {
    return `${range.min} ${range.min === 1 ? 'hour' : 'hours'}`;
  }
  return `${range.min}–${range.max} hours`;
}

/** "4–8 weeks". */
export function weeksRange(range: Range): string {
  if (range.max === null || range.max === range.min) {
    return `${range.min} ${range.min === 1 ? 'week' : 'weeks'}`;
  }
  return `${range.min}–${range.max} weeks`;
}

/** "Sat 24 Oct" in the given time zone. */
export function shortDate(value: IsoDateTime, timeZone = 'America/Toronto'): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')}`;
}

/** "10:00 am" in the given time zone. */
export function clockTime(value: IsoDateTime, timeZone = 'America/Toronto'): string {
  return new Intl.DateTimeFormat('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  })
    .format(new Date(value))
    .replace(/\s?a\.m\./i, ' am')
    .replace(/\s?p\.m\./i, ' pm')
    .replace(/\s+/g, ' ');
}

/** "Sat 24 Oct · 10:00 am". */
export function dateTime(value: IsoDateTime, timeZone = 'America/Toronto'): string {
  return `${shortDate(value, timeZone)} · ${clockTime(value, timeZone)}`;
}

/** "1 Oct 2026" for a date-only value such as "2026-10-01", with no time zone shift. */
export function calendarDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
