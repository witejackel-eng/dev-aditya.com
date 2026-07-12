/**
 * Database client for the Website Revenue Audit Funnel.
 *
 * Uses @neondatabase/serverless + drizzle-orm/neon-serverless.
 * Falls back to a no-op client at build time when DATABASE_URL is absent
 * or does not point to a PostgreSQL database.
 */

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

type DbClient = NeonDatabase<typeof schema>;

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
          `[db] Cannot perform database operation "${String(prop)}" — DATABASE_URL is not configured. Set a Neon PostgreSQL connection string.`,
        );
      },
    });
  }

  const sql: NeonQueryFunction<false, false> = neon(databaseUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return drizzle(sql as any, { schema });
}

export const db = createDb();
