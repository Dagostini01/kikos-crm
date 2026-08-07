import type { Lead, LeadsRepository } from '@/repositories/leads-repository.js';
import { LeadAlreadyExistsError } from './errors/lead-already-exists-error.js';

type CreateLeadUseCaseRequest = {
  name: string;
  email: string;
};

type CreateLeadUseCaseResponse = {
  lead: Lead;
};

export class CreateLeadUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute({
    name,
    email,
  }: CreateLeadUseCaseRequest): Promise<CreateLeadUseCaseResponse> {
    const leadWithSameEmail = await this.leadsRepository.findByEmail(email);

    if (leadWithSameEmail) {
      throw new LeadAlreadyExistsError();
    }

    const lead = await this.leadsRepository.create({
      name,
      email,
    });

    return { lead };
  }
}
