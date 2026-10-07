import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { PaymentConfirmationService } from '../payments/payment-confirmation.service.js';
import { normalizePhone } from '../messaging/reply-policy.js';

export interface CommandResult {
  /** What to send back to the owner. */
  reply: string;
  /** Conversations given back to the AI; the caller lets the AI answer anything the customer is still waiting on. */
  resumed: string[];
}

const HELP = [
  '*Owner commands* (send these to the shop number from your own phone)',
  '/chats - chats waiting for you',
  '/resume - give the waiting chat back to the AI',
  '/resume 2348012345678 - give one customer\'s chat back to the AI',
  '/paid ORD-000012 - confirm a payment the customer made by bank transfer (sends them the receipt)',
].join('\n');

/** "ORD-000012", "ord12" and "12" all mean the same order. */
export function parseOrderNumber(raw: string | undefined): string | null {
  const digits = raw?.replace(/\D/g, '');
  if (!digits || digits.length > 9) return null;
  return `ORD-${digits.padStart(6, '0')}`;
}

/**
 * Commands the owner sends from their own phone. Only messages that start with "/" and come from the
 * store's owner number are treated as commands, so a customer can never run one.
 */
@Injectable()
export class OwnerCommands {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handoffs: HandoffService,
    private readonly payments: PaymentConfirmationService,
  ) {}

  /** True when this message is the owner talking to the bot rather than a customer. */
  isOwnerCommand(merchant: { ownerPhone: string }, chatId: string, text: string | undefined): boolean {
    return !!text && text.trim().startsWith('/') && normalizePhone(merchant.ownerPhone) === chatId;
  }

  async handle(merchant: { id: string; ownerPhone: string }, text: string): Promise<CommandResult> {
    const [cmd = '', ...args] = text.trim().split(/\s+/);
    switch (cmd.toLowerCase()) {
      case '/help':
      case '/?':
        return { reply: HELP, resumed: [] };
      case '/chats':
        return this.chats(merchant.id);
      case '/resume':
        return this.resume(merchant.id, args[0]);
      case '/paid':
        return this.paid(merchant.id, args[0]);
      default:
        return { reply: `I don't know "${cmd}". Send /help to see what I understand.`, resumed: [] };
    }
  }

  private label(c: { customer: { name: string | null; phone: string } }) {
    return `${c.customer.name ?? 'Customer'} (+${c.customer.phone.replace(/\D/g, '')})`;
  }

  private async chats(merchantId: string): Promise<CommandResult> {
    const waiting = await this.handoffs.humanChats(merchantId);
    if (waiting.length === 0) return { reply: 'No chats are waiting for you. The AI is handling everyone.', resumed: [] };
    const lines = waiting.map((c) => `• ${this.label(c)}: ${c.handoffReason ?? 'with you'}`);
    return { reply: ['*Chats with you right now*', ...lines, '', 'Send /resume <number> to hand one back to the AI.'].join('\n'), resumed: [] };
  }

  private async resume(merchantId: string, target: string | undefined): Promise<CommandResult> {
    const waiting = await this.handoffs.humanChats(merchantId);
    if (waiting.length === 0) return { reply: 'No chats are waiting for you. The AI is already handling everyone.', resumed: [] };

    let chosen = waiting;
    if (target) {
      const phone = normalizePhone(target);
      chosen = waiting.filter((c) => c.customer.phone === phone || c.customer.phone.endsWith(phone.slice(-9)));
      if (chosen.length !== 1) {
        return { reply: `I could not find a waiting chat for ${target}. Send /chats to see them.`, resumed: [] };
      }
    } else if (waiting.length > 1) {
      return {
        reply: ['More than one chat is waiting, so tell me which:', ...waiting.map((c) => `• /resume ${c.customer.phone.replace(/\D/g, '')}  (${this.label(c)})`)].join('\n'),
        resumed: [],
      };
    }

    const [c] = chosen as [(typeof waiting)[number]];
    await this.handoffs.resumeAi(c.id);
    return { reply: `✅ ${this.label(c)} is back with the AI.`, resumed: [c.id] };
  }

  private async paid(merchantId: string, rawOrder: string | undefined): Promise<CommandResult> {
    const orderNumber = parseOrderNumber(rawOrder);
    if (!orderNumber) return { reply: 'Tell me which order, for example: /paid ORD-000012', resumed: [] };

    switch (await this.payments.markPaidManually(merchantId, orderNumber)) {
      case 'paid':
        return { reply: `✅ ${orderNumber} marked as paid. The customer has been sent a confirmation and their receipt.`, resumed: [] };
      case 'already_paid':
        return { reply: `${orderNumber} was already paid. I made sure the customer has their receipt.`, resumed: [] };
      case 'oversold':
        return { reply: `⚠️ ${orderNumber} is marked paid, but that item sold out in the meantime. The customer was told you will contact them; please sort out an alternative or a refund.`, resumed: [] };
      case 'not_awaiting':
        return { reply: `${orderNumber} has not reached payment yet, so there is nothing to confirm.`, resumed: [] };
      default:
        return { reply: `I could not find ${orderNumber}. Check the number and try again.`, resumed: [] };
    }
  }
}
