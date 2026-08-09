import { prisma } from '@/lib/prisma.js';
import type {
  CreateSellerData,
  Seller,
  SellersRepository,
  UpdateSellerData,
} from '@/repositories/sellers-repository.js';

export class PrismaSellersRepository implements SellersRepository {
  async create(data: CreateSellerData): Promise<Seller> {
    const seller = await prisma.seller.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return seller;
  }

  async findById(id: string): Promise<Seller | null> {
    const seller = await prisma.seller.findUnique({
      where: { id },
    });

    return seller;
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await prisma.seller.findUnique({
      where: { email },
    });

    return seller;
  }

  async findMany(): Promise<Seller[]> {
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return sellers;
  }

  async update(id: string, data: UpdateSellerData): Promise<Seller> {
    const seller = await prisma.seller.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return seller;
  }

  async delete(id: string): Promise<void> {
    await prisma.seller.delete({
      where: { id },
    });
  }
}
