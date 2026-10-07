import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
export declare class LlmClient {
    private readonly log;
    private readonly client;
    readonly usage: {
        calls: number;
        promptTokens: number;
        completionTokens: number;
    };
    constructor();
    chat(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[], forceTool?: string): Promise<OpenAI.Chat.Completions.ChatCompletionMessage>;
    private callWithToolRetry;
    private call;
}
