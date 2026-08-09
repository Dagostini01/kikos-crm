import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DEAL_STATUS_META,
  formatDealValue,
} from '@/features/deals/model/status';
import type { Deal } from '@/features/deals/model/types';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

type DealCardProps = {
  deal: Deal;
  isPending: boolean;
  onMarkInProgress: (dealId: string) => void;
  onMarkWon: (dealId: string) => void;
  onMarkLost: (dealId: string) => void;
};

export function DealCard({
  deal,
  isPending,
  onMarkInProgress,
  onMarkWon,
  onMarkLost,
}: DealCardProps) {
  const navigate = useNavigate();
  const meta = DEAL_STATUS_META[deal.status];

  return (
    <Card className="gap-0 py-3 transition-colors hover:border-primary/40">
      <CardContent className="space-y-3 px-3">
        <button
          type="button"
          className="w-full space-y-1 text-left"
          onClick={() => navigate(`/negocios/${deal.id}`)}
        >
          <p className="line-clamp-2 text-sm font-semibold leading-snug">
            {deal.title}
          </p>
          <p className={`text-sm font-medium ${meta.valueClassName}`}>
            {formatDealValue(deal.valueInCents)}
          </p>
        </button>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <UserRound className="size-3.5 shrink-0" />
            <span className="truncate">{deal.lead.name}</span>
          </div>
          <Avatar size="sm">
            <AvatarFallback>{initials(deal.seller.name)}</AvatarFallback>
          </Avatar>
        </div>

        {deal.status === 'NEW' ? (
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={isPending}
            onClick={(event) => {
              event.stopPropagation();
              onMarkInProgress(deal.id);
            }}
          >
            Em andamento
          </Button>
        ) : null}

        {deal.status === 'IN_PROGRESS' ? (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="flex-1"
              disabled={isPending}
              onClick={(event) => {
                event.stopPropagation();
                onMarkWon(deal.id);
              }}
            >
              Ganho
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={isPending}
              onClick={(event) => {
                event.stopPropagation();
                onMarkLost(deal.id);
              }}
            >
              Perdido
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
