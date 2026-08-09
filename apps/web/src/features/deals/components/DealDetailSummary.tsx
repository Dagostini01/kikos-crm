import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DEAL_STATUS_META,
  formatDealValue,
} from '@/features/deals/model/status';
import type { Deal } from '@/features/deals/model/types';

type DealDetailSummaryProps = {
  deal: Deal;
  isPending: boolean;
  onMarkInProgress: () => void;
  onMarkWon: () => void;
  onMarkLost: () => void;
};

export function DealDetailSummary({
  deal,
  isPending,
  onMarkInProgress,
  onMarkWon,
  onMarkLost,
}: DealDetailSummaryProps) {
  const meta = DEAL_STATUS_META[deal.status];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">ID: {deal.id}</p>
          <CardTitle className="text-lg">{deal.title}</CardTitle>
        </div>
        <Badge variant="outline" className={meta.valueClassName}>
          {meta.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">Valor Proposto</p>
          <p className={`mt-1 text-2xl font-semibold ${meta.valueClassName}`}>
            {formatDealValue(deal.valueInCents)}
          </p>
        </div>

        {deal.status === 'NEW' ? (
          <Button
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={onMarkInProgress}
          >
            Em andamento
          </Button>
        ) : null}

        {deal.status === 'IN_PROGRESS' ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
              disabled={isPending}
              onClick={onMarkWon}
            >
              Marcar Ganho
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
              disabled={isPending}
              onClick={onMarkLost}
            >
              Perdido
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
