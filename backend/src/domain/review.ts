/** A published review as visitors see it. */
export interface Review {
  readonly id: string;
  readonly rating: number;
  /** Calendar date in Toronto, `YYYY-MM-DD`. */
  readonly date: string;
  readonly text: string;
  readonly author: string;
  readonly service: string;
}

const torontoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** The calendar date in Toronto, where HairPop operates. */
export function localDate(instant: Date): string {
  return torontoDate.format(instant);
}

/**
 * Whether a new review is held for moderation before it is public: text that carries a link,
 * an email address or a phone number may advertise or expose private details (L2-039).
 */
export function needsChecks(text: string): boolean {
  return (
    /(https?:\/\/|www\.)/i.test(text) ||
    /[\w.+-]+@[\w-]+\.[\w.]+/.test(text) ||
    /(\d[\s().-]?){7,}/.test(text)
  );
}
