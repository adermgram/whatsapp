import 'dotenv/config';
import { z } from 'zod';
declare const schema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    DIRECT_URL: z.ZodOptional<z.ZodString>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DASHBOARD_ORIGIN: z.ZodDefault<z.ZodString>;
    SESSION_DAYS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    ENCRYPTION_KEY: z.ZodOptional<z.ZodString>;
    GROQ_API_KEY: z.ZodString;
    GROQ_BASE_URL: z.ZodDefault<z.ZodString>;
    GROQ_MODEL: z.ZodDefault<z.ZodString>;
    GROQ_REASONING_EFFORT: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    GROQ_STT_MODEL: z.ZodDefault<z.ZodString>;
    LLM_API_KEY: z.ZodOptional<z.ZodString>;
    LLM_BASE_URL: z.ZodOptional<z.ZodString>;
    LLM_MODEL: z.ZodOptional<z.ZodString>;
    LLM_FALLBACK_MODEL: z.ZodOptional<z.ZodString>;
    LLM_REASONING_EFFORT: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        off: "off";
    }>>;
    LLM_TEMPERATURE: z.ZodOptional<z.ZodString>;
    WHATSAPP_ADAPTER: z.ZodDefault<z.ZodEnum<{
        baileys: "baileys";
        simulator: "simulator";
    }>>;
    WHATSAPP_ALLOWLIST: z.ZodDefault<z.ZodString>;
    WHATSAPP_REPLY_TO_ALL: z.ZodDefault<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    WHATSAPP_CONNECT_EMAIL: z.ZodDefault<z.ZodString>;
    WHATSAPP_PAIRING_PHONE: z.ZodOptional<z.ZodString>;
    SMTP_HOST: z.ZodOptional<z.ZodString>;
    SMTP_PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    SMTP_USER: z.ZodOptional<z.ZodString>;
    SMTP_PASS: z.ZodOptional<z.ZodString>;
    MAIL_FROM: z.ZodOptional<z.ZodString>;
    MESSAGE_DEBOUNCE_MS: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    AI_HANDOFF_RESUME_MINUTES: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    OWNER_TAKEOVER_RESUME_HOURS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    HOLDING_REPLY_GAP_MINUTES: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DISABLE_JOBS: z.ZodDefault<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    PAYMENT_DRIVER: z.ZodDefault<z.ZodEnum<{
        paystack: "paystack";
        fake: "fake";
    }>>;
    STORAGE_DIR: z.ZodDefault<z.ZodString>;
    PUBLIC_BASE_URL: z.ZodDefault<z.ZodString>;
    PAYMENT_EMAIL_DOMAIN: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof schema>;
export declare const env: Env;
export declare const llm: {
    apiKey: string;
    baseURL: string;
    model: string;
    fallbackModel: string | null;
    reasoningEffort: "low" | "medium" | "high" | "off";
    temperature: number | null;
    provider: string;
};
export declare const debounceMs: number;
export {};
