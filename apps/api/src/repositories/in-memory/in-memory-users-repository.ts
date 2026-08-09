import { randomUUID } from 'node:crypto';

import type {
  CreateUserData,
  User,
  UsersRepository,
} from '@/repositories/users-repository.js';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: CreateUserData): Promise<User> {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      sellerId: data.sellerId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async count(): Promise<number> {
    return this.items.length;
  }
}
