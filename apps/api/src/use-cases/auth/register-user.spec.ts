import { beforeEach, describe, expect, it } from 'vitest';

import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { InvalidPasswordError } from '@/use-cases/auth/errors/invalid-password-error.js';
import { UserAlreadyExistsError } from '@/use-cases/auth/errors/user-already-exists-error.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';
import { hashRefreshToken } from '@/cryptography/refresh-token.js';

describe('Register User Use Case', () => {
  let sut: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    sut = new RegisterUserUseCase(
      setup.usersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
  });

  it('should register a user and issue tokens', async () => {
    const result = await sut.execute({
      name: '  Jane Doe  ',
      email: '  Jane@Example.com ',
      password: '123456',
    });

    expect(result.user.id).toEqual(expect.any(String));
    expect(result.user.name).toBe('Jane Doe');
    expect(result.user.email).toBe('jane@example.com');
    expect(result.user.passwordHash).toBe('hashed:123456');
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(setup.refreshTokensRepository.items).toHaveLength(1);
    expect(setup.refreshTokensRepository.items[0]?.tokenHash).toBe(
      hashRefreshToken(result.refreshToken),
    );
  });

  it('should not allow duplicated emails', async () => {
    await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'jane@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should reject short passwords', async () => {
    await expect(
      sut.execute({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordError);
  });
});
