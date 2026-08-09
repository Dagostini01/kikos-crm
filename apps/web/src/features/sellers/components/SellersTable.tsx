import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Seller } from '@/features/sellers/model/types';

type SellersTableProps = {
  sellers: Seller[];
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function SellersTable({ sellers }: SellersTableProps) {
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
        {sellers.map((seller) => (
          <TableRow key={seller.id}>
            <TableCell className="px-4 py-3 font-medium">{seller.name}</TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground">
              {seller.email}
            </TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground">
              {formatCreatedAt(seller.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
