import type { User, UsersRepository } from '@/repositories/users-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type GetProfileUseCaseRequest = {
  userId: string;
};

type GetProfileUseCaseResponse = {
  user: User;
};

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
