import type {
  CommentWithAuthor,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type { DealsRepository } from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type ListDealCommentsUseCaseRequest = {
  dealId: string;
};

type ListDealCommentsUseCaseResponse = {
  comments: CommentWithAuthor[];
};

export class ListDealCommentsUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private dealsRepository: DealsRepository,
  ) {}

  async execute({
    dealId,
  }: ListDealCommentsUseCaseRequest): Promise<ListDealCommentsUseCaseResponse> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    const comments = await this.commentsRepository.findManyByDealId(dealId);

    return { comments };
  }
}
