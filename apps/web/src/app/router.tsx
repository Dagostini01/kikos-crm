import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { ProtectedRoute } from '@/app/ProtectedRoute';
import { PublicOnlyRoute } from '@/app/PublicOnlyRoute';
import { AuthProvider } from '@/features/auth/session/auth-context';
import { CreateLeadPage } from '@/pages/CreateLeadPage';
import { DealsPage } from '@/pages/DealsPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SellersPage } from '@/pages/SellersPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/negocios" replace />} />
              <Route path="/negocios" element={<DealsPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/novo" element={<CreateLeadPage />} />
              <Route path="/vendedores" element={<SellersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
