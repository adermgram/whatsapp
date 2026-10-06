var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagingGateway } from '../messaging/messaging.types.js';
import { env } from '../config/env.js';
import { HandoffService } from './handoff.service.js';
import { Mailer, NodemailerMailer } from './mailer.js';
import { LogOwnerNotifier, OwnerNotifier } from './owner-notifier.js';
import { WhatsAppOwnerNotifier } from './whatsapp-owner-notifier.js';
let HandoffModule = class HandoffModule {
};
HandoffModule = __decorate([
    Global(),
    Module({
        providers: [
            HandoffService,
            { provide: Mailer, useClass: NodemailerMailer },
            {
                provide: OwnerNotifier,
                inject: [PrismaService, MessagingGateway, Mailer],
                useFactory: (prisma, gateway, mailer) => env.WHATSAPP_ADAPTER === 'baileys' ? new WhatsAppOwnerNotifier(prisma, gateway, mailer) : new LogOwnerNotifier(),
            },
        ],
        exports: [HandoffService, OwnerNotifier, Mailer],
    })
], HandoffModule);
export { HandoffModule };
//# sourceMappingURL=handoff.module.js.map