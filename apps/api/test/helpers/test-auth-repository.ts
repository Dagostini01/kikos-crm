import { FakeHasher } from '@/use-cases/auth/auth-test-setup.js';
import { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';
import { JoseEncrypter } from '@/cryptography/jose-encrypter.js';
import { env } from '@/env/index.js';
import { InMemoryRefreshTokensRepository } from '@/repositories/in-memory/in-memory-refresh-tokens-repository.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';

export const testUsersRepository = new InMemoryUsersRepository();
export const testRefreshTokensRepository = new InMemoryRefreshTokensRepository();
export const testHasher = new FakeHasher();
export const testEncrypter = new JoseEncrypter(
  env.JWT_SECRET,
  env.JWT_ACCESS_EXPIRES_IN,
);
export const testCreateAuthSession = new CreateAuthSession(
  testEncrypter,
  testRefreshTokensRepository,
  env.JWT_REFRESH_EXPIRES_IN,
);

export function resetTestAuthRepository() {
  testUsersRepository.items = [];
  testRefreshTokensRepository.items = [];
}
