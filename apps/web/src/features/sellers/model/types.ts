export type Seller = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSellerInput = {
  name: string;
  email: string;
};
