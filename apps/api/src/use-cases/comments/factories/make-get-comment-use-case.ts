import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { GetCommentUseCase } from '@/use-cases/comments/get-comment.js';

export function makeGetCommentUseCase() {
  return new GetCommentUseCase(new PrismaCommentsRepository());
}
