import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { UpdateLeadUseCase } from '@/use-cases/update-lead.js';

export function makeUpdateLeadUseCase() {
  const leadsRepository = new PrismaLeadsRepository();
  const updateLeadUseCase = new UpdateLeadUseCase(leadsRepository);

  return updateLeadUseCase;
}
