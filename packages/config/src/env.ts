import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_NAME: z.string().min(1).default("Desafio Volta à Vela"),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  REDIS_URL: z.string().min(1),
  AUTH_PEPPER: z.string().min(32),
  AUTH_REQUIRE_EMAIL_VERIFICATION: booleanFromString.default("true"),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(365).default(30),
  RATE_LIMIT_FAIL_OPEN: booleanFromString.default("false"),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),
  SMTP_SECURE: booleanFromString.default("false"),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().min(1),
  TERMS_VERSION: z.string().min(1),
  PRIVACY_VERSION: z.string().min(1),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_FORCE_PATH_STYLE: booleanFromString.default("true"),
  SAILTI_BASE_URL: z.string().url(),
  SAILTI_RACES_URL: z.string().url(),
  SAILTI_RESULTS_URL: z.string().url(),
  SAILTI_PROVIDER: z.enum(["api", "file", "xrr", "html", "manual"]).default("file"),
  SAILTI_XRR_ENABLED: booleanFromString.default("true"),
  RESULT_IMPORT_MAX_BYTES: z.coerce.number().int().min(1_024).max(50_000_000).default(5_242_880),
  RESULT_RECALCULATION_MAX_RETRIES: z.coerce.number().int().min(1).max(10).default(5),
  CRON_SECRET: z.string().min(24).optional(),
  RESULTS_CRON_SECRET: z.string().min(24).optional(),
});

export type AppEnv = z.infer<typeof schema>;

let cache: AppEnv | undefined;

export function getEnv(): AppEnv {
  cache ??= schema.parse(process.env);
  return cache;
}
