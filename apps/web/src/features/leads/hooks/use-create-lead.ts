import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { leadsApi } from '@/features/leads/api/leads-api';
import type { CreateLeadInput } from '@/features/leads/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useCreateLead() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(input: CreateLeadInput) {
    setError(null);
    setIsSubmitting(true);

    try {
      await leadsApi.create(input);
      navigate('/leads', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar o lead'));
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
