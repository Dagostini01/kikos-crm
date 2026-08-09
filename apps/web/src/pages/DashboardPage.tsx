import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { DEAL_STATUS_META } from '@/features/deals/model/status';
import type { DealStatus } from '@/features/deals/model/types';
import { Page } from '@/shared/ui/page';

const STATUS_ORDER: DealStatus[] = ['NEW', 'IN_PROGRESS', 'WON', 'LOST'];

export function DashboardPage() {
  const { stats, error, isLoading } = useDashboard();

  return (
    <Page
      title="Dashboard"
      description="Visão geral do pipeline de vendas"
      actions={
        <Button asChild>
          <Link to="/negocios">Abrir Negócios</Link>
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando dashboard…</p>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {stats ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Leads</CardDescription>
                <CardTitle className="text-3xl">{stats.leadsCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link to="/leads">Ver leads</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Negócios</CardDescription>
                <CardTitle className="text-3xl">{stats.dealsCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link to="/negocios">Ver kanban</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Vendedores</CardDescription>
                <CardTitle className="text-3xl">{stats.sellersCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link to="/vendedores">Ver vendedores</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pipeline por status</CardTitle>
              <CardDescription>
                Distribuição atual dos negócios no funil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS_ORDER.map((status) => {
                  const meta = DEAL_STATUS_META[status];

                  return (
                    <div
                      key={status}
                      className="rounded-lg border border-border/60 bg-muted/20 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${meta.dotClassName}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {meta.label}
                        </span>
                      </div>
                      <p className={`text-2xl font-semibold ${meta.valueClassName}`}>
                        {stats.dealsByStatus[status]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </Page>
  );
}
