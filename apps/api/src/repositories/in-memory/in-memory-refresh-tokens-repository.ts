import { randomUUID } from 'node:crypto';

import type {
  CreateRefreshTokenData,
  RefreshToken,
  RefreshTokensRepository,
} from '@/repositories/refresh-tokens-repository.js';

export class InMemoryRefreshTokensRepository implements RefreshTokensRepository {
  public items: RefreshToken[] = [];

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const refreshToken: RefreshToken = {
      id: randomUUID(),
      tokenHash: data.tokenHash,
      userId: data.userId,
      expiresAt: data.expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    };

    this.items.push(refreshToken);

    return refreshToken;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.items.find((item) => item.tokenHash === tokenHash) ?? null;
  }

  async revoke(id: string): Promise<void> {
    const token = this.items.find((item) => item.id === id);

    if (!token || token.revokedAt) {
      return;
    }

    token.revokedAt = new Date();
  }
}
