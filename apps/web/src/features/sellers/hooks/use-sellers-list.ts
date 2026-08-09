import { useEffect, useMemo, useState } from 'react';

import { sellersApi } from '@/features/sellers/api/sellers-api';
import type { Seller } from '@/features/sellers/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useSellersList() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await sellersApi.list();
        if (!cancelled) {
          setSellers(response.sellers);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(err, 'Não foi possível carregar os vendedores'),
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

  const filteredSellers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return sellers;
    }

    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(normalized) ||
        seller.email.toLowerCase().includes(normalized),
    );
  }, [sellers, query]);

  return {
    sellers: filteredSellers,
    total: filteredSellers.length,
    query,
    setQuery,
    error,
    isLoading,
    isEmpty: !isLoading && !error && filteredSellers.length === 0,
  };
}
