import { beforeEach, describe, expect, it } from 'vitest';

import { AuthenticateUserUseCase } from '@/use-cases/auth/authenticate-user.js';
import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { InvalidCredentialsError } from '@/use-cases/auth/errors/invalid-credentials-error.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';

describe('Authenticate User Use Case', () => {
  let sut: AuthenticateUserUseCase;
  let registerUser: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    registerUser = new RegisterUserUseCase(
      setup.usersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
    sut = new AuthenticateUserUseCase(
      setup.usersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
  });

  it('should authenticate with valid credentials', async () => {
    await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    const result = await sut.execute({
      email: 'Jane@Example.com',
      password: '123456',
    });

    expect(result.user.email).toBe('jane@example.com');
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(setup.refreshTokensRepository.items).toHaveLength(2);
  });

  it('should not authenticate with wrong password', async () => {
    await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await expect(
      sut.execute({
        email: 'jane@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not authenticate with unknown email', async () => {
    await expect(
      sut.execute({
        email: 'missing@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
