import { PrismaRefreshTokensRepository } from '@/repositories/prisma/prisma-refresh-tokens-repository.js';
import { LogoutUserUseCase } from '@/use-cases/auth/logout-user.js';

export function makeLogoutUserUseCase() {
  return new LogoutUserUseCase(new PrismaRefreshTokensRepository());
}
