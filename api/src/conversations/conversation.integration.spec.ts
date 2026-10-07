import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { PaymentConfirmationService } from '../payments/payment-confirmation.service.js';
import { ReceiptService } from '../receipts/receipt.service.js';
import { LocalStorage } from '../storage/local.storage.js';
import { SimulatorGateway } from '../messaging/simulator.gateway.js';
import type { InboundMessage } from '../messaging/messaging.types.js';
import { LogOwnerNotifier } from '../handoff/owner-notifier.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { SpeechToText } from '../speech/speech-to-text.js';
import type { AgentResult, AgentService } from '../agent/agent.service.js';
import { ConversationService } from './conversation.service.js';
import { OwnerCommands } from './owner-commands.js';
import { ChatResumeJobs } from './chat-resume.jobs.js';

// Real Postgres, real pipeline; only the AI is replaced by a scripted stub so every assertion is exact.

class StubAgent {
  calls = 0;
  /** What the customer's messages looked like each time the AI was asked to answer. */
  seen: string[][] = [];
  delayMs = 0;
  next: AgentResult = { reply: 'stub reply' };
  constructor(private readonly prisma: PrismaService) {}

  async respond(ctx: { conversationId: string }): Promise<AgentResult> {
    this.calls++;
    const msgs = await this.prisma.message.findMany({
      where: { conversationId: ctx.conversationId, sender: 'CUSTOMER' },
      orderBy: { createdAt: 'asc' },
    });
    this.seen.push(msgs.map((m) => m.text ?? ''));
    if (this.delayMs) await new Promise((r) => setTimeout(r, this.delayMs));
    return this.next;
  }
}

class SilentSpeech extends SpeechToText {
  async transcribe() {
    return '';
  }
}

const prisma = new PrismaService();
const gateway = new SimulatorGateway();
const notifier = new LogOwnerNotifier();
const fake = new FakePaymentProvider();
const orders = new OrdersService(prisma, new InventoryService(), new NegotiationService(prisma), fake);
const handoffs = new HandoffService(prisma, notifier);
const confirmation = new PaymentConfirmationService(prisma, orders, fake, new ReceiptService(prisma, new LocalStorage()), gateway, notifier, handoffs);
const agent = new StubAgent(prisma);
const service = new ConversationService(prisma, gateway, agent as unknown as AgentService, notifier, handoffs, new SilentSpeech(), new OwnerCommands(prisma, handoffs, confirmation));
// Short on purpose: arrival holds make the result independent of how slow storing a message is.
service.debounceMs = 300;
const jobs = new ChatResumeJobs(prisma, handoffs, service);

let merchantId: string;
const OWNER_PHONE = `234807${Math.floor(1_000_000 + Math.random() * 8_999_999)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const newChat = () => `234810${Math.floor(1_000_000 + Math.random() * 8_999_999)}`;
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

let n = 0;
const inbound = (chatId: string, text: string, extra: Partial<InboundMessage> = {}): InboundMessage => ({
  merchantId,
  chatId,
  messageId: `t-${randomUUID()}-${n++}`,
  type: 'text',
  text,
  fromMe: false,
  timestamp: new Date(),
  ...extra,
});
const send = (chatId: string, text: string, extra?: Partial<InboundMessage>) => service.enqueue(inbound(chatId, text, extra));
const replies = (chatId: string) => gateway.sent.filter((s) => s.chatId === chatId && s.kind === 'text').map((s) => s.text!);
const conv = (chatId: string) => prisma.conversation.findUniqueOrThrow({ where: { merchantId_chatId: { merchantId, chatId } } });
async function until(cond: () => boolean | Promise<boolean>, ms = 8000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await cond()) return;
    await sleep(40);
  }
  throw new Error('condition not met in time');
}

beforeAll(async () => {
  await prisma.$connect();
  merchantId = (
    await prisma.merchant.create({
      data: { businessName: 'Pipeline Test Store', ownerName: 'Owner', ownerPhone: OWNER_PHONE, ownerEmail: `p-${randomUUID()}@shopbot.local`, passwordHash: 'x' },
    })
  ).id;
});

afterAll(async () => {
  await prisma.merchant.delete({ where: { id: merchantId } });
  await rm(resolve('storage', 'receipts', merchantId), { recursive: true, force: true });
  await prisma.$disconnect();
});

beforeEach(() => {
  agent.calls = 0;
  agent.seen = [];
  agent.delayMs = 0;
  agent.next = { reply: 'stub reply' };
  notifier.alerts.length = 0;
});

describe('customers who send one thought in several short messages', () => {
  it('get ONE reply that has seen all of the messages', async () => {
    const chat = newChat();
    const all = [send(chat, 'hi')];
    await sleep(15);
    all.push(send(chat, 'i want man united jersey'));
    await sleep(15);
    all.push(send(chat, 'Away one'));
    await Promise.all(all);

    expect(agent.calls).toBe(1);
    expect(agent.seen[0]).toEqual(['hi', 'i want man united jersey', 'Away one']);
    expect(replies(chat)).toHaveLength(1);
  });

  it('are not answered with a stale reply when they keep typing while the AI is thinking', async () => {
    const chat = newChat();
    agent.delayMs = 3500; // the AI takes longer than it takes to store the next message
    const first = send(chat, 'i want a jersey');
    await until(() => agent.calls === 1); // the AI is now mid-thought about the first message
    const second = send(chat, 'the arsenal one');
    await Promise.all([first, second]);

    expect(agent.calls).toBe(2); // the first answer was thrown away and the turn redone
    expect(agent.seen[1]).toEqual(['i want a jersey', 'the arsenal one']);
    expect(replies(chat)).toHaveLength(1); // the customer only ever sees the answer that covers everything
  });

  it('are not answered twice when the same WhatsApp message is delivered twice', async () => {
    const chat = newChat();
    const m = inbound(chat, 'hello');
    await Promise.all([service.enqueue(m), service.enqueue(m)]);
    expect(await prisma.message.count({ where: { merchantId, conversation: { chatId: chat }, sender: 'CUSTOMER' } })).toBe(1);
    expect(replies(chat)).toHaveLength(1);
  });
});

describe('the owner stepping in', () => {
  it('stops the AI from answering a message the owner already replied to', async () => {
    const chat = newChat();
    const customerMsg = send(chat, 'is the arsenal jersey available?');
    await sleep(10); // inside the quiet period
    const ownerReply = send(chat, 'yes sir, size M and L available', { fromMe: true });
    await Promise.all([customerMsg, ownerReply]);

    expect(replies(chat)).toHaveLength(0); // the AI did not talk over the owner
    const c = await conv(chat);
    expect(c.mode).toBe('HUMAN');
    expect(c.handoffBy).toBe('OWNER');
  });
});

describe('a chat handed to a human is never left on silence', () => {
  it('pauses the AI, tells the owner, and sends the customer ONE holding message', async () => {
    const chat = newChat();
    agent.next = { reply: 'I am sorry about that. Let me get the owner.', handoffReason: 'Customer demands a refund' };
    await send(chat, 'my jersey arrived torn, refund me now');

    let c = await conv(chat);
    expect(c).toMatchObject({ mode: 'HUMAN', handoffBy: 'AI' });
    expect(notifier.alerts).toContainEqual(expect.objectContaining({ type: 'handoff', kind: 'handoff', reason: 'Customer demands a refund' }));

    // the customer writes again straight away: the AI stays out and does not repeat itself
    const callsBefore = agent.calls;
    await send(chat, 'hello??');
    expect(agent.calls).toBe(callsBefore);
    expect(replies(chat)).toHaveLength(1);

    // some time later they write again and are told the owner has been informed, exactly once
    await prisma.message.updateMany({ where: { conversationId: c.id }, data: { createdAt: minutesAgo(11) } });
    await send(chat, 'anybody there?');
    await send(chat, 'please reply me');
    const out = replies(chat);
    expect(out).toHaveLength(2);
    expect(out[1]).toContain("I've told the owner");
    c = await conv(chat);
    expect(c.mode).toBe('HUMAN');
  });

  it('does not send holding messages while the owner is actively in the chat', async () => {
    const chat = newChat();
    await send(chat, 'hello', { fromMe: true }); // owner types first
    await send(chat, 'thanks, is it available?');
    expect(replies(chat)).toHaveLength(0);
  });
});

describe('soft alerts keep the AI working', () => {
  it('tells the owner but does not pause the chat', async () => {
    const chat = newChat();
    agent.next = { reply: 'Noted, the owner will confirm your transfer.', notifyReason: 'Customer says they paid by transfer' };
    await send(chat, 'I have paid by transfer');

    expect(replies(chat)).toEqual(['Noted, the owner will confirm your transfer.']);
    expect((await conv(chat)).mode).toBe('AI');
    expect(notifier.alerts).toContainEqual(expect.objectContaining({ type: 'handoff', kind: 'attention', reason: 'Customer says they paid by transfer' }));

    agent.next = { reply: 'Sure, anything else?' };
    await send(chat, 'do you have shoes too?');
    expect(replies(chat)).toHaveLength(2); // the AI is still answering
  });

  it('treats a screenshot from someone with an unpaid order as possible payment proof, and keeps answering', async () => {
    const chat = newChat();
    await send(chat, 'hi'); // creates the customer and conversation
    const { orderNumber } = await unpaidOrder(chat);
    notifier.alerts.length = 0;

    agent.next = { reply: 'Got your image. Payment confirms automatically when you use the link.' };
    await send(chat, '', { type: 'image' });

    // the alert is sent in the background, so wait for it
    await until(() => notifier.alerts.some((a) => (a as { kind?: string }).kind === 'attention'));
    const alert = notifier.alerts.find((a) => (a as { kind?: string }).kind === 'attention') as { reason: string };
    expect(alert.reason).toContain(orderNumber);
    expect(alert.reason).toContain(`/paid ${orderNumber}`);
    expect((await conv(chat)).mode).toBe('AI'); // the screenshot did NOT lock the chat
    expect(replies(chat).at(-1)).toContain('Got your image');
  });
});

describe('chats come back to the AI by themselves', () => {
  it('resumes an AI handoff nobody answered, and replies to the customer who was waiting', async () => {
    const chat = newChat();
    agent.next = { reply: 'Let me get the owner.', handoffReason: 'Refund' };
    await send(chat, 'refund me');
    const c = await conv(chat);

    // five minutes in: still waiting for the owner
    await prisma.conversation.update({ where: { id: c.id }, data: { humanSince: minutesAgo(5) } });
    expect(await jobs.resumeDue(new Date(), merchantId)).toBe(0);
    expect((await conv(chat)).mode).toBe('HUMAN');

    // the customer wrote again and the owner never came: after the timeout the AI takes the chat back
    await prisma.message.create({ data: { merchantId, conversationId: c.id, direction: 'INBOUND', sender: 'CUSTOMER', type: 'text', text: 'hello??' } });
    await prisma.conversation.update({ where: { id: c.id }, data: { humanSince: minutesAgo(31) } });
    agent.next = { reply: 'Sorry for the wait! How can I help?' };
    expect(await jobs.resumeDue(new Date(), merchantId)).toBe(1);

    expect(await conv(chat)).toMatchObject({ mode: 'AI', handoffBy: null, humanSince: null });
    await until(() => replies(chat).includes('Sorry for the wait! How can I help?'));
  });

  it('keeps an owner takeover while the owner is active, and releases it after they go quiet', async () => {
    const chat = newChat();
    await send(chat, 'hi there', { fromMe: true });
    const c = await conv(chat);

    // stepped in 7 hours ago, but replied again 1 hour ago: still theirs
    await prisma.conversation.update({ where: { id: c.id }, data: { humanSince: new Date(Date.now() - 7 * 3_600_000) } });
    await prisma.message.updateMany({ where: { conversationId: c.id, sender: 'OWNER' }, data: { createdAt: new Date(Date.now() - 3_600_000) } });
    expect(await jobs.resumeDue(new Date(), merchantId)).toBe(0);

    // the owner's last message was 7 hours ago: the AI takes over again
    await prisma.message.updateMany({ where: { conversationId: c.id, sender: 'OWNER' }, data: { createdAt: new Date(Date.now() - 7 * 3_600_000) } });
    expect(await jobs.resumeDue(new Date(), merchantId)).toBe(1);
    expect((await conv(chat)).mode).toBe('AI');
  });
});

describe('owner commands', () => {
  it('/chats lists waiting chats and /resume gives one back to the AI, which answers the waiting customer', async () => {
    const chat = newChat();
    agent.next = { reply: 'Let me get the owner.', handoffReason: 'Wants a discount beyond the limit' };
    await send(chat, 'give me half price');
    await prisma.message.create({ data: { merchantId, conversationId: (await conv(chat)).id, direction: 'INBOUND', sender: 'CUSTOMER', type: 'text', text: 'abeg?' } });

    await send(OWNER_PHONE, '/chats');
    expect(replies(OWNER_PHONE).at(-1)).toContain(chat);

    agent.next = { reply: 'Thanks for waiting! Here is what I can do.' };
    await send(OWNER_PHONE, `/resume ${chat}`);
    expect(replies(OWNER_PHONE).at(-1)).toContain('back with the AI');
    expect((await conv(chat)).mode).toBe('AI');
    await until(() => replies(chat).includes('Thanks for waiting! Here is what I can do.'));
  });

  it('/paid confirms a bank transfer: order paid, customer gets a receipt, repeating it is harmless', async () => {
    const chat = newChat();
    await send(chat, 'hi');
    const { orderNumber } = await unpaidOrder(chat);

    await send(OWNER_PHONE, `/paid ${orderNumber}`);
    expect(replies(OWNER_PHONE).at(-1)).toContain('marked as paid');
    const order = await prisma.order.findFirstOrThrow({ where: { merchantId, orderNumber }, include: { receipt: true } });
    expect(order.status).toBe('PAID');
    expect(order.receipt?.sentAt).not.toBeNull();
    expect(gateway.sent.filter((s) => s.chatId === chat && s.kind === 'document')).toHaveLength(1);

    await send(OWNER_PHONE, `/paid ${orderNumber.slice(4)}`); // "000123" without the ORD- prefix
    expect(replies(OWNER_PHONE).at(-1)).toContain('already paid');
    expect(gateway.sent.filter((s) => s.chatId === chat && s.kind === 'document')).toHaveLength(1);
  });

  it('/paid with an unknown order, and unknown commands, get a clear answer', async () => {
    await send(OWNER_PHONE, '/paid ORD-999999');
    expect(replies(OWNER_PHONE).at(-1)).toContain('could not find');
    await send(OWNER_PHONE, '/dance');
    expect(replies(OWNER_PHONE).at(-1)).toContain('/help');
  });

  it('a customer can never run an owner command', async () => {
    const chat = newChat();
    await send(chat, 'hi');
    const { orderNumber } = await unpaidOrder(chat);

    agent.next = { reply: 'I cannot confirm payments myself.' };
    await send(chat, `/paid ${orderNumber}`);

    expect((await prisma.order.findFirstOrThrow({ where: { merchantId, orderNumber } })).status).toBe('AWAITING_PAYMENT');
    expect(replies(chat).at(-1)).toBe('I cannot confirm payments myself.'); // treated as an ordinary message
  });
});

/** An order sitting at AWAITING_PAYMENT for this chat's customer. */
async function unpaidOrder(chatId: string) {
  const product = await prisma.product.create({
    data: { merchantId, name: 'Test Jersey', category: 'JERSEY', imageKeys: [], variants: { create: [{ merchantId, size: 'M', priceKobo: 1_500_000, minPriceKobo: 1_200_000, stock: 5 }] } },
    include: { variants: true },
  });
  const c = await conv(chatId);
  await prisma.customer.update({ where: { id: c.customerId }, data: { name: 'Pipe Tester', address: '1 Test Street, Ikeja, Lagos' } });
  await orders.setItem(merchantId, c.customerId, c.id, product.variants[0]!.id, 1);
  const { order } = await orders.checkout(merchantId, c.id);
  return { orderNumber: order.orderNumber };
}
