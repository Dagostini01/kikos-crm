import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { ListLeadCommentsUseCase } from '@/use-cases/comments/list-lead-comments.js';

export function makeListLeadCommentsUseCase() {
  return new ListLeadCommentsUseCase(
    new PrismaCommentsRepository(),
    new PrismaLeadsRepository(),
  );
}
