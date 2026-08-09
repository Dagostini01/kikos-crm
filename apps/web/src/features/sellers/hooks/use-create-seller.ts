import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { sellersApi } from '@/features/sellers/api/sellers-api';
import type { CreateSellerInput } from '@/features/sellers/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useCreateSeller() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(input: CreateSellerInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      await sellersApi.create(input);
      navigate('/vendedores', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar o vendedor'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submit,
    error,
    isSubmitting,
  };
}
