var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { NegotiationService } from '../negotiation/negotiation.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { PaymentProvider } from '../payments/payment.provider.js';
import { PaystackProvider } from '../payments/paystack.provider.js';
import { FakePaymentProvider } from '../payments/fake-payment.provider.js';
import { env } from '../config/env.js';
let CommerceModule = class CommerceModule {
};
CommerceModule = __decorate([
    Module({
        providers: [
            CatalogService,
            InventoryService,
            NegotiationService,
            OrdersService,
            PaystackProvider,
            FakePaymentProvider,
            {
                provide: PaymentProvider,
                useFactory: (paystack, fake) => env.PAYMENT_DRIVER === 'paystack' ? paystack : fake,
                inject: [PaystackProvider, FakePaymentProvider],
            },
        ],
        exports: [CatalogService, InventoryService, NegotiationService, OrdersService, PaymentProvider, FakePaymentProvider],
    })
], CommerceModule);
export { CommerceModule };
//# sourceMappingURL=commerce.module.js.map