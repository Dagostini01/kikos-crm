import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { GetLeadUseCase } from '@/use-cases/get-lead.js';

export function makeGetLeadUseCase() {
  const leadsRepository = new PrismaLeadsRepository();
  const getLeadUseCase = new GetLeadUseCase(leadsRepository);

  return getLeadUseCase;
}
