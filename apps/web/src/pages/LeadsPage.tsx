import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LeadsTable } from '@/features/leads/components/LeadsTable';
import { useLeadsList } from '@/features/leads/hooks/use-leads-list';
import { Page } from '@/shared/ui/page';

export function LeadsPage() {
  const { leads, total, query, setQuery, error, isLoading, isEmpty } =
    useLeadsList();

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
      <div className="flex items-center justify-end">
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
