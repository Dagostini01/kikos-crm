import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import type { RefreshTokensRepository } from '@/repositories/refresh-tokens-repository.js';
import type { UsersRepository } from '@/repositories/users-repository.js';
import type { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';
import { InvalidRefreshTokenError } from '@/use-cases/auth/errors/invalid-refresh-token-error.js';

type RefreshAccessTokenUseCaseRequest = {
  refreshToken: string;
};

type RefreshAccessTokenUseCaseResponse = {
  accessToken: string;
  refreshToken: string;
};

export class RefreshAccessTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository,
    private createAuthSession: CreateAuthSession,
  ) {}

  async execute({
    refreshToken,
  }: RefreshAccessTokenUseCaseRequest): Promise<RefreshAccessTokenUseCaseResponse> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken =
      await this.refreshTokensRepository.findByTokenHash(tokenHash);

    if (!storedToken || storedToken.revokedAt) {
      throw new InvalidRefreshTokenError();
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.usersRepository.findById(storedToken.userId);

    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    await this.refreshTokensRepository.revoke(storedToken.id);

    return this.createAuthSession.execute({
      userId: user.id,
      role: user.role,
    });
  }
}
