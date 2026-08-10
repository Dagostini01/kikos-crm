import type {
  CreateDealInput,
  Deal,
  DealAiInsights,
} from '@/features/deals/model/types';
import { httpClient } from '@/shared/http/client';

type DealsResponse = {
  deals: Deal[];
};

type DealResponse = {
  deal: Deal;
};

export const dealsApi = {
  list() {
    return httpClient.get<DealsResponse>('/deals');
  },

  get(dealId: string) {
    return httpClient.get<DealResponse>(`/deals/${dealId}`);
  },

  create(input: CreateDealInput) {
    return httpClient.post<DealResponse>('/deals', input);
  },

  markInProgress(dealId: string) {
    return httpClient.patch<DealResponse>(`/deals/${dealId}/status`, {
      status: 'IN_PROGRESS',
    });
  },

  markWon(dealId: string) {
    return httpClient.patch<DealResponse>(`/deals/${dealId}/won`);
  },

  markLost(dealId: string) {
    return httpClient.patch<DealResponse>(`/deals/${dealId}/lost`);
  },

  generateAiInsights(dealId: string) {
    return httpClient.post<DealAiInsights>(`/deals/${dealId}/ai/insights`);
  },
};
