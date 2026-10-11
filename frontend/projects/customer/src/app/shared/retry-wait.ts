/** "2 minutes", "30 seconds": how long the API asks the visitor to wait before trying again. */
export function waitText(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return 'a few minutes';
  if (seconds < 60) return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}
