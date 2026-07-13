#!/usr/bin/env node

/**
 * CLI script to hash an admin password using scrypt.
 *
 * Usage:
 *   node scripts/hash-admin-password.mjs
 *
 * This is a standalone Node.js script (not using Next.js imports)
 * so it can be run from the command line without a running app.
 *
 * The output hash uses the same format as `src/lib/admin/password.ts`:
 *   scrypt:<salt hex>:<derived key hex>:<keylen>
 *
 * Copy the output into the ADMIN_PASSWORD_HASH environment variable.
 */

import { createInterface } from 'node:readline';
import crypto from 'node:crypto';

const KEY_LENGTH = 64;
const SALT_LENGTH = 32;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}:${KEY_LENGTH}`;
}

async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

  console.log('\n🔑 Admin Password Hashing Utility\n');
  console.log('This script hashes a password so you can set the');
  console.log('ADMIN_PASSWORD_HASH environment variable.\n');

  const password = await question('Enter the admin password: ');

  if (!password || password.trim().length === 0) {
    console.error('\n❌ Password cannot be empty.');
    rl.close();
    process.exit(1);
  }

  if (password.trim().length < 8) {
    console.error('\n❌ Password should be at least 8 characters for security.');
    rl.close();
    process.exit(1);
  }

  const confirmPassword = await question('Confirm the admin password: ');

  if (password !== confirmPassword) {
    console.error('\n❌ Passwords do not match. Please try again.');
    rl.close();
    process.exit(1);
  }

  const hash = hashPassword(password.trim());

  console.log('\n✅ Password hashed successfully!\n');
  console.log('Add this to your .env file or environment:');
  console.log('─────────────────────────────────────────────────');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('─────────────────────────────────────────────────\n');

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
