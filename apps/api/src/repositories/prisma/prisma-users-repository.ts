import { prisma } from '@/lib/prisma.js';
import type {
  CreateUserData,
  User,
  UsersRepository,
} from '@/repositories/users-repository.js';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}
