import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { AccessAdminService } from './access.admin.service.js';
import { ChatsAdminService } from './chats.admin.service.js';
import { OperationsController } from './operations.controller.js';
import { OrdersAdminService } from './orders.admin.service.js';
import { ProductsAdminService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { WhatsAppAdminService } from './whatsapp.admin.service.js';

/** The owner's dashboard API. Login lives in AuthModule; everything here requires it. */
@Module({
  imports: [PaymentsModule, ConversationsModule],
  controllers: [ProductsController, OperationsController],
  providers: [ProductsAdminService, OrdersAdminService, ChatsAdminService, AccessAdminService, WhatsAppAdminService],
  exports: [ProductsAdminService],
})
export class AdminModule {}
