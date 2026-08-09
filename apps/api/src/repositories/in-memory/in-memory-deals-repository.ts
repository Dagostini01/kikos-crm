import { randomUUID } from 'node:crypto';

import type {
  CreateDealData,
  Deal,
  DealStatus,
  DealWithRelations,
  DealsRepository,
  UpdateDealData,
} from '@/repositories/deals-repository.js';
import type { LeadsRepository } from '@/repositories/leads-repository.js';
import type { SellersRepository } from '@/repositories/sellers-repository.js';

export class InMemoryDealsRepository implements DealsRepository {
  public items: Deal[] = [];

  constructor(
    private leadsRepository: LeadsRepository,
    private sellersRepository: SellersRepository,
  ) {}

  private async withRelations(deal: Deal): Promise<DealWithRelations> {
    const [lead, seller] = await Promise.all([
      this.leadsRepository.findById(deal.leadId),
      this.sellersRepository.findById(deal.sellerId),
    ]);

    if (!lead || !seller) {
      throw new Error('Deal relation not found.');
    }

    return {
      ...deal,
      lead: { id: lead.id, name: lead.name, email: lead.email },
      seller: { id: seller.id, name: seller.name, email: seller.email },
    };
  }

  async create(data: CreateDealData): Promise<DealWithRelations> {
    const now = new Date();
    const deal: Deal = {
      id: randomUUID(),
      ...data,
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(deal);

    return this.withRelations(deal);
  }

  async findById(id: string): Promise<DealWithRelations | null> {
    const deal = this.items.find((item) => item.id === id);

    return deal ? this.withRelations(deal) : null;
  }

  async findMany(): Promise<DealWithRelations[]> {
    return Promise.all(this.items.map((deal) => this.withRelations(deal)));
  }

  async update(id: string, data: UpdateDealData): Promise<DealWithRelations> {
    const dealIndex = this.items.findIndex((item) => item.id === id);
    const deal = this.items[dealIndex];

    if (dealIndex < 0 || !deal) {
      throw new Error('Deal not found.');
    }

    const updatedDeal: Deal = { ...deal, ...data, updatedAt: new Date() };
    this.items[dealIndex] = updatedDeal;

    return this.withRelations(updatedDeal);
  }

  async updateStatus(id: string, status: DealStatus): Promise<DealWithRelations> {
    const dealIndex = this.items.findIndex((item) => item.id === id);
    const deal = this.items[dealIndex];

    if (dealIndex < 0 || !deal) {
      throw new Error('Deal not found.');
    }

    const updatedDeal: Deal = { ...deal, status, updatedAt: new Date() };
    this.items[dealIndex] = updatedDeal;

    return this.withRelations(updatedDeal);
  }

  async delete(id: string): Promise<void> {
    const dealIndex = this.items.findIndex((item) => item.id === id);

    if (dealIndex < 0) {
      throw new Error('Deal not found.');
    }

    this.items.splice(dealIndex, 1);
  }
}
