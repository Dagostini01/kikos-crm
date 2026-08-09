import { prisma } from '@/lib/prisma.js';
import type {
  Comment,
  CommentsRepository,
  CreateCommentData,
  UpdateCommentData,
} from '@/repositories/comments-repository.js';

export class PrismaCommentsRepository implements CommentsRepository {
  async create(data: CreateCommentData): Promise<Comment> {
    if (data.leadId !== undefined) {
      return prisma.comment.create({
        data: {
          content: data.content,
          leadId: data.leadId,
        },
      });
    }

    return prisma.comment.create({
      data: {
        content: data.content,
        dealId: data.dealId,
      },
    });
  }

  async findById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id } });
  }

  async findManyByLeadId(leadId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { leadId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findManyByDealId(dealId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { dealId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: UpdateCommentData): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data: { content: data.content },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
