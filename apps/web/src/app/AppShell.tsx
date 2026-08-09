import { Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/session/use-auth';
import { AppSidebar } from '@/shared/ui/app-sidebar';

export function AppShell() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar user={user} onLogout={() => void logout()} />
      <main className="min-w-0 flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
