import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '../config/env.js';

/** Port. Nodemailer over SMTP today (Resend needs a domain); swap the class to change provider. */
export abstract class Mailer {
  /** Never throws: an email failure must not break a sale. Returns false if nothing was sent. */
  abstract send(to: string, subject: string, text: string): Promise<boolean>;
}

@Injectable()
export class NodemailerMailer extends Mailer {
  private readonly log = new Logger(NodemailerMailer.name);
  private readonly transport: Transporter | null =
    env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
      ? nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        })
      : null;

  async send(to: string, subject: string, text: string): Promise<boolean> {
    if (!this.transport) {
      this.log.debug('SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS): skipping email');
      return false;
    }
    try {
      await this.transport.sendMail({ from: env.MAIL_FROM ?? env.SMTP_USER, to, subject, text });
      return true;
    } catch (err) {
      this.log.error(`Email to ${to} failed: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }
}
