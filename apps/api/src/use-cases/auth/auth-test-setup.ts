import type { Encrypter } from '@/cryptography/encrypter.js';
import type { HashComparer } from '@/cryptography/hash-comparer.js';
import type { HashGenerator } from '@/cryptography/hash-generator.js';
import { InMemoryRefreshTokensRepository } from '@/repositories/in-memory/in-memory-refresh-tokens-repository.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  async decrypt(token: string): Promise<Record<string, unknown>> {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as Record<
      string,
      unknown
    >;
  }
}

export function createAuthTestSetup() {
  const usersRepository = new InMemoryUsersRepository();
  const refreshTokensRepository = new InMemoryRefreshTokensRepository();
  const hasher = new FakeHasher();
  const encrypter = new FakeEncrypter();
  const createAuthSession = new CreateAuthSession(
    encrypter,
    refreshTokensRepository,
    '7d',
  );

  return {
    usersRepository,
    refreshTokensRepository,
    hasher,
    encrypter,
    createAuthSession,
  };
}
