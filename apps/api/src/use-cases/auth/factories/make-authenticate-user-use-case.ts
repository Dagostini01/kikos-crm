import { ScryptHasher } from '@/cryptography/scrypt-hasher.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { AuthenticateUserUseCase } from '@/use-cases/auth/authenticate-user.js';
import { makeCreateAuthSession } from '@/use-cases/auth/factories/make-create-auth-session.js';

export function makeAuthenticateUserUseCase() {
  return new AuthenticateUserUseCase(
    new PrismaUsersRepository(),
    new ScryptHasher(),
    makeCreateAuthSession(),
  );
}
