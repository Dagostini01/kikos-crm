import type { DealWithRelations, DealsRepository } from '@/repositories/deals-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type GetDealUseCaseRequest = { dealId: string };
type GetDealUseCaseResponse = { deal: DealWithRelations };

export class GetDealUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute({ dealId }: GetDealUseCaseRequest): Promise<GetDealUseCaseResponse> {
    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    return { deal };
  }
}
