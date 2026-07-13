/**
 * Safe database error logging utility.
 *
 * Extracts structured diagnostic information from database errors
 * without ever leaking secrets (DATABASE_URL, passwords, connection
 * strings, API secrets, raw IPs, or Turnstile secrets).
 */

/** Fields that must never appear in logs. */
const BLOCKED_PATTERNS = [
  /postgresql:\/\/[^\s"']+@/gi,
  /postgres:\/\/[^\s"']+@/gi,
  /password[=:]\s*\S+/gi,
  /TURNSTILE_SECRET/i,
  /IP_HASH_SECRET/i,
  /RESEND_API_KEY/i,
  /ADMIN_PASSWORD/i,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, // raw IP addresses
];

function redact(message: string): string {
  let safe = message;
  for (const pattern of BLOCKED_PATTERNS) {
    safe = safe.replace(pattern, '[REDACTED]');
  }
  return safe;
}

/**
 * Extract a structured, safe log payload from any caught error.
 *
 * Includes:
 *  - Error name
 *  - PostgreSQL error code (when present on the error object)
 *  - Sanitized error message
 */
export function logDbError(context: string, err: unknown): void {
  const errorName = err instanceof Error ? err.name : 'UnknownError';
  const rawMessage = err instanceof Error ? err.message : String(err);

  // Neon / pg errors expose a `code` property for PostgreSQL error codes
  const pgCode =
    err instanceof Error && 'code' in err && typeof (err as Record<string, unknown>).code === 'string'
      ? ((err as Record<string, unknown>).code as string)
      : undefined;

  const safeMessage = redact(rawMessage);

  const parts = [`[${context}] ${errorName}`];
  if (pgCode) parts.push(`PG_CODE=${pgCode}`);
  parts.push(safeMessage);

  console.error(parts.join(' | '));
}