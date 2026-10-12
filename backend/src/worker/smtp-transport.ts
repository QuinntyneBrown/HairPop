import nodemailer from 'nodemailer';
import type { MailTransport } from './deliver-emails';

/** Sends through the SMTP server at `url`, such as smtp://mailpit:1025. */
export function smtpTransport(url: string, from: string): MailTransport {
  const transporter = nodemailer.createTransport(url);
  return {
    async send(message) {
      await transporter.sendMail({ from, ...message });
    },
  };
}
