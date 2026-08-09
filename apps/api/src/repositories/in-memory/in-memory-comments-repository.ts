import { randomUUID } from 'node:crypto';

import type {
  Comment,
  CommentsRepository,
  CreateCommentData,
  UpdateCommentData,
} from '@/repositories/comments-repository.js';

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = [];

  async create(data: CreateCommentData): Promise<Comment> {
    const now = new Date();
    const comment: Comment = {
      id: randomUUID(),
      content: data.content,
      leadId: data.leadId ?? null,
      dealId: data.dealId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(comment);

    return comment;
  }

  async findById(id: string): Promise<Comment | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findManyByLeadId(leadId: string): Promise<Comment[]> {
    return this.items
      .filter((item) => item.leadId === leadId)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
  }

  async findManyByDealId(dealId: string): Promise<Comment[]> {
    return this.items
      .filter((item) => item.dealId === dealId)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
  }

  async update(id: string, data: UpdateCommentData): Promise<Comment> {
    const commentIndex = this.items.findIndex((item) => item.id === id);
    const comment = this.items[commentIndex];

    if (commentIndex < 0 || !comment) {
      throw new Error('Comment not found.');
    }

    const updatedComment: Comment = {
      ...comment,
      content: data.content,
      updatedAt: new Date(),
    };

    this.items[commentIndex] = updatedComment;

    return updatedComment;
  }

  async delete(id: string): Promise<void> {
    const commentIndex = this.items.findIndex((item) => item.id === id);

    if (commentIndex < 0) {
      throw new Error('Comment not found.');
    }

    this.items.splice(commentIndex, 1);
  }
}
