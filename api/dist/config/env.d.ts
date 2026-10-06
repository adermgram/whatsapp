import 'dotenv/config';
import { z } from 'zod';
declare const schema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    DIRECT_URL: z.ZodOptional<z.ZodString>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
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
    WHATSAPP_ADAPTER: z.ZodDefault<z.ZodEnum<{
        baileys: "baileys";
        simulator: "simulator";
    }>>;
    PAYMENT_DRIVER: z.ZodDefault<z.ZodEnum<{
        paystack: "paystack";
        fake: "fake";
    }>>;
    PUBLIC_BASE_URL: z.ZodDefault<z.ZodString>;
    PAYMENT_EMAIL_DOMAIN: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof schema>;
export declare const env: Env;
export {};
