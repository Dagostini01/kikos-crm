export type Comment = {
  id: string;
  content: string;
  leadId: string | null;
  dealId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateLeadCommentData = {
  content: string;
  leadId: string;
  dealId?: never;
};

type CreateDealCommentData = {
  content: string;
  leadId?: never;
  dealId: string;
};

export type CreateCommentData = CreateLeadCommentData | CreateDealCommentData;

export type UpdateCommentData = {
  content: string;
};

export interface CommentsRepository {
  create(data: CreateCommentData): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findManyByLeadId(leadId: string): Promise<Comment[]>;
  findManyByDealId(dealId: string): Promise<Comment[]>;
  update(id: string, data: UpdateCommentData): Promise<Comment>;
  delete(id: string): Promise<void>;
}
