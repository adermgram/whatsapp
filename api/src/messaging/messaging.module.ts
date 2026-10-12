import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { env } from '../config/env.js';
import { MessagingGateway } from './messaging.types.js';
import { SimulatorGateway } from './simulator.gateway.js';
import { ChatAccess } from './chat-access.js';

// The one place that decides which WhatsApp adapter is live. Nothing else imports an adapter, so moving to the
// official Cloud API means adding an adapter here. Baileys is loaded lazily, so tests and the terminal chat
// do not pay for (or accidentally start) a real WhatsApp connection.
@Global()
@Module({
  providers: [
    SimulatorGateway,
    ChatAccess,
    {
      provide: MessagingGateway,
      inject: [SimulatorGateway, PrismaService, ChatAccess],
      useFactory: async (simulator: SimulatorGateway, prisma: PrismaService, access: ChatAccess): Promise<MessagingGateway> => {
        if (env.WHATSAPP_ADAPTER !== 'baileys') return simulator;
        const { BaileysGateway } = await import('./baileys/baileys.gateway.js');
        return new BaileysGateway(prisma, access);
      },
    },
  ],
  exports: [MessagingGateway, SimulatorGateway, ChatAccess],
})
export class MessagingModule {}
