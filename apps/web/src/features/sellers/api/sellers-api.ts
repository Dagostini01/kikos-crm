import type {
  CreateSellerInput,
  Seller,
} from '@/features/sellers/model/types';
import { httpClient } from '@/shared/http/client';

type SellersResponse = {
  sellers: Seller[];
};

type SellerResponse = {
  seller: Seller;
};

export const sellersApi = {
  list() {
    return httpClient.get<SellersResponse>('/sellers');
  },

  create(input: CreateSellerInput) {
    return httpClient.post<SellerResponse>('/sellers', input);
  },
};
