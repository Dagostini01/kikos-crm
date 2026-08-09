import type { DealWithRelations, DealsRepository } from '@/repositories/deals-repository.js';

type ListDealsUseCaseResponse = { deals: DealWithRelations[] };

export class ListDealsUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute(): Promise<ListDealsUseCaseResponse> {
    const deals = await this.dealsRepository.findMany();

    return { deals };
  }
}
