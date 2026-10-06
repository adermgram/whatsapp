import { Module } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { PaymentProvider } from '../payments/payment.provider.js';
import { PaystackProvider } from '../payments/paystack.provider.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { env } from '../config/env.js';

@Module({
  providers: [
    CatalogService,
    InventoryService,
    NegotiationService,
    OrdersService,
    PaystackProvider,
    FakePaymentProvider,
    {
      provide: PaymentProvider,
      useFactory: (paystack: PaystackProvider, fake: FakePaymentProvider) =>
        env.PAYMENT_DRIVER === 'paystack' ? paystack : fake,
      inject: [PaystackProvider, FakePaymentProvider],
    },
  ],
  exports: [CatalogService, InventoryService, NegotiationService, OrdersService, PaymentProvider, FakePaymentProvider],
})
export class CommerceModule {}
