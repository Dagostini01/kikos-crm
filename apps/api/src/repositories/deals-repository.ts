import type { Lead } from '@/repositories/leads-repository.js';
import type { Seller } from '@/repositories/sellers-repository.js';

export type DealStatus = 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST';

export type Deal = {
  id: string;
  title: string;
  valueInCents: number;
  status: DealStatus;
  leadId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DealLead = Pick<Lead, 'id' | 'name' | 'email'>;
export type DealSeller = Pick<Seller, 'id' | 'name' | 'email'>;

export type DealWithRelations = Deal & {
  lead: DealLead;
  seller: DealSeller;
};

export type CreateDealData = {
  title: string;
  valueInCents: number;
  leadId: string;
  sellerId: string;
};

export type UpdateDealData = CreateDealData;

export type ListDealsFilters = {
  status?: DealStatus | undefined;
};

export interface DealsRepository {
  create(data: CreateDealData): Promise<DealWithRelations>;
  findById(id: string): Promise<DealWithRelations | null>;
  findMany(filters?: ListDealsFilters): Promise<DealWithRelations[]>;
  update(id: string, data: UpdateDealData): Promise<DealWithRelations>;
  updateStatus(id: string, status: DealStatus): Promise<DealWithRelations>;
  delete(id: string): Promise<void>;
}
