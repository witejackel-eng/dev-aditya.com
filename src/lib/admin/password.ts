/**
 * Admin password hashing and verification.
 *
 * Uses Node.js crypto.scrypt with a random salt and constant-time
 * comparison via crypto.timingSafeEqual to resist timing attacks.
 *
 * Stored hash format: `scrypt:<salt hex>:<derived key hex>:<keylen>`
 */

import crypto from 'node:crypto';

const KEY_LENGTH = 64; // 64 bytes = 512 bits
const SALT_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Hash a plaintext password using scrypt with a random salt.
 *
 * @returns Promise resolving to a string in the format
 *          `scrypt:<salt hex>:<derived key hex>:<keylen>`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH);

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}:${KEY_LENGTH}`;
}

/**
 * Verify a plaintext password against a stored scrypt hash.
 *
 * Uses constant-time comparison (crypto.timingSafeEqual) so that
 * an attacker cannot learn anything from response timing.
 *
 * @param password  The plaintext password to check.
 * @param storedHash  The hash string previously returned by `hashPassword`.
 * @returns Promise resolving to `true` if the password matches, `false` otherwise.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 4 || parts[0] !== 'scrypt') {
    // Invalid hash format — fail safe.
    return false;
  }

  const [, saltHex, expectedKeyHex, keylenStr] = parts;

  let keylen: number;
  try {
    keylen = parseInt(keylenStr, 10);
    if (isNaN(keylen) || keylen <= 0) return false;
  } catch {
    return false;
  }

  let salt: Buffer;
  let expectedKey: Buffer;
  try {
    salt = Buffer.from(saltHex, 'hex');
    expectedKey = Buffer.from(expectedKeyHex, 'hex');
  } catch {
    return false;
  }

  if (salt.length === 0 || expectedKey.length !== keylen) {
    return false;
  }

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  // Constant-time comparison — both buffers must be the same length.
  if (derivedKey.length !== expectedKey.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(derivedKey, expectedKey);
  } catch {
    return false;
  }
}
