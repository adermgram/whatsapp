import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { GroqSpeechToText, SpeechToText } from '../speech/speech-to-text.js';
import { ChatResumeJobs } from './chat-resume.jobs.js';
import { ConversationService } from './conversation.service.js';
import { OwnerCommands } from './owner-commands.js';

@Module({
  imports: [AgentModule, PaymentsModule],
  providers: [
    ConversationService,
    OwnerCommands,
    ChatResumeJobs,
    { provide: SpeechToText, useClass: GroqSpeechToText },
  ],
  exports: [ConversationService, ChatResumeJobs],
})
export class ConversationsModule {}
