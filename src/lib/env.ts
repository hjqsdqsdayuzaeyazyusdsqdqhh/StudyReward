const requiredEnvVars = ["DATABASE_URL"] as const

const missing = requiredEnvVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}.\n` +
      "Copy .env.example to .env and fill in the values."
  )
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://studyreward.com",
} as const
