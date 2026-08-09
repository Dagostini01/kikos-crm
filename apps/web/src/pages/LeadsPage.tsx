import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEAL_STATUS_META } from '@/features/deals/model/status';
import type { DealStatus } from '@/features/deals/model/types';
import { LeadsTable } from '@/features/leads/components/LeadsTable';
import { useLeadsList } from '@/features/leads/hooks/use-leads-list';
import { Page } from '@/shared/ui/page';

const STATUS_OPTIONS: Array<{ value: 'ALL' | DealStatus; label: string }> = [
  { value: 'ALL', label: 'Status: Todos' },
  { value: 'NEW', label: `Status: ${DEAL_STATUS_META.NEW.label}` },
  {
    value: 'IN_PROGRESS',
    label: `Status: ${DEAL_STATUS_META.IN_PROGRESS.label}`,
  },
  { value: 'WON', label: `Status: ${DEAL_STATUS_META.WON.label}` },
  { value: 'LOST', label: `Status: ${DEAL_STATUS_META.LOST.label}` },
];

export function LeadsPage() {
  const {
    leads,
    total,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    sellerFilter,
    setSellerFilter,
    sellerOptions,
    error,
    isLoading,
    isEmpty,
  } = useLeadsList();

  return (
    <Page
      title="Lista de Leads"
      actions={
        <>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              className="h-9 pl-8"
              aria-label="Buscar leads"
            />
          </div>
          <Button asChild>
            <Link to="/leads/novo">
              <Plus />
              Novo Lead
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as typeof statusFilter)
            }
          >
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Status: Todos" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sellerFilter}
            onValueChange={(value) =>
              setSellerFilter(value as typeof sellerFilter)
            }
          >
            <SelectTrigger className="h-9 w-[220px]">
              <SelectValue placeholder="Vendedor: Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Vendedor: Todos</SelectItem>
              {sellerOptions.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  Vendedor: {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'Lead encontrado' : 'Leads encontrados'}
        </p>
      </div>

      <Card className="py-0">
        <CardContent className="px-0">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Carregando leads…</p>
          ) : null}

          {error ? (
            <p className="p-6 text-sm text-destructive">{error}</p>
          ) : null}

          {isEmpty ? (
            <p className="p-6 text-sm text-muted-foreground">
              Nenhum lead encontrado
            </p>
          ) : null}

          {!isLoading && !error && !isEmpty ? <LeadsTable leads={leads} /> : null}
        </CardContent>
      </Card>
    </Page>
  );
}
