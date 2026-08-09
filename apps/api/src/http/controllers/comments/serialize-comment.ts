import type { Comment } from '@/repositories/comments-repository.js';

export function serializeComment(comment: Comment) {
  return {
    id: comment.id,
    content: comment.content,
    leadId: comment.leadId,
    dealId: comment.dealId,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
}
