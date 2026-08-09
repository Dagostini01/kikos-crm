import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { GetProfileUseCase } from '@/use-cases/auth/get-profile.js';

export function makeGetProfileUseCase() {
  return new GetProfileUseCase(new PrismaUsersRepository());
}
