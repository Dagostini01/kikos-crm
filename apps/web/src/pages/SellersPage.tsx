import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/session/use-auth';
import { SellersTable } from '@/features/sellers/components/SellersTable';
import { useSellersList } from '@/features/sellers/hooks/use-sellers-list';
import { Page } from '@/shared/ui/page';

export function SellersPage() {
  const { user } = useAuth();
  const { sellers, total, query, setQuery, error, isLoading, isEmpty } =
    useSellersList();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Page
      title="Vendedores"
      actions={
        <>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              className="h-9 pl-8"
              aria-label="Buscar vendedores"
            />
          </div>
          {isAdmin ? (
            <Button asChild className="w-full sm:w-auto">
              <Link to="/vendedores/novo">
                <Plus />
                Novo Vendedor
              </Link>
            </Button>
          ) : null}
        </>
      }
    >
      <div className="flex items-center justify-end">
        <p className="text-sm text-muted-foreground">
          {total}{' '}
          {total === 1 ? 'vendedor encontrado' : 'vendedores encontrados'}
        </p>
      </div>

      <Card className="py-0">
        <CardContent className="px-0">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">
              Carregando vendedores…
            </p>
          ) : null}

          {error ? <p className="p-6 text-sm text-destructive">{error}</p> : null}

          {isEmpty ? (
            <p className="p-6 text-sm text-muted-foreground">
              Nenhum vendedor encontrado
            </p>
          ) : null}

          {!isLoading && !error && !isEmpty ? (
            <SellersTable sellers={sellers} />
          ) : null}
        </CardContent>
      </Card>
    </Page>
  );
}
