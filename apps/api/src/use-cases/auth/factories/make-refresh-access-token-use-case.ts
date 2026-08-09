import { PrismaRefreshTokensRepository } from '@/repositories/prisma/prisma-refresh-tokens-repository.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { makeCreateAuthSession } from '@/use-cases/auth/factories/make-create-auth-session.js';
import { RefreshAccessTokenUseCase } from '@/use-cases/auth/refresh-access-token.js';

export function makeRefreshAccessTokenUseCase() {
  return new RefreshAccessTokenUseCase(
    new PrismaUsersRepository(),
    new PrismaRefreshTokensRepository(),
    makeCreateAuthSession(),
  );
}
