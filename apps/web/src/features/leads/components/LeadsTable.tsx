import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DEAL_STATUS_META } from '@/features/deals/model/status';
import type { Lead } from '@/features/leads/model/types';

type LeadsTableProps = {
  leads: Lead[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">Nome</TableHead>
          <TableHead className="px-4">E-mail</TableHead>
          <TableHead className="px-4">Vendedor</TableHead>
          <TableHead className="px-4">Status</TableHead>
          <TableHead className="px-4">Última Interação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {
          const statusMeta = lead.status
            ? DEAL_STATUS_META[lead.status]
            : null;

          return (
            <TableRow key={lead.id}>
              <TableCell className="px-4 py-3 font-medium">{lead.name}</TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {lead.email}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {lead.seller?.name ?? '—'}
              </TableCell>
              <TableCell className="px-4 py-3">
                {statusMeta ? (
                  <Badge
                    variant="outline"
                    className={statusMeta.valueClassName}
                  >
                    {statusMeta.label}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {lead.lastInteractionAt
                  ? formatDateTime(lead.lastInteractionAt)
                  : '—'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
