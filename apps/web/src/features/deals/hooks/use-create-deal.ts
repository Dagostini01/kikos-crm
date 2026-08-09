import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { dealsApi } from '@/features/deals/api/deals-api';
import type { CreateDealInput } from '@/features/deals/model/types';
import { leadsApi } from '@/features/leads/api/leads-api';
import type { Lead } from '@/features/leads/model/types';
import { sellersApi } from '@/features/sellers/api/sellers-api';
import type { Seller } from '@/features/sellers/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function parseCurrencyToCents(value: string): number | null {
  const normalized = value
    .trim()
    .replace(/[R$\s]/gi, '')
    .replace(/\./g, '')
    .replace(',', '.');

  if (!normalized) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
}

export function useCreateDeal() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setIsLoadingOptions(true);
      setError(null);

      try {
        const [leadsResponse, sellersResponse] = await Promise.all([
          leadsApi.list(),
          sellersApi.list(),
        ]);

        if (!cancelled) {
          setLeads(leadsResponse.leads);
          setSellers(sellersResponse.sellers);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(err, 'Não foi possível carregar leads e vendedores'),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOptions(false);
        }
      }
    }

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(input: CreateDealInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      await dealsApi.create(input);
      navigate('/negocios', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar o negócio'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    leads,
    sellers,
    submit,
    error,
    isLoadingOptions,
    isSubmitting,
  };
}
