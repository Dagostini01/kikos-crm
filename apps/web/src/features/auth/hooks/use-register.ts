import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/session/use-auth';
import { getErrorMessage } from '@/shared/http/errors';

export function useRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(name: string, email: string, password: string) {
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar a conta'));
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
