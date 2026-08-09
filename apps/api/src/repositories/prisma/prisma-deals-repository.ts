import { prisma } from '@/lib/prisma.js';
import type {
  CreateDealData,
  DealStatus,
  DealWithRelations,
  DealsRepository,
  ListDealsFilters,
  UpdateDealData,
} from '@/repositories/deals-repository.js';

const relations = {
  lead: { select: { id: true, name: true, email: true } },
  seller: { select: { id: true, name: true, email: true } },
} as const;

export class PrismaDealsRepository implements DealsRepository {
  async create(data: CreateDealData): Promise<DealWithRelations> {
    return prisma.deal.create({
      data: { ...data, status: 'NEW' },
      include: relations,
    });
  }

  async findById(id: string): Promise<DealWithRelations | null> {
    return prisma.deal.findUnique({
      where: { id },
      include: relations,
    });
  }

  async findMany(filters: ListDealsFilters = {}): Promise<DealWithRelations[]> {
    return prisma.deal.findMany({
      ...(filters.status ? { where: { status: filters.status } } : {}),
      include: relations,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateDealData): Promise<DealWithRelations> {
    return prisma.deal.update({
      where: { id },
      data,
      include: relations,
    });
  }

  async updateStatus(id: string, status: DealStatus): Promise<DealWithRelations> {
    return prisma.deal.update({
      where: { id },
      data: { status },
      include: relations,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.deal.delete({ where: { id } });
  }
}
