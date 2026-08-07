import type { Lead, LeadsRepository } from '@/repositories/leads-repository.js';
import { LeadAlreadyExistsError } from './errors/lead-already-exists-error.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';

type UpdateLeadUseCaseRequest = {
  leadId: string;
  name: string;
  email: string;
};

type UpdateLeadUseCaseResponse = {
  lead: Lead;
};

export class UpdateLeadUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute({
    leadId,
    name,
    email,
  }: UpdateLeadUseCaseRequest): Promise<UpdateLeadUseCaseResponse> {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new ResourceNotFoundError();
    }

    if (email !== lead.email) {
      const leadWithSameEmail = await this.leadsRepository.findByEmail(email);

      if (leadWithSameEmail) {
        throw new LeadAlreadyExistsError();
      }
    }

    const updatedLead = await this.leadsRepository.update(leadId, {
      name,
      email,
    });

    return { lead: updatedLead };
  }
}
