import { prisma } from '@/lib/prisma.js';
import type {
  CreateUserData,
  User,
  UsersRepository,
} from '@/repositories/users-repository.js';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        sellerId: data.sellerId ?? null,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}
