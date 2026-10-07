import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { HandoffService } from '../handoff/handoff.service.js';
import { ConversationService } from './conversation.service.js';
import { env } from '../config/env.js';

/**
 * A chat must never stay with "a human" forever. Nobody wants to babysit a database column.
 *   - the AI asked for the owner and the owner never answered: the AI takes the chat back after a while
 *   - the owner replied, then went quiet: the AI takes the chat back after a longer while
 * Anything the customer wrote in the meantime is answered straight away on resume.
 */
@Injectable()
export class ChatResumeJobs {
  private readonly log = new Logger(ChatResumeJobs.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly handoffs: HandoffService,
    private readonly conversations: ConversationService,
  ) {}

  @Cron('* * * * *')
  async tick() {
    if (env.DISABLE_JOBS === 'true' || this.running) return;
    this.running = true;
    try {
      const n = await this.resumeDue();
      if (n) this.log.log(`Gave ${n} chat(s) back to the AI`);
    } catch (err) {
      this.log.error(`Resume job failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      this.running = false;
    }
  }

  /** Returns how many chats were handed back. `now` and `merchantId` are parameters so tests can fast-forward time and stay out of real stores. */
  async resumeDue(now = new Date(), merchantId?: string): Promise<number> {
    const aiCutoff = now.getTime() - env.AI_HANDOFF_RESUME_MINUTES * 60_000;
    const ownerCutoff = now.getTime() - env.OWNER_TAKEOVER_RESUME_HOURS * 3_600_000;

    const humans = await this.prisma.conversation.findMany({ where: { mode: 'HUMAN', ...(merchantId ? { merchantId } : {}) }, take: 200 });
    let resumed = 0;
    for (const c of humans) {
      const since = (c.humanSince ?? c.lastMessageAt).getTime();
      let due: boolean;
      if (c.handoffBy === 'OWNER') {
        // measured from the owner's last message, not from when they first stepped in
        const lastOwner = await this.prisma.message.findFirst({
          where: { conversationId: c.id, sender: 'OWNER' },
          orderBy: { createdAt: 'desc' },
        });
        due = (lastOwner?.createdAt.getTime() ?? since) < ownerCutoff;
      } else {
        due = since < aiCutoff; // AI-requested handoff (or an old row with no source recorded)
      }
      if (!due) continue;

      await this.handoffs.resumeAi(c.id);
      resumed++;
      void this.conversations.catchUp(c.id).catch((e) => this.log.error(`catch-up failed: ${String(e)}`));
    }
    return resumed;
  }
}
