import { randomUUID } from 'node:crypto';

import type {
  CreateLeadData,
  Lead,
  LeadListItem,
  LeadsRepository,
  UpdateLeadData,
} from '@/repositories/leads-repository.js';

export class InMemoryLeadsRepository implements LeadsRepository {
  public items: Lead[] = [];

  async create(data: CreateLeadData): Promise<Lead> {
    const now = new Date();

    const lead: Lead = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(lead);

    return lead;
  }

  async findById(id: string): Promise<Lead | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Lead | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async findMany(): Promise<LeadListItem[]> {
    return this.items.map((lead) => ({
      ...lead,
      seller: null,
      status: null,
      lastInteractionAt: null,
    }));
  }

  async update(id: string, data: UpdateLeadData): Promise<Lead> {
    const leadIndex = this.items.findIndex((item) => item.id === id);
    const lead = this.items[leadIndex];

    if (leadIndex < 0 || !lead) {
      throw new Error('Lead not found.');
    }

    const updatedLead: Lead = {
      ...lead,
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    };

    this.items[leadIndex] = updatedLead;

    return updatedLead;
  }

  async delete(id: string): Promise<void> {
    const leadIndex = this.items.findIndex((item) => item.id === id);

    if (leadIndex < 0) {
      throw new Error('Lead not found.');
    }

    this.items.splice(leadIndex, 1);
  }
}
