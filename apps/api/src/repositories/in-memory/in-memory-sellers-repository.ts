import { randomUUID } from 'node:crypto';

import type {
  CreateSellerData,
  Seller,
  SellersRepository,
  UpdateSellerData,
} from '@/repositories/sellers-repository.js';

export class InMemorySellersRepository implements SellersRepository {
  public items: Seller[] = [];

  async create(data: CreateSellerData): Promise<Seller> {
    const now = new Date();

    const seller: Seller = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(seller);

    return seller;
  }

  async findById(id: string): Promise<Seller | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async findMany(): Promise<Seller[]> {
    return this.items;
  }

  async update(id: string, data: UpdateSellerData): Promise<Seller> {
    const sellerIndex = this.items.findIndex((item) => item.id === id);
    const seller = this.items[sellerIndex];

    if (sellerIndex < 0 || !seller) {
      throw new Error('Seller not found.');
    }

    const updatedSeller: Seller = {
      ...seller,
      name: data.name,
      email: data.email,
      updatedAt: new Date(),
    };

    this.items[sellerIndex] = updatedSeller;

    return updatedSeller;
  }

  async delete(id: string): Promise<void> {
    const sellerIndex = this.items.findIndex((item) => item.id === id);

    if (sellerIndex < 0) {
      throw new Error('Seller not found.');
    }

    this.items.splice(sellerIndex, 1);
  }
}
