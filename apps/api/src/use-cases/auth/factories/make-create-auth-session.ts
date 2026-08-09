import { JoseEncrypter } from '@/cryptography/jose-encrypter.js';
import { env } from '@/env/index.js';
import { PrismaRefreshTokensRepository } from '@/repositories/prisma/prisma-refresh-tokens-repository.js';
import { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';

export function makeCreateAuthSession() {
  return new CreateAuthSession(
    new JoseEncrypter(env.JWT_SECRET, env.JWT_ACCESS_EXPIRES_IN),
    new PrismaRefreshTokensRepository(),
    env.JWT_REFRESH_EXPIRES_IN,
  );
}
