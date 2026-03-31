import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Server-side Environment Variables
   * These are NOT available on the client.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z
      .url()
      .refine(
        (v) => v.startsWith("postgres://") || v.startsWith("postgresql://"),
        "DATABASE_URL must start with postgres:// or postgresql://"
      ),

    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),

    // OAuth Providers
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // AWS S3
    S3_BUCKET_NAME: z.string().min(1),
    S3_BUCKET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_REGION: z.string().min(1),

    // Gemini
    GEMINI_API_KEY: z.string().min(1),

    // Inngest
    INNGEST_DEV: z.string().min(1),
  },

  /*
   * Client-side Environment Variables
   * These ARE available on the client and must be prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
  },

  /*
   * For Next.js >= 13.4.4, you only need to destructure client variables.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
