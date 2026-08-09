import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Lead } from '@/features/leads/model/types';

type LeadsTableProps = {
  leads: Lead[];
};

function formatCreatedAt(value: string) {
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
          <TableHead className="px-4">Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="px-4 py-3 font-medium">{lead.name}</TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground">
              {lead.email}
            </TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground">
              {formatCreatedAt(lead.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
