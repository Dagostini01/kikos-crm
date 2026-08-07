import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { DeleteLeadUseCase } from '@/use-cases/delete-lead.js';

export function makeDeleteLeadUseCase() {
  const leadsRepository = new PrismaLeadsRepository();
  const deleteLeadUseCase = new DeleteLeadUseCase(leadsRepository);

  return deleteLeadUseCase;
}
