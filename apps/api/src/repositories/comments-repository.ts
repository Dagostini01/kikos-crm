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
  createdAt: Date;
  updatedAt: Date;
};

export type CommentWithAuthor = Comment & {
  author: CommentAuthor;
};

type CreateLeadCommentData = {
  content: string;
  leadId: string;
  authorId: string;
  dealId?: never;
};

type CreateDealCommentData = {
  content: string;
  dealId: string;
  authorId: string;
  leadId?: never;
};

export type CreateCommentData = CreateLeadCommentData | CreateDealCommentData;

export type UpdateCommentData = {
  content: string;
};

export interface CommentsRepository {
  create(data: CreateCommentData): Promise<CommentWithAuthor>;
  findById(id: string): Promise<CommentWithAuthor | null>;
  findManyByLeadId(leadId: string): Promise<CommentWithAuthor[]>;
  findManyByDealId(dealId: string): Promise<CommentWithAuthor[]>;
  update(id: string, data: UpdateCommentData): Promise<CommentWithAuthor>;
  delete(id: string): Promise<void>;
}
