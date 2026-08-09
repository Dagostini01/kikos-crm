import type {
  Comment,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type { DealsRepository } from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

type CreateDealCommentUseCaseRequest = {
  content: string;
  dealId: string;
};

type CreateDealCommentUseCaseResponse = {
  comment: Comment;
};

export class CreateDealCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private dealsRepository: DealsRepository,
  ) {}

  async execute({
    content,
    dealId,
  }: CreateDealCommentUseCaseRequest): Promise<CreateDealCommentUseCaseResponse> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new InvalidCommentContentError();
    }

    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    const comment = await this.commentsRepository.create({
      content: normalizedContent,
      dealId,
    });

    return { comment };
  }
}
