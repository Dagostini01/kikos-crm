import { beforeEach, describe, expect, it } from 'vitest';

import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { InvalidRefreshTokenError } from '@/use-cases/auth/errors/invalid-refresh-token-error.js';
import { RefreshAccessTokenUseCase } from '@/use-cases/auth/refresh-access-token.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';

describe('Refresh Access Token Use Case', () => {
  let sut: RefreshAccessTokenUseCase;
  let registerUser: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    registerUser = new RegisterUserUseCase(
      setup.usersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
    sut = new RefreshAccessTokenUseCase(
      setup.usersRepository,
      setup.refreshTokensRepository,
      setup.createAuthSession,
    );
  });

  it('should rotate refresh tokens', async () => {
    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    const result = await sut.execute({
      refreshToken: registered.refreshToken,
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(registered.refreshToken);

    const oldToken = setup.refreshTokensRepository.items.find(
      (item) => item.tokenHash === hashRefreshToken(registered.refreshToken),
    );
    const newToken = setup.refreshTokensRepository.items.find(
      (item) => item.tokenHash === hashRefreshToken(result.refreshToken),
    );

    expect(oldToken?.revokedAt).toEqual(expect.any(Date));
    expect(newToken?.revokedAt).toBeNull();
  });

  it('should reject revoked refresh tokens', async () => {
    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await sut.execute({ refreshToken: registered.refreshToken });

    await expect(
      sut.execute({ refreshToken: registered.refreshToken }),
    ).rejects.toBeInstanceOf(InvalidRefreshTokenError);
  });

  it('should reject expired refresh tokens', async () => {
    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    const stored = setup.refreshTokensRepository.items[0];
    if (stored) {
      stored.expiresAt = new Date('2000-01-01T00:00:00.000Z');
    }

    await expect(
      sut.execute({ refreshToken: registered.refreshToken }),
    ).rejects.toBeInstanceOf(InvalidRefreshTokenError);
  });
});
