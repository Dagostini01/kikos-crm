import type { DealWithRelations, DealsRepository } from '@/repositories/deals-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import type { SellersRepository } from '@/repositories/sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { InvalidDealValueError } from './errors/invalid-deal-value-error.js';

type UpdateDealUseCaseRequest = {
  dealId: string;
  title: string;
  valueInCents: number;
  leadId: string;
  sellerId: string;
};

type UpdateDealUseCaseResponse = { deal: DealWithRelations };

export class UpdateDealUseCase {
  constructor(
    private dealsRepository: DealsRepository,
    private leadsRepository: LeadsRepository,
    private sellersRepository: SellersRepository,
  ) {}

  async execute({
    dealId,
    ...data
  }: UpdateDealUseCaseRequest): Promise<UpdateDealUseCaseResponse> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    if (deal.status === 'WON' || deal.status === 'LOST') {
      throw new DealAlreadyClosedError();
    }

    if (data.valueInCents <= 0) {
      throw new InvalidDealValueError();
    }

    const [lead, seller] = await Promise.all([
      this.leadsRepository.findById(data.leadId),
      this.sellersRepository.findById(data.sellerId),
    ]);

    if (!lead || !seller) {
      throw new ResourceNotFoundError();
    }

    const updatedDeal = await this.dealsRepository.update(dealId, data);

    return { deal: updatedDeal };
  }
}
