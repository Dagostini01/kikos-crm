import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Deal } from '@/features/deals/model/types';

type DealDetailMetaProps = {
  deal: Deal;
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function DealDetailMeta({ deal }: DealDetailMetaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dossiê do Cliente & Contatos</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        <MetaRow label="Lead Responsável" value={deal.lead.name} />
        <MetaRow label="E-mail Corporativo" value={deal.lead.email} />
        <MetaRow label="Vendedor Proprietário" value={deal.seller.name} />
        <MetaRow label="Criado em" value={formatDate(deal.createdAt)} />
      </CardContent>
    </Card>
  );
}
