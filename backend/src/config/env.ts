import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  AI_PROVIDER: z.enum(["openai", "anthropic"]).default("openai"),
  AI_API_KEY: z.string().min(1, "AI_API_KEY is required"),
  AI_MODEL: z.string().default("gpt-4o-mini"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
