import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module.js';
import { StorageModule } from './storage/storage.module.js';
import { MessagingModule } from './messaging/messaging.module.js';
import { HandoffModule } from './handoff/handoff.module.js';
import { CommerceModule } from './commerce/commerce.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    StorageModule,
    MessagingModule,
    HandoffModule,
    CommerceModule,
    PaymentsModule,
    ConversationsModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
