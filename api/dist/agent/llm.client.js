var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LlmClient_1;
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { env } from '../config/env.js';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';
let LlmClient = LlmClient_1 = class LlmClient {
    log = new Logger(LlmClient_1.name);
    client = new OpenAI({
        apiKey: env.GROQ_API_KEY,
        baseURL: env.GROQ_BASE_URL,
        maxRetries: 3,
    });
    async chat(messages, tools) {
        try {
            return await this.callWithToolRetry(env.GROQ_MODEL, messages, tools);
        }
        catch (err) {
            if (err instanceof OpenAI.RateLimitError && FALLBACK_MODEL !== env.GROQ_MODEL) {
                this.log.warn(`Rate limited on ${env.GROQ_MODEL}, falling back to ${FALLBACK_MODEL}`);
                return this.callWithToolRetry(FALLBACK_MODEL, messages, tools);
            }
            throw err;
        }
    }
    async callWithToolRetry(model, messages, tools) {
        try {
            return await this.call(model, messages, tools);
        }
        catch (err) {
            if (err instanceof OpenAI.BadRequestError && /tool/i.test(err.message)) {
                this.log.warn(`Tool call rejected by Groq, retrying once: ${err.message.slice(0, 160)}`);
                return this.call(model, messages, tools);
            }
            throw err;
        }
    }
    async call(model, messages, tools) {
        const res = await this.client.chat.completions.create({
            model,
            messages,
            tools,
            tool_choice: 'auto',
            temperature: 0.3,
            max_completion_tokens: 700,
            reasoning_effort: env.GROQ_REASONING_EFFORT,
        });
        const usage = res.usage;
        if (usage)
            this.log.debug(`${model}: ${usage.prompt_tokens} in / ${usage.completion_tokens} out`);
        return res.choices[0].message;
    }
};
LlmClient = LlmClient_1 = __decorate([
    Injectable()
], LlmClient);
export { LlmClient };
//# sourceMappingURL=llm.client.js.map