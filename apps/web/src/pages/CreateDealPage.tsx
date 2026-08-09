import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateDealForm } from '@/features/deals/components/CreateDealForm';
import { Page } from '@/shared/ui/page';

export function CreateDealPage() {
  return (
    <Page title="Cadastrar Novo Negócio">
      <Card>
        <CardHeader>
          <CardTitle>Vincular Negócio ao Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateDealForm />
        </CardContent>
      </Card>
    </Page>
  );
}
