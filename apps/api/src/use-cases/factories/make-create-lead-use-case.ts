import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { CreateLeadUseCase } from '@/use-cases/create-lead.js';

export function makeCreateLeadUseCase() {
  const leadsRepository = new PrismaLeadsRepository();
  const createLeadUseCase = new CreateLeadUseCase(leadsRepository);

  return createLeadUseCase;
}
