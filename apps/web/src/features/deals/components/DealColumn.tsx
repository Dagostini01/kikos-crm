import { Badge } from '@/components/ui/badge';
import { DealCard } from '@/features/deals/components/DealCard';
import { DEAL_STATUS_META } from '@/features/deals/model/status';
import type { Deal, DealStatus } from '@/features/deals/model/types';

type DealColumnProps = {
  status: DealStatus;
  deals: Deal[];
  pendingDealId: string | null;
  onMarkInProgress: (dealId: string) => void;
  onMarkWon: (dealId: string) => void;
  onMarkLost: (dealId: string) => void;
};

export function DealColumn({
  status,
  deals,
  pendingDealId,
  onMarkInProgress,
  onMarkWon,
  onMarkLost,
}: DealColumnProps) {
  const meta = DEAL_STATUS_META[status];

  return (
    <section className="flex w-72 shrink-0 flex-col gap-3">
      <header className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${meta.dotClassName}`} />
          <h2 className="text-sm font-semibold">{meta.label}</h2>
        </div>
        <Badge variant="outline">{deals.length}</Badge>
      </header>

      <div className="flex min-h-40 flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-2">
        {deals.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Nenhum negócio
          </p>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isPending={pendingDealId === deal.id}
              onMarkInProgress={onMarkInProgress}
              onMarkWon={onMarkWon}
              onMarkLost={onMarkLost}
            />
          ))
        )}
      </div>
    </section>
  );
}
