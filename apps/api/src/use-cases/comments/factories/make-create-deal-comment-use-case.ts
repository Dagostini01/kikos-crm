import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { CreateDealCommentUseCase } from '@/use-cases/comments/create-deal-comment.js';

export function makeCreateDealCommentUseCase() {
  return new CreateDealCommentUseCase(
    new PrismaCommentsRepository(),
    new PrismaDealsRepository(),
  );
}
