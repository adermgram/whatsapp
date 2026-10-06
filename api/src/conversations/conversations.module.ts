import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module.js';
import { GroqSpeechToText, SpeechToText } from '../speech/speech-to-text.js';
import { ConversationService } from './conversation.service.js';

@Module({
  imports: [AgentModule],
  providers: [ConversationService, { provide: SpeechToText, useClass: GroqSpeechToText }],
  exports: [ConversationService],
})
export class ConversationsModule {}
