import type { DealWithRelations, DealsRepository } from '@/repositories/deals-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import type { SellersRepository } from '@/repositories/sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { InvalidDealValueError } from './errors/invalid-deal-value-error.js';

type CreateDealUseCaseRequest = {
  title: string;
  valueInCents: number;
  leadId: string;
  sellerId: string;
};

type CreateDealUseCaseResponse = { deal: DealWithRelations };

export class CreateDealUseCase {
  constructor(
    private dealsRepository: DealsRepository,
    private leadsRepository: LeadsRepository,
    private sellersRepository: SellersRepository,
  ) {}

  async execute(request: CreateDealUseCaseRequest): Promise<CreateDealUseCaseResponse> {
    if (request.valueInCents <= 0) {
      throw new InvalidDealValueError();
    }

    const [lead, seller] = await Promise.all([
      this.leadsRepository.findById(request.leadId),
      this.sellersRepository.findById(request.sellerId),
    ]);

    if (!lead || !seller) {
      throw new ResourceNotFoundError();
    }

    const deal = await this.dealsRepository.create(request);

    return { deal };
  }
}
