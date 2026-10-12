import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { ConversationService } from '../conversations/conversation.service.js';
import { koboToNaira } from '../common/money.js';
import type { Prisma } from '../generated/prisma/client.js';

const listInclude = {
  customer: true,
  messages: { orderBy: { createdAt: 'desc' }, take: 1 },
} satisfies Prisma.ConversationInclude;

type ChatRow = Prisma.ConversationGetPayload<{ include: typeof listInclude }>;

const preview = (m: { type: string; text: string | null }) => {
  if (m.text?.trim()) return m.text.trim().slice(0, 140);
  return m.type === 'audio' ? '🎤 Voice note' : m.type === 'image' ? '📷 Photo' : m.type === 'document' ? '📄 Document' : '';
};

function view(c: ChatRow) {
  const last = c.messages[0];
  return {
    id: c.id,
    customerName: c.customer.name,
    phone: c.customer.phone,
    mode: c.mode,
    handoffReason: c.handoffReason,
    handoffBy: c.handoffBy,
    humanSince: c.humanSince,
    lastMessageAt: c.lastMessageAt,
    lastMessage: last ? { sender: last.sender, text: preview(last), at: last.createdAt } : null,
  };
}

@Injectable()
export class ChatsAdminService {
  private readonly log = new Logger(ChatsAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly handoffs: HandoffService,
    private readonly conversations: ConversationService,
  ) {}

  /** `waiting` = chats the AI has stepped back from. The longest-waiting customer comes first. */
  async list(merchantId: string, waitingOnly: boolean) {
    const [rows, waitingCount] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { merchantId, ...(waitingOnly ? { mode: 'HUMAN' as const } : {}) },
        include: listInclude,
        orderBy: waitingOnly ? { humanSince: 'asc' } : { lastMessageAt: 'desc' },
        take: 100,
      }),
      this.prisma.conversation.count({ where: { merchantId, mode: 'HUMAN' } }),
    ]);
    return { chats: rows.map(view), waitingCount };
  }

  private async owned(merchantId: string, id: string) {
    const c = await this.prisma.conversation.findFirst({ where: { id, merchantId }, include: listInclude });
    if (!c) throw new NotFoundException('Chat not found');
    return c;
  }

  async get(merchantId: string, id: string) {
    const chat = await this.owned(merchantId, id);
    const [messages, orders] = await Promise.all([
      this.prisma.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: 'desc' }, take: 150 }),
      this.prisma.order.findMany({
        where: { conversationId: id, status: { not: 'DRAFT' } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, orderNumber: true, status: true, totalKobo: true },
      }),
    ]);
    return {
      ...view(chat),
      messages: messages.reverse().map((m) => ({
        id: m.id,
        sender: m.sender,
        type: m.type,
        text: m.text,
        createdAt: m.createdAt,
      })),
      orders: orders.map((o) => ({ id: o.id, orderNumber: o.orderNumber, status: o.status, total: koboToNaira(o.totalKobo) })),
    };
  }

  /** Gives the chat back to the AI, which then answers anything the customer is still waiting on. */
  async resume(merchantId: string, id: string) {
    await this.owned(merchantId, id);
    await this.handoffs.resumeAi(id);
    void this.conversations.catchUp(id).catch((e) => this.log.error(`catch-up failed: ${String(e)}`));
    return this.get(merchantId, id);
  }

  /** The owner wants to talk to this customer themselves: the AI stops answering this chat. */
  async takeOver(merchantId: string, id: string) {
    await this.owned(merchantId, id);
    await this.handoffs.handoff(id, 'You paused the AI from the dashboard', 'OWNER');
    return this.get(merchantId, id);
  }
}
