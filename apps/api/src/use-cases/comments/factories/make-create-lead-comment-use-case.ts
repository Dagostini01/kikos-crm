import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { CreateLeadCommentUseCase } from '@/use-cases/comments/create-lead-comment.js';

export function makeCreateLeadCommentUseCase() {
  return new CreateLeadCommentUseCase(
    new PrismaCommentsRepository(),
    new PrismaLeadsRepository(),
  );
}
