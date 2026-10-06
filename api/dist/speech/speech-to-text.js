var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { env } from '../config/env.js';
export class SpeechToText {
}
let GroqSpeechToText = class GroqSpeechToText extends SpeechToText {
    client = new OpenAI({ apiKey: env.GROQ_API_KEY, baseURL: env.GROQ_BASE_URL, maxRetries: 2 });
    async transcribe(audio, mimeType = 'audio/ogg') {
        const ext = mimeType.includes('mpeg') ? 'mp3' : mimeType.includes('mp4') ? 'm4a' : 'ogg';
        const file = await toFile(audio, `voice.${ext}`, { type: mimeType });
        const res = await this.client.audio.transcriptions.create({
            file,
            model: env.GROQ_STT_MODEL,
            response_format: 'json',
            temperature: 0,
        });
        return res.text.trim();
    }
};
GroqSpeechToText = __decorate([
    Injectable()
], GroqSpeechToText);
export { GroqSpeechToText };
//# sourceMappingURL=speech-to-text.js.map