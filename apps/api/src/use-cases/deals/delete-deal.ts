import type { DealsRepository } from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type DeleteDealUseCaseRequest = { dealId: string };

export class DeleteDealUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute({ dealId }: DeleteDealUseCaseRequest): Promise<void> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    await this.dealsRepository.delete(dealId);
  }
}
