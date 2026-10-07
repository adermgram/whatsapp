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

  // Chat model provider. Unset = Groq (above). To use OpenAI instead, set LLM_API_KEY, LLM_BASE_URL and LLM_MODEL.
  LLM_API_KEY: z.string().optional(),
  LLM_BASE_URL: z.string().optional(),
  LLM_MODEL: z.string().optional(),
  LLM_FALLBACK_MODEL: z.string().optional(), // used on rate limits; 'none' disables
  LLM_REASONING_EFFORT: z.enum(['low', 'medium', 'high', 'off']).optional(), // 'off' = do not send the parameter
  LLM_TEMPERATURE: z.string().optional(), // number, or 'off' for models that only accept the default (gpt-5 family)

  WHATSAPP_ADAPTER: z.enum(['baileys', 'simulator']).default('simulator'),
  // Real WhatsApp safety: the bot answers NOBODY unless the chat is on the allowlist or REPLY_TO_ALL is true.
  WHATSAPP_ALLOWLIST: z.string().default(''), // comma-separated numbers, e.g. 2348012345678,08098765432
  WHATSAPP_REPLY_TO_ALL: z.enum(['true', 'false']).default('false'),
  WHATSAPP_CONNECT_EMAIL: z.string().default('demo@shopbot.local'), // merchant to link when no session exists yet
  WHATSAPP_PAIRING_PHONE: z.string().optional(), // link with an 8-letter code instead of a QR (digits with country code)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  // Customers often send one thought across several short messages. Wait this long after the LAST message
  // before answering, then answer them all together. Default: 3.5s on real WhatsApp, 0 for the simulator.
  MESSAGE_DEBOUNCE_MS: z.coerce.number().min(0).optional(),
  // How long a chat stays with a human before the AI takes over again.
  AI_HANDOFF_RESUME_MINUTES: z.coerce.number().min(1).default(30), // the AI asked for the owner and nobody replied
  OWNER_TAKEOVER_RESUME_HOURS: z.coerce.number().min(0.1).default(6), // the owner replied, then went quiet for this long
  HOLDING_REPLY_GAP_MINUTES: z.coerce.number().min(1).default(10), // at most one "owner will reply soon" per this window
  PAYMENT_DRIVER: z.enum(['paystack', 'fake']).default('fake'),
  STORAGE_DIR: z.string().default('./storage'),
  PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
  // Paystack needs an email; WhatsApp customers have none, so we synthesise one from their number.
  PAYMENT_EMAIL_DOMAIN: z.string().default('customers.shopbot.app'),
});

export type Env = z.infer<typeof schema>;

export const env: Env = schema.parse(process.env);

const usingGroq = (env.LLM_BASE_URL ?? env.GROQ_BASE_URL).includes('groq.com');

/** Effective chat-model settings: Groq by default, any OpenAI-compatible provider via LLM_*. */
export const llm = {
  apiKey: env.LLM_API_KEY ?? env.GROQ_API_KEY,
  baseURL: env.LLM_BASE_URL ?? env.GROQ_BASE_URL,
  model: env.LLM_MODEL ?? env.GROQ_MODEL,
  // Groq's free tier limits tokens per minute PER MODEL, so a second model doubles the headroom there.
  fallbackModel:
    env.LLM_FALLBACK_MODEL === 'none' ? null : (env.LLM_FALLBACK_MODEL ?? (usingGroq ? 'openai/gpt-oss-20b' : null)),
  reasoningEffort: env.LLM_REASONING_EFFORT ?? (usingGroq ? env.GROQ_REASONING_EFFORT : 'off'),
  temperature: env.LLM_TEMPERATURE === 'off' ? null : Number(env.LLM_TEMPERATURE ?? 0.3),
  provider: usingGroq ? 'groq' : 'openai-compatible',
};

/** Quiet period before the AI answers a burst of messages. */
export const debounceMs = env.MESSAGE_DEBOUNCE_MS ?? (env.WHATSAPP_ADAPTER === 'baileys' ? 3500 : 0);
