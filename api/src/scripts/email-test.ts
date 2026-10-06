import 'dotenv/config';
import { NodemailerMailer } from '../handoff/mailer.js';
import { env } from '../config/env.js';

// Sends one test email with the SMTP settings from .env.   npm run email:test [recipient]
// Without a recipient it emails the SMTP account itself.
if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
  console.error('SMTP is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS to apps/api/.env first.');
  process.exit(1);
}

const to = process.argv[2] ?? env.SMTP_USER;
console.log(`Sending a test email from ${env.MAIL_FROM ?? env.SMTP_USER} to ${to} via ${env.SMTP_HOST}:${env.SMTP_PORT} ...`);

const ok = await new NodemailerMailer().send(
  to,
  'Test email from your WhatsApp sales bot',
  'If you can read this, owner email alerts are set up correctly. You will get an email like this when a customer needs you or a payment arrives.',
);

console.log(ok ? `\nSent. Check the inbox of ${to} (and the spam folder).` : '\nFailed. The reason is in the error line above.');
process.exit(ok ? 0 : 1);
