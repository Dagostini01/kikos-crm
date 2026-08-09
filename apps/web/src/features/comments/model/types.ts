export type CommentAuthor = {
  id: string;
  name: string;
  email: string;
};

export type Comment = {
  id: string;
  content: string;
  leadId: string | null;
  dealId: string | null;
  authorId: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
};

export type CreateCommentInput = {
  content: string;
};
