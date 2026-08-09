import type {
  DealStatus,
  DealWithRelations,
  DealsRepository,
} from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { InvalidDealStatusTransitionError } from './errors/invalid-deal-status-transition-error.js';

type UpdateDealStatusUseCaseRequest = {
  dealId: string;
  status: DealStatus;
};

type UpdateDealStatusUseCaseResponse = { deal: DealWithRelations };

export class UpdateDealStatusUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute({
    dealId,
    status,
  }: UpdateDealStatusUseCaseRequest): Promise<UpdateDealStatusUseCaseResponse> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    if (deal.status === 'WON' || deal.status === 'LOST') {
      throw new DealAlreadyClosedError();
    }

    if (deal.status !== 'NEW' || status !== 'IN_PROGRESS') {
      throw new InvalidDealStatusTransitionError();
    }

    const updatedDeal = await this.dealsRepository.updateStatus(dealId, status);

    return { deal: updatedDeal };
  }
}
