import type {
  CommentWithAuthor,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type GetCommentUseCaseRequest = {
  commentId: string;
};

type GetCommentUseCaseResponse = {
  comment: CommentWithAuthor;
};

export class GetCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
  }: GetCommentUseCaseRequest): Promise<GetCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new ResourceNotFoundError();
    }

    return { comment };
  }
}
