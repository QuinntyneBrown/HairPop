/** Origin of the customer web app, used to build links in emails. */
export function appOrigin(): string {
  return (process.env.APP_ORIGIN ?? 'http://localhost:4200').replace(/\/$/, '');
}
