import type {
  Comment,
  CreateCommentInput,
} from '@/features/comments/model/types';
import { httpClient } from '@/shared/http/client';

type CommentsResponse = {
  comments: Comment[];
};

type CommentResponse = {
  comment: Comment;
};

export const commentsApi = {
  listByDeal(dealId: string) {
    return httpClient.get<CommentsResponse>(`/deals/${dealId}/comments`);
  },

  createForDeal(dealId: string, input: CreateCommentInput) {
    return httpClient.post<CommentResponse>(
      `/deals/${dealId}/comments`,
      input,
    );
  },
};
