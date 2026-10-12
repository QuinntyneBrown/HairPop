export type Role = 'customer' | 'braider';

/** The signed-in person as `GET /api/session` returns them. */
export interface SessionUser {
  readonly id: string;
  readonly name: string;
  readonly firstName: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly role: Role;
}

interface UserRecord {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerifiedAt: Date | null;
  readonly role: Role;
}

export function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    firstName: user.name.trim().split(/\s+/)[0] ?? user.name,
    email: user.email,
    emailVerified: user.emailVerifiedAt !== null,
    role: user.role,
  };
}
