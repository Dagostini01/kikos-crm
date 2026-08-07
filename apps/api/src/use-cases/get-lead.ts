import type { Lead, LeadsRepository } from '@/repositories/leads-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

type GetLeadUseCaseRequest = {
  leadId: string;
};

type GetLeadUseCaseResponse = {
  lead: Lead;
};

export class GetLeadUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute({
    leadId,
  }: GetLeadUseCaseRequest): Promise<GetLeadUseCaseResponse> {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new ResourceNotFoundError();
    }

    return { lead };
  }
}
