import { useEffect, useMemo, useState } from 'react';

import type { DealStatus } from '@/features/deals/model/types';
import { leadsApi } from '@/features/leads/api/leads-api';
import type { Lead } from '@/features/leads/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export type LeadStatusFilter = 'ALL' | DealStatus;
export type LeadSellerFilter = 'ALL' | string;

export function useLeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>('ALL');
  const [sellerFilter, setSellerFilter] = useState<LeadSellerFilter>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await leadsApi.list();
        if (!cancelled) {
          setLeads(response.leads);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Não foi possível carregar os leads'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const sellerOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const lead of leads) {
      if (lead.seller) {
        map.set(lead.seller.id, lead.seller.name);
      }
    }

    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
        return false;
      }

      if (sellerFilter !== 'ALL' && lead.seller?.id !== sellerFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return (
        lead.name.toLowerCase().includes(normalized) ||
        lead.email.toLowerCase().includes(normalized) ||
        (lead.seller?.name.toLowerCase().includes(normalized) ?? false)
      );
    });
  }, [leads, query, statusFilter, sellerFilter]);

  return {
    leads: filteredLeads,
    total: filteredLeads.length,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sellerFilter,
    setSellerFilter,
    sellerOptions,
    error,
    isLoading,
    isEmpty: !isLoading && !error && filteredLeads.length === 0,
  };
}
