import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OwnerNotifier } from './owner-notifier.js';

type Source = 'AI' | 'OWNER';

/** Switches a chat between the AI and the human owner, and tells the owner why. */
@Injectable()
export class HandoffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: OwnerNotifier,
  ) {}

  /**
   * HARD handoff: the AI stops answering this chat. `by` records who caused it, which decides how it ends:
   * AI-requested handoffs resume on their own after a timeout, owner takeovers when the owner goes quiet.
   */
  async handoff(conversationId: string, reason: string, by: Source = 'AI') {
    const conv = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { mode: 'HUMAN', humanSince: new Date(), handoffReason: reason, handoffBy: by },
      include: { customer: true },
    });
    if (by === 'OWNER') return; // the owner is already in the chat, no alert needed
    await this.notifier.notifyHandoff(await this.alertFor(conv, reason, 'handoff'));
  }

  /** SOFT notice: tell the owner something, but the AI keeps chatting (e.g. "customer says they paid by transfer"). */
  async notify(conversationId: string, reason: string) {
    const conv = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { customer: true },
    });
    await this.notifier.notifyHandoff(await this.alertFor(conv, reason, 'attention'));
  }

  async resumeAi(conversationId: string) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { mode: 'AI', humanSince: null, handoffReason: null, handoffBy: null },
    });
  }

  /** Chats currently with a human, oldest first (for the owner's /chats command). */
  humanChats(merchantId: string) {
    return this.prisma.conversation.findMany({
      where: { merchantId, mode: 'HUMAN' },
      include: { customer: true },
      orderBy: { humanSince: 'asc' },
      take: 10,
    });
  }

  private async alertFor(
    conv: { id: string; merchantId: string; customer: { name: string | null; phone: string } },
    reason: string,
    kind: 'handoff' | 'attention',
  ) {
    const recent = await this.prisma.message.findMany({
      where: { conversationId: conv.id, sender: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    return {
      merchantId: conv.merchantId,
      conversationId: conv.id,
      customerName: conv.customer.name,
      customerPhone: conv.customer.phone,
      reason,
      kind,
      recent: recent.reverse().map((m) => m.text ?? ''),
    };
  }
}
