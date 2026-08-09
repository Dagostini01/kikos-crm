import { beforeEach, describe, expect, it } from 'vitest';

import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { LogoutUserUseCase } from '@/use-cases/auth/logout-user.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';

describe('Logout User Use Case', () => {
  let sut: LogoutUserUseCase;
  let registerUser: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    registerUser = new RegisterUserUseCase(setup.usersRepository, setup.sellersRepository, setup.hasher, setup.createAuthSession);
    sut = new LogoutUserUseCase(setup.refreshTokensRepository);
  });

  it('should revoke the refresh token', async () => {
    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await sut.execute({ refreshToken: registered.refreshToken });

    const stored = setup.refreshTokensRepository.items.find(
      (item) => item.tokenHash === hashRefreshToken(registered.refreshToken),
    );

    expect(stored?.revokedAt).toEqual(expect.any(Date));
  });

  it('should be idempotent for unknown or already revoked tokens', async () => {
    await expect(
      sut.execute({ refreshToken: 'unknown-token' }),
    ).resolves.toBeUndefined();

    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await sut.execute({ refreshToken: registered.refreshToken });
    await expect(
      sut.execute({ refreshToken: registered.refreshToken }),
    ).resolves.toBeUndefined();
  });
});
