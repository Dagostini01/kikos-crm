import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { ListDealCommentsUseCase } from '@/use-cases/comments/list-deal-comments.js';

export function makeListDealCommentsUseCase() {
  return new ListDealCommentsUseCase(
    new PrismaCommentsRepository(),
    new PrismaDealsRepository(),
  );
}
