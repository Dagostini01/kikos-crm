import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { DeleteCommentUseCase } from '@/use-cases/comments/delete-comment.js';

export function makeDeleteCommentUseCase() {
  return new DeleteCommentUseCase(new PrismaCommentsRepository());
}
