var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { env } from '../config/env.js';
import { MessagingGateway } from './messaging.types.js';
import { SimulatorGateway } from './simulator.gateway.js';
let MessagingModule = class MessagingModule {
};
MessagingModule = __decorate([
    Global(),
    Module({
        providers: [
            SimulatorGateway,
            {
                provide: MessagingGateway,
                inject: [SimulatorGateway, PrismaService],
                useFactory: async (simulator, prisma) => {
                    if (env.WHATSAPP_ADAPTER !== 'baileys')
                        return simulator;
                    const { BaileysGateway } = await import('./baileys/baileys.gateway.js');
                    return new BaileysGateway(prisma);
                },
            },
        ],
        exports: [MessagingGateway, SimulatorGateway],
    })
], MessagingModule);
export { MessagingModule };
//# sourceMappingURL=messaging.module.js.map