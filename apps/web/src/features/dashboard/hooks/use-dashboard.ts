import { useEffect, useState } from 'react';

import { dealsApi } from '@/features/deals/api/deals-api';
import type { Deal, DealStatus } from '@/features/deals/model/types';
import { leadsApi } from '@/features/leads/api/leads-api';
import { sellersApi } from '@/features/sellers/api/sellers-api';
import { getErrorMessage } from '@/shared/http/errors';

type DashboardStats = {
  leadsCount: number;
  sellersCount: number;
  dealsCount: number;
  dealsByStatus: Record<DealStatus, number>;
};

const EMPTY_BY_STATUS: Record<DealStatus, number> = {
  NEW: 0,
  IN_PROGRESS: 0,
  WON: 0,
  LOST: 0,
};

function countByStatus(deals: Deal[]) {
  return deals.reduce(
    (acc, deal) => {
      acc[deal.status] += 1;
      return acc;
    },
    { ...EMPTY_BY_STATUS },
  );
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [leads, sellers, deals] = await Promise.all([
          leadsApi.list(),
          sellersApi.list(),
          dealsApi.list(),
        ]);

        if (!cancelled) {
          setStats({
            leadsCount: leads.leads.length,
            sellersCount: sellers.sellers.length,
            dealsCount: deals.deals.length,
            dealsByStatus: countByStatus(deals.deals),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(err, 'Não foi possível carregar o dashboard'),
          );
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

  return { stats, error, isLoading };
}
