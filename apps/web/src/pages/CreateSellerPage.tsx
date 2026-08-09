import { Navigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/session/use-auth';
import { CreateSellerForm } from '@/features/sellers/components/CreateSellerForm';
import { Page } from '@/shared/ui/page';

export function CreateSellerPage() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/vendedores" replace />;
  }

  return (
    <Page title="Novo Vendedor">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSellerForm />
        </CardContent>
      </Card>
    </Page>
  );
}
