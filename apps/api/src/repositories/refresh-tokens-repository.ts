export type RefreshToken = {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export type CreateRefreshTokenData = {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
};

export interface RefreshTokensRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revoke(id: string): Promise<void>;
}
