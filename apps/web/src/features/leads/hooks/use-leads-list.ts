import { useEffect, useMemo, useState } from 'react';

import { leadsApi } from '@/features/leads/api/leads-api';
import type { Lead } from '@/features/leads/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useLeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');
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

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return leads;
    }

    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(normalized) ||
        lead.email.toLowerCase().includes(normalized),
    );
  }, [leads, query]);

  return {
    leads: filteredLeads,
    total: filteredLeads.length,
    query,
    setQuery,
    error,
    isLoading,
    isEmpty: !isLoading && !error && filteredLeads.length === 0,
  };
}
