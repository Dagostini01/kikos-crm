export type UserRole = 'ADMIN' | 'MEMBER';

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  sellerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  sellerId?: string | null;
};

export interface UsersRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  count(): Promise<number>;
}
