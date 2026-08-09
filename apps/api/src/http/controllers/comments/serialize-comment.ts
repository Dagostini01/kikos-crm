import type { CommentWithAuthor } from '@/repositories/comments-repository.js';

export function serializeComment(comment: CommentWithAuthor) {
  return {
    id: comment.id,
    content: comment.content,
    leadId: comment.leadId,
    dealId: comment.dealId,
    authorId: comment.authorId,
    author: comment.author,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
}
