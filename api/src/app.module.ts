import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { MessagingModule } from './messaging/messaging.module.js';
import { HandoffModule } from './handoff/handoff.module.js';
import { CommerceModule } from './commerce/commerce.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';

@Module({
  imports: [PrismaModule, MessagingModule, HandoffModule, CommerceModule, ConversationsModule],
})
export class AppModule {}
