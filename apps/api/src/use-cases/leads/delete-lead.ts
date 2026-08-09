import type { LeadsRepository } from '@/repositories/leads-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type DeleteLeadUseCaseRequest = {
  leadId: string;
};

export class DeleteLeadUseCase {
  constructor(private leadsRepository: LeadsRepository) {}

  async execute({ leadId }: DeleteLeadUseCaseRequest): Promise<void> {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new ResourceNotFoundError();
    }

    await this.leadsRepository.delete(leadId);
  }
}
