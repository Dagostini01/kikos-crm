import { prisma } from '@/lib/prisma.js';
import type {
  CreateRefreshTokenData,
  RefreshToken,
  RefreshTokensRepository,
} from '@/repositories/refresh-tokens-repository.js';

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revoke(id: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
