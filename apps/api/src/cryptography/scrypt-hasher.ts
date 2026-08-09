import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import type { HashComparer } from '@/cryptography/hash-comparer.js';
import type { HashGenerator } from '@/cryptography/hash-generator.js';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

export class ScryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(':');

    if (!salt || !storedHash) {
      return false;
    }

    const derivedKey = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer;
    const storedKey = Buffer.from(storedHash, 'hex');

    if (derivedKey.length !== storedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
  }
}
