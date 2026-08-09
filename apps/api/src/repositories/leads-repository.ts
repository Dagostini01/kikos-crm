export type LeadDealStatus = 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST';

export type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LeadListItem = Lead & {
  seller: { id: string; name: string } | null;
  status: LeadDealStatus | null;
  lastInteractionAt: Date | null;
};

export type CreateLeadData = {
  name: string;
  email: string;
};

export type UpdateLeadData = {
  name: string;
  email: string;
};

export interface LeadsRepository {
  create(data: CreateLeadData): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findByEmail(email: string): Promise<Lead | null>;
  findMany(): Promise<LeadListItem[]>;
  update(id: string, data: UpdateLeadData): Promise<Lead>;
  delete(id: string): Promise<void>;
}
