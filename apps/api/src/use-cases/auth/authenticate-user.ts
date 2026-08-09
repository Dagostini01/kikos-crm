import type { HashComparer } from '@/cryptography/hash-comparer.js';
import type { User, UsersRepository } from '@/repositories/users-repository.js';
import type { CreateAuthSession } from '@/use-cases/auth/create-auth-session.js';
import { InvalidCredentialsError } from '@/use-cases/auth/errors/invalid-credentials-error.js';

type AuthenticateUserUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateUserUseCaseResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private createAuthSession: CreateAuthSession,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.hashComparer.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

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
