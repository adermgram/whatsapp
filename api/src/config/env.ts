import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default('dev-only-change-me'),
  ENCRYPTION_KEY: z.string().optional(),

  GROQ_API_KEY: z.string().min(1),
  GROQ_BASE_URL: z.string().default('https://api.groq.com/openai/v1'),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  GROQ_REASONING_EFFORT: z.enum(['low', 'medium', 'high']).default('medium'),
  GROQ_STT_MODEL: z.string().default('whisper-large-v3-turbo'),

  WHATSAPP_ADAPTER: z.enum(['baileys', 'simulator']).default('simulator'),
  PAYMENT_DRIVER: z.enum(['paystack', 'fake']).default('fake'),
  STORAGE_DIR: z.string().default('./storage'),
  PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
  // Paystack needs an email; WhatsApp customers have none, so we synthesise one from their number.
  PAYMENT_EMAIL_DOMAIN: z.string().default('customers.shopbot.app'),
});

export type Env = z.infer<typeof schema>;

export const env: Env = schema.parse(process.env);
