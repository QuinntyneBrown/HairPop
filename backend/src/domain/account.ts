/** The signed-in customer's contact details (L2-014). */
export interface Account {
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  /** A changed email waiting for verification; `email` stays in use until then. */
  readonly pendingEmail: string | null;
  readonly phone: string | null;
}

interface AccountRecord {
  readonly name: string;
  readonly email: string;
  readonly emailVerifiedAt: Date | null;
  readonly pendingEmail: string | null;
  readonly phone: string | null;
}

export function toAccount(user: AccountRecord): Account {
  return {
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerifiedAt !== null,
    pendingEmail: user.pendingEmail,
    phone: user.phone,
  };
}
