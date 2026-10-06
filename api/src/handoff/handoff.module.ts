import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { env } from '../config/env.js';
import { HandoffService } from './handoff.service.js';
import { Mailer, NodemailerMailer } from './mailer.js';
import { LogOwnerNotifier, OwnerNotifier } from './owner-notifier.js';
import { WhatsAppOwnerNotifier } from './whatsapp-owner-notifier.js';

// Real WhatsApp (+ email) alerts when the bot is live; a logging notifier for the simulator, scripts and tests.
@Global()
@Module({
  providers: [
    HandoffService,
    { provide: Mailer, useClass: NodemailerMailer },
    {
      provide: OwnerNotifier,
      inject: [PrismaService, MessagingGateway, Mailer],
      useFactory: (prisma: PrismaService, gateway: MessagingGateway, mailer: Mailer) =>
        env.WHATSAPP_ADAPTER === 'baileys' ? new WhatsAppOwnerNotifier(prisma, gateway, mailer) : new LogOwnerNotifier(),
    },
  ],
  exports: [HandoffService, OwnerNotifier, Mailer],
})
export class HandoffModule {}
