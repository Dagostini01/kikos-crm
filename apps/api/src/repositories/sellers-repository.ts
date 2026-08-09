export type Seller = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSellerData = {
  name: string;
  email: string;
};

export type UpdateSellerData = {
  name: string;
  email: string;
};

export interface SellersRepository {
  create(data: CreateSellerData): Promise<Seller>;
  findById(id: string): Promise<Seller | null>;
  findByEmail(email: string): Promise<Seller | null>;
  findMany(): Promise<Seller[]>;
  update(id: string, data: UpdateSellerData): Promise<Seller>;
  delete(id: string): Promise<void>;
}
