import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { UpdateCommentUseCase } from '@/use-cases/comments/update-comment.js';

export function makeUpdateCommentUseCase() {
  return new UpdateCommentUseCase(new PrismaCommentsRepository());
}
