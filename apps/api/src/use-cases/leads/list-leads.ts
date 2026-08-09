import type {
  LeadListItem,
  LeadsRepository,
} from '@/repositories/leads-repository.js';

type ListLeadsUseCaseResponse = {
  leads: LeadListItem[];
};

export class ListLeadsUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute(): Promise<ListLeadsUseCaseResponse> {
    const leads = await this.leadsRepository.findMany();

    return { leads };
  }
}
