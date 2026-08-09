import type {
  DealStatus,
  DealWithRelations,
  DealsRepository,
} from '@/repositories/deals-repository.js';

type ListDealsUseCaseRequest = {
  status?: DealStatus | undefined;
};

type ListDealsUseCaseResponse = { deals: DealWithRelations[] };

export class ListDealsUseCase {
  constructor(private dealsRepository: DealsRepository) {}

  async execute(
    request: ListDealsUseCaseRequest = {},
  ): Promise<ListDealsUseCaseResponse> {
    const deals = await this.dealsRepository.findMany(
      request.status ? { status: request.status } : {},
    );

    return { deals };
  }
}
