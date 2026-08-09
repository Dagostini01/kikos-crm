import type {
  Comment,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

type CreateLeadCommentUseCaseRequest = {
  content: string;
  leadId: string;
};

type CreateLeadCommentUseCaseResponse = {
  comment: Comment;
};

export class CreateLeadCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private leadsRepository: LeadsRepository,
  ) {}

  async execute({
    content,
    leadId,
  }: CreateLeadCommentUseCaseRequest): Promise<CreateLeadCommentUseCaseResponse> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new InvalidCommentContentError();
    }

    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new ResourceNotFoundError();
    }

    const comment = await this.commentsRepository.create({
      content: normalizedContent,
      leadId,
    });

    return { comment };
  }
}
