import type {
  CommentWithAuthor,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

type CreateLeadCommentUseCaseRequest = {
  content: string;
  leadId: string;
  authorId: string;
};

type CreateLeadCommentUseCaseResponse = {
  comment: CommentWithAuthor;
};

export class CreateLeadCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private leadsRepository: LeadsRepository,
  ) {}

  async execute({
    content,
    leadId,
    authorId,
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
      authorId,
    });

    return { comment };
  }
}
