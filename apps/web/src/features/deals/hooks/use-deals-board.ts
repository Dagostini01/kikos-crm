import { useCallback, useEffect, useMemo, useState } from 'react';

import { dealsApi } from '@/features/deals/api/deals-api';
import { DEAL_STATUS_ORDER } from '@/features/deals/model/status';
import type { Deal, DealStatus } from '@/features/deals/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useDealsBoard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDealId, setPendingDealId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dealsApi.list();
      setDeals(response.deals);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar os negócios'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredDeals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return deals;
    }

    return deals.filter(
      (deal) =>
        deal.title.toLowerCase().includes(normalized) ||
        deal.lead.name.toLowerCase().includes(normalized) ||
        deal.seller.name.toLowerCase().includes(normalized),
    );
  }, [deals, query]);

  const columns = useMemo(() => {
    const grouped = DEAL_STATUS_ORDER.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<DealStatus, Deal[]>,
    );

    for (const deal of filteredDeals) {
      grouped[deal.status].push(deal);
    }

    return DEAL_STATUS_ORDER.map((status) => ({
      status,
      deals: grouped[status],
    }));
  }, [filteredDeals]);

  function replaceDeal(updated: Deal) {
    setDeals((current) =>
      current.map((deal) => (deal.id === updated.id ? updated : deal)),
    );
  }

  async function runTransition(
    dealId: string,
    action: () => Promise<{ deal: Deal }>,
  ) {
    setActionError(null);
    setPendingDealId(dealId);

    try {
      const response = await action();
      replaceDeal(response.deal);
    } catch (err) {
      setActionError(
        getErrorMessage(err, 'Não foi possível atualizar o status'),
      );
    } finally {
      setPendingDealId(null);
    }
  }

  return {
    columns,
    total: filteredDeals.length,
    query,
    setQuery,
    error,
    actionError,
    isLoading,
    isEmpty: !isLoading && !error && filteredDeals.length === 0,
    pendingDealId,
    markInProgress: (dealId: string) =>
      runTransition(dealId, () => dealsApi.markInProgress(dealId)),
    markWon: (dealId: string) =>
      runTransition(dealId, () => dealsApi.markWon(dealId)),
    markLost: (dealId: string) =>
      runTransition(dealId, () => dealsApi.markLost(dealId)),
  };
}
