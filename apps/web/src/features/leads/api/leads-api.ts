import type { CreateLeadInput, Lead } from '@/features/leads/model/types';
import { httpClient } from '@/shared/http/client';

type LeadsResponse = {
  leads: Lead[];
};

type LeadResponse = {
  lead: Lead;
};

export const leadsApi = {
  list() {
    return httpClient.get<LeadsResponse>('/leads');
  },

  create(input: CreateLeadInput) {
    return httpClient.post<LeadResponse>('/leads', input);
  },
};
