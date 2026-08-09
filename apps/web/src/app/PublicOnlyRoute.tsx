import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/session/use-auth';

export function PublicOnlyRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="p-8 text-sm text-muted-foreground">Carregando sessão…</div>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
