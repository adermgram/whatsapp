var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module.js';
import { StorageModule } from './storage/storage.module.js';
import { MessagingModule } from './messaging/messaging.module.js';
import { HandoffModule } from './handoff/handoff.module.js';
import { CommerceModule } from './commerce/commerce.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ScheduleModule.forRoot(),
            PrismaModule,
            StorageModule,
            MessagingModule,
            HandoffModule,
            CommerceModule,
            PaymentsModule,
            ConversationsModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map