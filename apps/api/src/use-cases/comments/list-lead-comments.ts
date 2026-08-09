import type {
  Comment,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type ListLeadCommentsUseCaseRequest = {
  leadId: string;
};

type ListLeadCommentsUseCaseResponse = {
  comments: Comment[];
};

export class ListLeadCommentsUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private leadsRepository: LeadsRepository,
  ) {}

  async execute({
    leadId,
  }: ListLeadCommentsUseCaseRequest): Promise<ListLeadCommentsUseCaseResponse> {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new ResourceNotFoundError();
    }

    const comments = await this.commentsRepository.findManyByLeadId(leadId);

    return { comments };
  }
}
