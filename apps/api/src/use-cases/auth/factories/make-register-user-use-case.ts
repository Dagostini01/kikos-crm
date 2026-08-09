import { ScryptHasher } from '@/cryptography/scrypt-hasher.js';
import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { makeCreateAuthSession } from '@/use-cases/auth/factories/make-create-auth-session.js';
import { RegisterUserUseCase } from '@/use-cases/auth/register-user.js';

export function makeRegisterUserUseCase() {
  return new RegisterUserUseCase(
    new PrismaUsersRepository(),
    new PrismaSellersRepository(),
    new ScryptHasher(),
    makeCreateAuthSession(),
  );
}
