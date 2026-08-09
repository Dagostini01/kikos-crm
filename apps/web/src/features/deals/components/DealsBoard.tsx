import { DealColumn } from '@/features/deals/components/DealColumn';
import type { Deal, DealStatus } from '@/features/deals/model/types';

type BoardColumn = {
  status: DealStatus;
  deals: Deal[];
};

type DealsBoardProps = {
  columns: BoardColumn[];
  pendingDealId: string | null;
  onMarkInProgress: (dealId: string) => void;
  onMarkWon: (dealId: string) => void;
  onMarkLost: (dealId: string) => void;
};

export function DealsBoard({
  columns,
  pendingDealId,
  onMarkInProgress,
  onMarkWon,
  onMarkLost,
}: DealsBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <DealColumn
          key={column.status}
          status={column.status}
          deals={column.deals}
          pendingDealId={pendingDealId}
          onMarkInProgress={onMarkInProgress}
          onMarkWon={onMarkWon}
          onMarkLost={onMarkLost}
        />
      ))}
    </div>
  );
}
