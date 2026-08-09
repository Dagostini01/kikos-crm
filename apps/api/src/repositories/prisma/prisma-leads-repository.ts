import { prisma } from '@/lib/prisma.js';
import type {
  CreateLeadData,
  Lead,
  LeadListItem,
  LeadsRepository,
  UpdateLeadData,
} from '@/repositories/leads-repository.js';

function pickLatestDate(dates: Array<Date | null | undefined>) {
  const valid = dates.filter((value): value is Date => value instanceof Date);

  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((latest, current) =>
    current.getTime() > latest.getTime() ? current : latest,
  );
}

export class PrismaLeadsRepository implements LeadsRepository {
  async create(data: CreateLeadData): Promise<Lead> {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return lead;
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    return lead;
  }

  async findByEmail(email: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({
      where: { email },
    });

    return lead;
  }

  async findMany(): Promise<LeadListItem[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        deals: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
          include: {
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
    });

    return leads.map((lead) => {
      const latestDeal = lead.deals[0] ?? null;
      const latestComment = lead.comments[0] ?? null;

      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        seller: latestDeal?.seller ?? null,
        status: latestDeal?.status ?? null,
        lastInteractionAt: pickLatestDate([
          latestComment?.createdAt,
          latestDeal?.updatedAt,
        ]),
      };
    });
  }

  async update(id: string, data: UpdateLeadData): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return lead;
  }

  async delete(id: string): Promise<void> {
    await prisma.lead.delete({
      where: { id },
    });
  }
}
