var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LlmClient_1;
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { llm } from '../config/env.js';
let LlmClient = LlmClient_1 = class LlmClient {
    log = new Logger(LlmClient_1.name);
    client = new OpenAI({
        apiKey: llm.apiKey,
        baseURL: llm.baseURL,
        maxRetries: 3,
    });
    usage = { calls: 0, promptTokens: 0, completionTokens: 0 };
    constructor() {
        this.log.log(`Chat model: ${llm.model} via ${llm.provider}${llm.fallbackModel ? ` (fallback ${llm.fallbackModel})` : ''}`);
    }
    async chat(messages, tools, forceTool) {
        try {
            return await this.callWithToolRetry(llm.model, messages, tools, forceTool);
        }
        catch (err) {
            if (err instanceof OpenAI.RateLimitError && llm.fallbackModel && llm.fallbackModel !== llm.model) {
                this.log.warn(`Rate limited on ${llm.model}, falling back to ${llm.fallbackModel}`);
                return this.callWithToolRetry(llm.fallbackModel, messages, tools, forceTool);
            }
            throw err;
        }
    }
    async callWithToolRetry(model, messages, tools, forceTool) {
        try {
            return await this.call(model, messages, tools, forceTool);
        }
        catch (err) {
            if (err instanceof OpenAI.BadRequestError && /tool/i.test(err.message)) {
                this.log.warn(`Tool call rejected, retrying once: ${err.message.slice(0, 160)}`);
                return this.call(model, messages, tools, forceTool);
            }
            throw err;
        }
    }
    async call(model, messages, tools, forceTool) {
        const res = await this.client.chat.completions.create({
            model,
            messages,
            ...(tools.length
                ? { tools, tool_choice: forceTool ? { type: 'function', function: { name: forceTool } } : 'auto' }
                : {}),
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
        return res.choices[0].message;
    }
};
LlmClient = LlmClient_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], LlmClient);
export { LlmClient };
//# sourceMappingURL=llm.client.js.map