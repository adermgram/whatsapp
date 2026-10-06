import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';
import { env } from '../config/env.js';

/** Groq's free tier limits tokens per minute PER MODEL, so a second model doubles our headroom. */
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

@Injectable()
export class LlmClient {
  private readonly log = new Logger(LlmClient.name);
  private readonly client = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: env.GROQ_BASE_URL,
    maxRetries: 3, // the SDK honours Retry-After on 429
  });

  async chat(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[]) {
    try {
      return await this.callWithToolRetry(env.GROQ_MODEL, messages, tools);
    } catch (err) {
      if (err instanceof OpenAI.RateLimitError && FALLBACK_MODEL !== env.GROQ_MODEL) {
        this.log.warn(`Rate limited on ${env.GROQ_MODEL}, falling back to ${FALLBACK_MODEL}`);
        return this.callWithToolRetry(FALLBACK_MODEL, messages, tools);
      }
      throw err;
    }
  }

  /** Groq rejects a malformed tool call with a 400. The model usually gets it right on a second try. */
  private async callWithToolRetry(
    model: string,
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[],
  ) {
    try {
      return await this.call(model, messages, tools);
    } catch (err) {
      if (err instanceof OpenAI.BadRequestError && /tool/i.test(err.message)) {
        this.log.warn(`Tool call rejected by Groq, retrying once: ${err.message.slice(0, 160)}`);
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
      tools,
      tool_choice: 'auto',
      temperature: 0.3,
      max_completion_tokens: 700,
      reasoning_effort: env.GROQ_REASONING_EFFORT, // low saves free-tier tokens/min but hurts fluency
    });
    const usage = res.usage;
    if (usage) this.log.debug(`${model}: ${usage.prompt_tokens} in / ${usage.completion_tokens} out`);
    return res.choices[0]!.message;
  }
}
