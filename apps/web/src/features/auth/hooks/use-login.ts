import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/session/use-auth';
import { getErrorMessage } from '@/shared/http/errors';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(email: string, password: string) {
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/negocios', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível entrar'));
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
