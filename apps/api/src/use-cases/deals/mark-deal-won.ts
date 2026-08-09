import type { DealWithRelations, DealsRepository } from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';

type MarkDealWonUseCaseRequest = { dealId: string };
type MarkDealWonUseCaseResponse = { deal: DealWithRelations };

export class MarkDealWonUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute({ dealId }: MarkDealWonUseCaseRequest): Promise<MarkDealWonUseCaseResponse> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    if (deal.status === 'WON' || deal.status === 'LOST') {
      throw new DealAlreadyClosedError();
    }

    const updatedDeal = await this.dealsRepository.updateStatus(dealId, 'WON');

    return { deal: updatedDeal };
  }
}
