import { beforeEach, describe, expect, it } from 'vitest';

import { createAuthTestSetup } from '@/use-cases/auth/auth-test-setup.js';
import { GetProfileUseCase } from '@/use-cases/auth/get-profile.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

describe('Get Profile Use Case', () => {
  let sut: GetProfileUseCase;
  let registerUser: RegisterUserUseCase;
  let setup: ReturnType<typeof createAuthTestSetup>;

  beforeEach(() => {
    setup = createAuthTestSetup();
    registerUser = new RegisterUserUseCase(
      setup.usersRepository,
      setup.hasher,
      setup.createAuthSession,
    );
    sut = new GetProfileUseCase(setup.usersRepository);
  });

  it('should return the authenticated user profile', async () => {
    const registered = await registerUser.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    const { user } = await sut.execute({ userId: registered.user.id });

    expect(user).toEqual(registered.user);
  });

  it('should not return a missing user', async () => {
    await expect(
      sut.execute({ userId: 'missing-user' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
