import type { HashGenerator } from '@/cryptography/hash-generator.js';
import type { SellersRepository } from '@/repositories/sellers-repository.js';
import type { User, UsersRepository } from '@/repositories/users-repository.js';
import type { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';
import { InvalidPasswordError } from '@/use-cases/auth/errors/invalid-password-error.js';
import { UserAlreadyExistsError } from '@/use-cases/auth/errors/user-already-exists-error.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type RegisterUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
  sellerId?: string | null | undefined;
};

type RegisterUserUseCaseResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private sellersRepository: SellersRepository,
    private hashGenerator: HashGenerator,
    private createAuthSession: CreateAuthSession,
  ) {}

  async execute({
    name,
    email,
    password,
    sellerId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      throw new InvalidPasswordError();
    }

    const userWithSameEmail =
      await this.usersRepository.findByEmail(normalizedEmail);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    if (sellerId) {
      const seller = await this.sellersRepository.findById(sellerId);

      if (!seller) {
        throw new ResourceNotFoundError();
      }
    }

    const usersCount = await this.usersRepository.count();
    const passwordHash = await this.hashGenerator.hash(password);

    const user = await this.usersRepository.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role: usersCount === 0 ? 'ADMIN' : 'MEMBER',
      sellerId: sellerId ?? null,
    });

    const session = await this.createAuthSession.execute({
      userId: user.id,
      role: user.role,
    });

    return {
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }
}
