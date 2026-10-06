import { Module } from '@nestjs/common';
import { CommerceModule } from '../commerce/commerce.module.js';
import { AgentService } from './agent.service.js';
import { LlmClient } from './llm.client.js';
import { Toolbox } from './toolbox.js';

@Module({
  imports: [CommerceModule],
  providers: [LlmClient, Toolbox, AgentService],
  exports: [AgentService],
})
export class AgentModule {}
