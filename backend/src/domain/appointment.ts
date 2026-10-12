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
