import { randomUUID } from 'node:crypto';

import type {
  Comment,
  CommentWithAuthor,
  CommentsRepository,
  CreateCommentData,
  UpdateCommentData,
} from '@/repositories/comments-repository.js';
import type { UsersRepository } from '@/repositories/users-repository.js';

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = [];

  constructor(private usersRepository?: UsersRepository) {}

  private async withAuthor(comment: Comment): Promise<CommentWithAuthor> {
    const author = this.usersRepository
      ? await this.usersRepository.findById(comment.authorId)
      : null;

    if (!author) {
      return {
        ...comment,
        author: {
          id: comment.authorId,
          name: 'Unknown',
          email: 'unknown@example.com',
        },
      };
    }

    return {
      ...comment,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
    };
  }

  async create(data: CreateCommentData): Promise<CommentWithAuthor> {
    const now = new Date();
    const comment: Comment = {
      id: randomUUID(),
      content: data.content,
      leadId: data.leadId ?? null,
      dealId: data.dealId ?? null,
      authorId: data.authorId,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(comment);

    return this.withAuthor(comment);
  }

  async findById(id: string): Promise<CommentWithAuthor | null> {
    const comment = this.items.find((item) => item.id === id);

    return comment ? this.withAuthor(comment) : null;
  }

  async findManyByLeadId(leadId: string): Promise<CommentWithAuthor[]> {
    const comments = this.items
      .filter((item) => item.leadId === leadId)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

    return Promise.all(comments.map((comment) => this.withAuthor(comment)));
  }

  async findManyByDealId(dealId: string): Promise<CommentWithAuthor[]> {
    const comments = this.items
      .filter((item) => item.dealId === dealId)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

    return Promise.all(comments.map((comment) => this.withAuthor(comment)));
  }

  async update(id: string, data: UpdateCommentData): Promise<CommentWithAuthor> {
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

    return this.withAuthor(updatedComment);
  }

  async delete(id: string): Promise<void> {
    const commentIndex = this.items.findIndex((item) => item.id === id);

    if (commentIndex < 0) {
      throw new Error('Comment not found.');
    }

    this.items.splice(commentIndex, 1);
  }
}
