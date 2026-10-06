import { Global, Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.types.js';
import { SimulatorGateway } from './simulator.gateway.js';

// Swap the adapter here (Baileys now, WhatsApp Cloud API later). Nothing else imports an adapter.
@Global()
@Module({
  providers: [SimulatorGateway, { provide: MessagingGateway, useExisting: SimulatorGateway }],
  exports: [MessagingGateway, SimulatorGateway],
})
export class MessagingModule {}
