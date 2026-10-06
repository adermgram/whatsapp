export declare abstract class SpeechToText {
    abstract transcribe(audio: Buffer, mimeType?: string): Promise<string>;
}
export declare class GroqSpeechToText extends SpeechToText {
    private readonly client;
    transcribe(audio: Buffer, mimeType?: string): Promise<string>;
}
