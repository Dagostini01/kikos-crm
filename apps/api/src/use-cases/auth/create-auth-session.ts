import type { Encrypter } from '@/cryptography/encrypter.js';
import {
  generateRefreshToken,
  hashRefreshToken,
} from '@/cryptography/refresh-token.js';
import type { RefreshTokensRepository } from '@/repositories/refresh-tokens-repository.js';
import { parseDurationToDate } from '@/utils/parse-duration.js';

type CreateAuthSessionRequest = {
  userId: string;
};

type CreateAuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
};

export class CreateAuthSession {
  constructor(
    private encrypter: Encrypter,
    private refreshTokensRepository: RefreshTokensRepository,
    private refreshExpiresIn: string,
  ) {}

  async execute({
    userId,
  }: CreateAuthSessionRequest): Promise<CreateAuthSessionResponse> {
    const accessToken = await this.encrypter.encrypt({ sub: userId });
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);

    await this.refreshTokensRepository.create({
      tokenHash,
      userId,
      expiresAt: parseDurationToDate(this.refreshExpiresIn),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
