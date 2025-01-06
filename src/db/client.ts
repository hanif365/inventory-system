import { createClient } from "@libsql/client";
import { loadEnvConfig } from '@next/env';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  loadEnvConfig(process.cwd());
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Database URL not found. Make sure TURSO_DATABASE_URL is set in .env.local");
  throw new Error("TURSO_DATABASE_URL is not defined");
}

if (!authToken) {
  console.error("Auth token not found. Make sure TURSO_AUTH_TOKEN is set in .env.local");
  throw new Error("TURSO_AUTH_TOKEN is not defined");
}

export const db = createClient({
  url,
  authToken,
});
