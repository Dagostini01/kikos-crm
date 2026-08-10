import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DealsBoard } from '@/features/deals/components/DealsBoard';
import { useDealsBoard } from '@/features/deals/hooks/use-deals-board';
import { Page } from '@/shared/ui/page';

export function DealsPage() {
  const {
    columns,
    total,
    query,
    setQuery,
    error,
    actionError,
    isLoading,
    isEmpty,
    pendingDealId,
    markInProgress,
    markWon,
    markLost,
  } = useDealsBoard();

  return (
    <Page
      title="Negócios"
      description="Acompanhamento de negociações ativas"
      actions={
        <>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              className="h-9 pl-8"
              aria-label="Buscar negócios"
            />
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/negocios/novo">
              <Plus />
              Novo Negócio
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-end">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'negócio encontrado' : 'negócios encontrados'}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando negócios…</p>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      {isEmpty ? (
        <p className="text-sm text-muted-foreground">Nenhum negócio encontrado</p>
      ) : null}

      {!isLoading && !error ? (
        <DealsBoard
          columns={columns}
          pendingDealId={pendingDealId}
          onMarkInProgress={(dealId) => void markInProgress(dealId)}
          onMarkWon={(dealId) => void markWon(dealId)}
          onMarkLost={(dealId) => void markLost(dealId)}
        />
      ) : null}
    </Page>
  );
}
