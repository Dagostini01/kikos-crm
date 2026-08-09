import type { Encrypter } from '@/cryptography/encrypter.js';
import {
  generateRefreshToken,
  hashRefreshToken,
} from '@/cryptography/refresh-token.js';
import type { RefreshTokensRepository } from '@/repositories/refresh-tokens-repository.js';
import type { UserRole } from '@/repositories/users-repository.js';
import { parseDurationToDate } from '@/utils/parse-duration.js';

type CreateAuthSessionRequest = {
  userId: string;
  role: UserRole;
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
    role,
  }: CreateAuthSessionRequest): Promise<CreateAuthSessionResponse> {
    const accessToken = await this.encrypter.encrypt({ sub: userId, role });
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
