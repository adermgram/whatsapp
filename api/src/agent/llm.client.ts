import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';
import { llm } from '../config/env.js';

@Injectable()
export class LlmClient {
  private readonly log = new Logger(LlmClient.name);
  private readonly client = new OpenAI({
    apiKey: llm.apiKey,
    baseURL: llm.baseURL,
    maxRetries: 3, // the SDK honours Retry-After on 429
  });

  /** Running totals, so a test run can report what it cost. */
  readonly usage = { calls: 0, promptTokens: 0, completionTokens: 0 };

  constructor() {
    this.log.log(`Chat model: ${llm.model} via ${llm.provider}${llm.fallbackModel ? ` (fallback ${llm.fallbackModel})` : ''}`);
  }

  async chat(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[]) {
    try {
      return await this.callWithToolRetry(llm.model, messages, tools);
    } catch (err) {
      if (err instanceof OpenAI.RateLimitError && llm.fallbackModel && llm.fallbackModel !== llm.model) {
        this.log.warn(`Rate limited on ${llm.model}, falling back to ${llm.fallbackModel}`);
        return this.callWithToolRetry(llm.fallbackModel, messages, tools);
      }
      throw err;
    }
  }

  /** A provider can reject a malformed tool call with a 400. The model usually gets it right on a second try. */
  private async callWithToolRetry(
    model: string,
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[],
  ) {
    try {
      return await this.call(model, messages, tools);
    } catch (err) {
      if (err instanceof OpenAI.BadRequestError && /tool/i.test(err.message)) {
        this.log.warn(`Tool call rejected, retrying once: ${err.message.slice(0, 160)}`);
        return this.call(model, messages, tools);
      }
      throw err;
    }
  }

  private async call(
    model: string,
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[],
  ) {
    const res = await this.client.chat.completions.create({
      model,
      messages,
      // Some providers reject an empty tools array, so only send it when there are tools.
      ...(tools.length ? { tools, tool_choice: 'auto' as const } : {}),
      ...(llm.temperature !== null ? { temperature: llm.temperature } : {}),
      max_completion_tokens: 700,
      ...(llm.reasoningEffort !== 'off' ? { reasoning_effort: llm.reasoningEffort } : {}),
    });
    const usage = res.usage;
    this.usage.calls++;
    if (usage) {
      this.usage.promptTokens += usage.prompt_tokens;
      this.usage.completionTokens += usage.completion_tokens;
      this.log.debug(`${model}: ${usage.prompt_tokens} in / ${usage.completion_tokens} out`);
    }
    return res.choices[0]!.message;
  }
}
