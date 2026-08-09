import { beforeEach, describe, expect, it } from 'vitest';

import { hashRefreshToken } from '@/cryptography/refresh-token.js';
import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { InvalidPasswordError } from '@/use-cases/auth/errors/invalid-password-error.js';
import { UserAlreadyExistsError } from '@/use-cases/auth/errors/user-already-exists-error.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

describe('Register User Use Case', () => {
  let sut: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    sut = new RegisterUserUseCase(
      setup.usersRepository,
      setup.sellersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
  });

  it('should register the first user as ADMIN', async () => {
    const result = await sut.execute({
      name: '  Jane Doe  ',
      email: '  Jane@Example.com ',
      password: '123456',
    });

    expect(result.user.role).toBe('ADMIN');
    expect(result.user.sellerId).toBeNull();
    expect(result.user.passwordHash).toBe('hashed:123456');
    expect(setup.refreshTokensRepository.items[0]?.tokenHash).toBe(
      hashRefreshToken(result.refreshToken),
    );
  });

  it('should register subsequent users as MEMBER and link a seller', async () => {
    await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    const seller = await setup.sellersRepository.create({
      name: 'John Seller',
      email: 'seller@kikos.com',
    });

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      sellerId: seller.id,
    });

    expect(result.user.role).toBe('MEMBER');
    expect(result.user.sellerId).toBe(seller.id);
  });

  it('should reject a missing seller link', async () => {
    await expect(
      sut.execute({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        sellerId: 'missing-seller',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
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
