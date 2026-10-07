import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().optional(),
    PORT: z.coerce.number().default(3000),
    DASHBOARD_ORIGIN: z.string().default('http://localhost:3001'),
    SESSION_DAYS: z.coerce.number().min(1).max(90).default(7),
    JWT_SECRET: z.string().default('dev-only-change-me'),
    ENCRYPTION_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().min(1),
    GROQ_BASE_URL: z.string().default('https://api.groq.com/openai/v1'),
    GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
    GROQ_REASONING_EFFORT: z.enum(['low', 'medium', 'high']).default('medium'),
    GROQ_STT_MODEL: z.string().default('whisper-large-v3-turbo'),
    LLM_API_KEY: z.string().optional(),
    LLM_BASE_URL: z.string().optional(),
    LLM_MODEL: z.string().optional(),
    LLM_FALLBACK_MODEL: z.string().optional(),
    LLM_REASONING_EFFORT: z.enum(['low', 'medium', 'high', 'off']).optional(),
    LLM_TEMPERATURE: z.string().optional(),
    WHATSAPP_ADAPTER: z.enum(['baileys', 'simulator']).default('simulator'),
    WHATSAPP_ALLOWLIST: z.string().default(''),
    WHATSAPP_REPLY_TO_ALL: z.enum(['true', 'false']).default('false'),
    WHATSAPP_CONNECT_EMAIL: z.string().default('demo@shopbot.local'),
    WHATSAPP_PAIRING_PHONE: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(465),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    MESSAGE_DEBOUNCE_MS: z.coerce.number().min(0).optional(),
    AI_HANDOFF_RESUME_MINUTES: z.coerce.number().min(1).default(30),
    OWNER_TAKEOVER_RESUME_HOURS: z.coerce.number().min(0.1).default(6),
    HOLDING_REPLY_GAP_MINUTES: z.coerce.number().min(1).default(10),
    DISABLE_JOBS: z.enum(['true', 'false']).default('false'),
    PAYMENT_DRIVER: z.enum(['paystack', 'fake']).default('fake'),
    STORAGE_DIR: z.string().default('./storage'),
    PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
    PAYMENT_EMAIL_DOMAIN: z.string().default('customers.shopbot.app'),
});
export const env = schema.parse(process.env);
if (process.env.NODE_ENV === 'production' && (env.JWT_SECRET === 'dev-only-change-me' || env.JWT_SECRET.length < 32)) {
    throw new Error('JWT_SECRET must be set to a long random value (32+ characters) in production');
}
const usingGroq = (env.LLM_BASE_URL ?? env.GROQ_BASE_URL).includes('groq.com');
export const llm = {
    apiKey: env.LLM_API_KEY ?? env.GROQ_API_KEY,
    baseURL: env.LLM_BASE_URL ?? env.GROQ_BASE_URL,
    model: env.LLM_MODEL ?? env.GROQ_MODEL,
    fallbackModel: env.LLM_FALLBACK_MODEL === 'none' ? null : (env.LLM_FALLBACK_MODEL ?? (usingGroq ? 'openai/gpt-oss-20b' : null)),
    reasoningEffort: env.LLM_REASONING_EFFORT ?? (usingGroq ? env.GROQ_REASONING_EFFORT : 'off'),
    temperature: env.LLM_TEMPERATURE === 'off' ? null : Number(env.LLM_TEMPERATURE ?? 0.3),
    provider: usingGroq ? 'groq' : 'openai-compatible',
};
export const debounceMs = env.MESSAGE_DEBOUNCE_MS ?? (env.WHATSAPP_ADAPTER === 'baileys' ? 3500 : 0);
//# sourceMappingURL=env.js.map