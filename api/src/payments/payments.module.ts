import { Module } from '@nestjs/common';
import { CommerceModule } from '../commerce/commerce.module.js';
import { ReceiptsModule } from '../receipts/receipts.module.js';
import { PaymentConfirmationService } from './payment-confirmation.service.js';
import { PaymentJobs } from './payment.jobs.js';
import { PaystackWebhookController } from './paystack-webhook.controller.js';

@Module({
  imports: [CommerceModule, ReceiptsModule],
  controllers: [PaystackWebhookController],
  providers: [PaymentConfirmationService, PaymentJobs],
  exports: [PaymentConfirmationService],
})
export class PaymentsModule {}
