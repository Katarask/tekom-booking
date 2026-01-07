// Environment variable validation
// Validates required env vars at startup to prevent runtime errors

interface EnvConfig {
  // Required
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
  RESEND_API_KEY: string;

  // Optional with defaults
  FROM_EMAIL: string;
  FROM_NAME: string;
  NEXT_PUBLIC_APP_URL: string;
  ADMIN_PASSWORD: string;

  // Optional (Azure - for real calendar integration)
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_TENANT_ID?: string;
  MICROSOFT_USER_ID?: string;

  // Optional (Vercel KV)
  KV_REST_API_URL?: string;
  KV_REST_API_TOKEN?: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || "";
}

function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Check required variables
  const requiredVars = [
    "NOTION_API_KEY",
    "NOTION_DATABASE_ID",
    "RESEND_API_KEY",
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  if (errors.length > 0) {
    console.error("❌ Environment validation failed:");
    errors.forEach((err) => console.error(`   - ${err}`));
    // Don't throw in development to allow partial functionality
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Environment validation failed: ${errors.join(", ")}`);
    }
  }

  return {
    // Required
    NOTION_API_KEY: getEnvVar("NOTION_API_KEY", ""),
    NOTION_DATABASE_ID: getEnvVar("NOTION_DATABASE_ID", ""),
    RESEND_API_KEY: getEnvVar("RESEND_API_KEY", ""),

    // Optional with defaults
    FROM_EMAIL: getEnvVar("FROM_EMAIL", "hello@denizleventtulay.de"),
    FROM_NAME: getEnvVar("FROM_NAME", "Deniz Levent Tulay"),
    NEXT_PUBLIC_APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "https://termine.denizleventtulay.de"),
    ADMIN_PASSWORD: getEnvVar("ADMIN_PASSWORD", "tekom2026"),

    // Optional (Azure)
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
    MICROSOFT_USER_ID: process.env.MICROSOFT_USER_ID,

    // Optional (Vercel KV)
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  };
}

// Validate on import (will run at startup)
export const env = validateEnv();

// Helper functions
export function isAzureConfigured(): boolean {
  return !!(
    env.MICROSOFT_CLIENT_ID &&
    env.MICROSOFT_CLIENT_SECRET &&
    env.MICROSOFT_TENANT_ID &&
    env.MICROSOFT_USER_ID
  );
}

export function isKVConfigured(): boolean {
  return !!(env.KV_REST_API_URL && env.KV_REST_API_TOKEN);
}

// Log configuration status (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("📋 Environment Configuration:");
  console.log(`   - Notion: ${env.NOTION_API_KEY ? "✅" : "❌"}`);
  console.log(`   - Resend: ${env.RESEND_API_KEY ? "✅" : "❌"}`);
  console.log(`   - Azure: ${isAzureConfigured() ? "✅" : "⚠️ Mock mode"}`);
  console.log(`   - Vercel KV: ${isKVConfigured() ? "✅" : "⚠️ File fallback"}`);
}
