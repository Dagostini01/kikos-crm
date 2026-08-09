import type { DealStatus } from '@/features/deals/model/types';

export type LeadSeller = {
  id: string;
  name: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  seller: LeadSeller | null;
  status: DealStatus | null;
  lastInteractionAt: string | null;
};

export type CreateLeadInput = {
  name: string;
  email: string;
};
