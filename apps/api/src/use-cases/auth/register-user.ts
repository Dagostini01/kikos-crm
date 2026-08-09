import type { HashGenerator } from '@/cryptography/hash-generator.js';
import type { User, UsersRepository } from '@/repositories/users-repository.js';
import type { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';
import { InvalidPasswordError } from '@/use-cases/auth/errors/invalid-password-error.js';
import { UserAlreadyExistsError } from '@/use-cases/auth/errors/user-already-exists-error.js';

type RegisterUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

type RegisterUserUseCaseResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private createAuthSession: CreateAuthSession,
  ) {}

  async execute({
    name,
    email,
    password,
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

    const passwordHash = await this.hashGenerator.hash(password);

    const user = await this.usersRepository.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    const session = await this.createAuthSession.execute({ userId: user.id });

    return {
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }
}
