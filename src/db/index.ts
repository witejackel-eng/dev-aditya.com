/**
 * Database client for the Website Revenue Audit Funnel.
 *
 * Uses @neondatabase/serverless (HTTP driver) + drizzle-orm/neon-http.
 * Falls back to a no-op client at build time when DATABASE_URL is absent
 * or does not point to a PostgreSQL database.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

function createConfiguredDb(databaseUrl: string) {
  const sql = neon(databaseUrl);

  return drizzle({
    client: sql,
    schema,
  });
}

type DbClient = ReturnType<typeof createConfiguredDb>;

function isValidPostgresUrl(url: string): boolean {
  return url.startsWith('postgresql://') || url.startsWith('postgres://');
}

function createDb(): DbClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !isValidPostgresUrl(databaseUrl)) {
    // During `next build` the env var may be absent or wrong format.
    // Return a proxy that throws at runtime instead of crashing the build.
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn(
        '[db] DATABASE_URL is not set or not a PostgreSQL URL — database operations will fail at runtime.',
      );
    }

    // Create a lazy proxy so imports never fail; actual calls will throw clearly.
    return new Proxy({} as DbClient, {
      get(_target, prop) {
        if (prop === '__drizzle_no_db') return true;
        throw new Error(
          `[db] Cannot perform database operation "${String(
            prop,
          )}" — DATABASE_URL is not configured. Set a Neon PostgreSQL connection string.`,
        );
      },
    });
  }

  return createConfiguredDb(databaseUrl);
}

export const db = createDb();