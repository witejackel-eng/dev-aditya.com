/**
 * Database smoke-test script.
 *
 * Validates that:
 *  1. DATABASE_URL is set.
 *  2. The Neon HTTP client can connect and run `select 1`.
 *  3. The required tables (audits, audit_leads, audit_events, rate_limits) are queryable.
 *
 * Usage: npx tsx scripts/check-database.ts
 *
 * Exits with code 0 on success, 1 on failure.
 * Never prints the connection string or password.
 */

import { neon } from '@neondatabase/serverless';

const REQUIRED_TABLES = ['audits', 'audit_leads', 'audit_events', 'rate_limits'] as const;

function fail(msg: string): never {
  console.error(`[db:check] FAIL: ${msg}`);
  process.exit(1);
}

async function main() {
  // 1. Validate DATABASE_URL exists
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    fail('DATABASE_URL is not set in the environment.');
  }
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    fail('DATABASE_URL does not appear to be a PostgreSQL connection string.');
  }

  // 2. Connect using the same production Neon HTTP client
  const sql = neon(databaseUrl);

  // 3. Run `select 1`
  try {
    const [result] = await sql`select 1 as ok`;
    if (!result || (result as Record<string, unknown>).ok !== 1) {
      fail('Connection test (select 1) did not return expected result.');
    }
    console.log('[db:check] Connection test passed: select 1 = OK');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Redact anything that looks like a connection string or password
    const safeMsg = msg
      .replace(/postgresql:\/\/[^\s"']+@/gi, 'postgresql://[REDACTED]@')
      .replace(/postgres:\/\/[^\s"']+@/gi, 'postgres://[REDACTED]@')
      .replace(/password[=:]\s*\S+/gi, 'password=[REDACTED]');
    fail(`Connection test failed: ${safeMsg}`);
  }

  // 4. Confirm each required table is queryable
  for (const table of REQUIRED_TABLES) {
    try {
      // Use the raw query API — neon() also exposes a tagged .unsafe() helper
      // but the simplest portable approach is a dynamic raw query via the
      // underlying fetch. We use a parameterized query with a literal table name
      // that we have already validated against the allow-list.
      const query = `select 1 from "${table}" limit 1`;
      await sql.unsafe(query);
      console.log(`[db:check] Table "${table}" is queryable.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const safeMsg = msg
        .replace(/postgresql:\/\/[^\s"']+@/gi, 'postgresql://[REDACTED]@')
        .replace(/postgres:\/\/[^\s"']+@/gi, 'postgres://[REDACTED]@');
      fail(`Table "${table}" is not queryable: ${safeMsg}`);
    }
  }

  console.log('[db:check] All checks passed.');
  process.exit(0);
}

main();