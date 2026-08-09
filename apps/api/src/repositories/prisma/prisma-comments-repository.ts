import { prisma } from '@/lib/prisma.js';
import type {
  CommentWithAuthor,
  CommentsRepository,
  CreateCommentData,
  UpdateCommentData,
} from '@/repositories/comments-repository.js';

const authorSelect = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const;

export class PrismaCommentsRepository implements CommentsRepository {
  async create(data: CreateCommentData): Promise<CommentWithAuthor> {
    if (data.leadId !== undefined) {
      return prisma.comment.create({
        data: {
          content: data.content,
          leadId: data.leadId,
          authorId: data.authorId,
        },
        include: authorSelect,
      });
    }

    return prisma.comment.create({
      data: {
        content: data.content,
        dealId: data.dealId,
        authorId: data.authorId,
      },
      include: authorSelect,
    });
  }

  async findById(id: string): Promise<CommentWithAuthor | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: authorSelect,
    });
  }

  async findManyByLeadId(leadId: string): Promise<CommentWithAuthor[]> {
    return prisma.comment.findMany({
      where: { leadId },
      orderBy: { createdAt: 'asc' },
      include: authorSelect,
    });
  }

  async findManyByDealId(dealId: string): Promise<CommentWithAuthor[]> {
    return prisma.comment.findMany({
      where: { dealId },
      orderBy: { createdAt: 'asc' },
      include: authorSelect,
    });
  }

  async update(id: string, data: UpdateCommentData): Promise<CommentWithAuthor> {
    return prisma.comment.update({
      where: { id },
      data: { content: data.content },
      include: authorSelect,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
