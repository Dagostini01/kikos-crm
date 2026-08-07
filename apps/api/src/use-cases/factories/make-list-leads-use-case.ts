import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { ListLeadsUseCase } from '@/use-cases/list-leads.js';

export function makeListLeadsUseCase() {
  const leadsRepository = new PrismaLeadsRepository();
  const listLeadsUseCase = new ListLeadsUseCase(leadsRepository);

  return listLeadsUseCase;
}
