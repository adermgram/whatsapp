import { Injectable } from '@nestjs/common';
import OpenAI, { toFile } from 'openai';
import { env } from '../config/env.js';

/** Port. Groq Whisper today (free tier); swap for any provider without touching the pipeline. */
export abstract class SpeechToText {
  abstract transcribe(audio: Buffer, mimeType?: string): Promise<string>;
}

@Injectable()
export class GroqSpeechToText extends SpeechToText {
  private readonly client = new OpenAI({ apiKey: env.GROQ_API_KEY, baseURL: env.GROQ_BASE_URL, maxRetries: 2 });

  async transcribe(audio: Buffer, mimeType = 'audio/ogg'): Promise<string> {
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
}
