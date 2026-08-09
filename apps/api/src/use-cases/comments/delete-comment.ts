import type { CommentsRepository } from '@/repositories/comments-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type DeleteCommentUseCaseRequest = {
  commentId: string;
};

export class DeleteCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ commentId }: DeleteCommentUseCaseRequest): Promise<void> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new ResourceNotFoundError();
    }

    await this.commentsRepository.delete(commentId);
  }
}
