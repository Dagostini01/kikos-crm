import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateLeadForm } from '@/features/leads/components/CreateLeadForm';
import { Page } from '@/shared/ui/page';

export function CreateLeadPage() {
  return (
    <Page title="Criar Novo Lead">
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais do Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLeadForm />
        </CardContent>
      </Card>
    </Page>
  );
}
