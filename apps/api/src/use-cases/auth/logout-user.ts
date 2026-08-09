import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import type { RefreshTokensRepository } from '@/repositories/refresh-tokens-repository.js';

type LogoutUserUseCaseRequest = {
  refreshToken: string;
};

export class LogoutUserUseCase {
  constructor(private refreshTokensRepository: RefreshTokensRepository) {}

  async execute({ refreshToken }: LogoutUserUseCaseRequest): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken =
      await this.refreshTokensRepository.findByTokenHash(tokenHash);

    if (!storedToken || storedToken.revokedAt) {
      return;
    }

    await this.refreshTokensRepository.revoke(storedToken.id);
  }
}
