import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { ProtectedRoute } from '@/app/ProtectedRoute';
import { PublicOnlyRoute } from '@/app/PublicOnlyRoute';
import { AuthProvider } from '@/features/auth/session/auth-context';
import { CreateDealPage } from '@/pages/CreateDealPage';
import { CreateLeadPage } from '@/pages/CreateLeadPage';
import { CreateSellerPage } from '@/pages/CreateSellerPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DealDetailPage } from '@/pages/DealDetailPage';
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
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/negocios" element={<DealsPage />} />
              <Route path="/negocios/novo" element={<CreateDealPage />} />
              <Route path="/negocios/:id" element={<DealDetailPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/novo" element={<CreateLeadPage />} />
              <Route path="/vendedores" element={<SellersPage />} />
              <Route path="/vendedores/novo" element={<CreateSellerPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
