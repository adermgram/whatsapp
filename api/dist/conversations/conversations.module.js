var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { GroqSpeechToText, SpeechToText } from '../speech/speech-to-text.js';
import { ChatResumeJobs } from './chat-resume.jobs.js';
import { ConversationService } from './conversation.service.js';
import { OwnerCommands } from './owner-commands.js';
let ConversationsModule = class ConversationsModule {
};
ConversationsModule = __decorate([
    Module({
        imports: [AgentModule, PaymentsModule],
        providers: [
            ConversationService,
            OwnerCommands,
            ChatResumeJobs,
            { provide: SpeechToText, useClass: GroqSpeechToText },
        ],
        exports: [ConversationService, ChatResumeJobs],
    })
], ConversationsModule);
export { ConversationsModule };
//# sourceMappingURL=conversations.module.js.map