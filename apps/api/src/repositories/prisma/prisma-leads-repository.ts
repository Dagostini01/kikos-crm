import { prisma } from '@/lib/prisma.js';
import type {
  CreateLeadData,
  Lead,
  LeadsRepository,
  UpdateLeadData,
} from '@/repositories/leads-repository.js';

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

  async findMany(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return leads;
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
