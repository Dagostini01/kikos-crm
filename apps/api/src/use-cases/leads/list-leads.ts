import type { Lead, LeadsRepository } from '@/repositories/leads-repository.js';

type ListLeadsUseCaseResponse = {
  leads: Lead[];
};

export class ListLeadsUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute(): Promise<ListLeadsUseCaseResponse> {
    const leads = await this.leadsRepository.findMany();

    return { leads };
  }
}
