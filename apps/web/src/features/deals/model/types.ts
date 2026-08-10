export type DealStatus = 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST';

export type DealLead = {
  id: string;
  name: string;
  email: string;
};

export type DealSeller = {
  id: string;
  name: string;
  email: string;
};

export type Deal = {
  id: string;
  title: string;
  valueInCents: number;
  status: DealStatus;
  leadId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  lead: DealLead;
  seller: DealSeller;
};

export type CreateDealInput = {
  title: string;
  valueInCents: number;
  leadId: string;
  sellerId: string;
};

export type DealAiInsights = {
  summary: string;
  nextStep: string;
  model: string;
};
