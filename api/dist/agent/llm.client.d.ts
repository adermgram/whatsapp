import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
export declare class LlmClient {
    private readonly log;
    private readonly client;
    chat(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[]): Promise<OpenAI.Chat.Completions.ChatCompletionMessage>;
    private callWithToolRetry;
    private call;
}
