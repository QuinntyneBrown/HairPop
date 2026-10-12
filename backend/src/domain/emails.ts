import { appOrigin } from '@/config';

/** An email for the outbox (ADR 0009). */
export interface EmailMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

export function verificationEmail(to: string, token: string): EmailMessage {
  const link = `${appOrigin()}/verify-email?token=${token}`;
  return {
    to,
    subject: 'Verify your HairPop email',
    text: `Confirm ${to} for appointment updates by opening this link within 24 hours:\n\n${link}\n\nIf you didn’t ask for this, you can ignore this email.`,
  };
}

export function accountExistsEmail(to: string): EmailMessage {
  return {
    to,
    subject: 'You already have a HairPop account',
    text: `Someone tried to create a HairPop account with ${to}, which already has one.\n\nSign in at ${appOrigin()}/sign-in, or reset your password at ${appOrigin()}/forgot-password.\n\nIf this wasn’t you, you can ignore this email.`,
  };
}

export function passwordResetEmail(to: string, token: string): EmailMessage {
  const link = `${appOrigin()}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
  return {
    to,
    subject: 'Reset your HairPop password',
    text: `Choose a new password by opening this link within 60 minutes. It works once:\n\n${link}\n\nIf you didn’t ask for this, your password stays the same.`,
  };
}
