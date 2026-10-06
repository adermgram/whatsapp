import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OwnerNotifier } from './owner-notifier.js';

/** Switches a chat between the AI and the human owner, and tells the owner why. */
@Injectable()
export class HandoffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: OwnerNotifier,
  ) {}

  async handoff(conversationId: string, reason: string) {
    const conv = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { mode: 'HUMAN', humanSince: new Date(), handoffReason: reason },
      include: { customer: true },
    });
    const recent = await this.prisma.message.findMany({
      where: { conversationId, sender: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    await this.notifier.notifyHandoff({
      merchantId: conv.merchantId,
      conversationId,
      customerName: conv.customer.name,
      customerPhone: conv.customer.phone,
      reason,
      recent: recent.reverse().map((m) => m.text ?? ''),
    });
  }

  async resumeAi(conversationId: string) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { mode: 'AI', humanSince: null, handoffReason: null },
    });
  }
}
