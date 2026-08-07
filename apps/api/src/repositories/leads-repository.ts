export type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
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
  findMany(): Promise<Lead[]>;
  update(id: string, data: UpdateLeadData): Promise<Lead>;
  delete(id: string): Promise<void>;
}
