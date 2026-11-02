import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z.string().default("src/uploads"),
  MAX_UPLOAD_SIZE_BYTES: z.coerce.number().int().positive().default(5_242_880),
});

export const env = envSchema.parse(process.env);
