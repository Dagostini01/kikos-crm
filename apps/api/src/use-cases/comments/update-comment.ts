import type {
  CommentWithAuthor,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

type UpdateCommentUseCaseRequest = {
  commentId: string;
  content: string;
};

type UpdateCommentUseCaseResponse = {
  comment: CommentWithAuthor;
};

export class UpdateCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    content,
  }: UpdateCommentUseCaseRequest): Promise<UpdateCommentUseCaseResponse> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new InvalidCommentContentError();
    }

    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new ResourceNotFoundError();
    }

    const updatedComment = await this.commentsRepository.update(commentId, {
      content: normalizedContent,
    });

    return { comment: updatedComment };
  }
}
