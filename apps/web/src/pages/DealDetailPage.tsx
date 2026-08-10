import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DealComments } from '@/features/deals/components/DealComments';
import { DealDetailMeta } from '@/features/deals/components/DealDetailMeta';
import { DealDetailSummary } from '@/features/deals/components/DealDetailSummary';
import { useDealDetail } from '@/features/deals/hooks/use-deal-detail';
import { Page } from '@/shared/ui/page';

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    deal,
    comments,
    error,
    actionError,
    isLoading,
    isPendingAction,
    isSubmittingComment,
    markInProgress,
    markWon,
    markLost,
    addComment,
  } = useDealDetail(id);

  if (isLoading) {
    return (
      <Page title="Negócio">
        <p className="text-sm text-muted-foreground">Carregando negócio…</p>
      </Page>
    );
  }

  if (error || !deal) {
    return (
      <Page
        title="Negócio"
        actions={
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/negocios">
              <ArrowLeft />
              Voltar ao board
            </Link>
          </Button>
        }
      >
        <p className="text-sm text-destructive">
          {error ?? 'Negócio não encontrado'}
        </p>
      </Page>
    );
  }

  return (
    <Page
      title={deal.title}
      actions={
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/negocios">
            <ArrowLeft />
            Voltar ao board
          </Link>
        </Button>
      }
    >
      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <DealDetailSummary
            deal={deal}
            isPending={isPendingAction}
            onMarkInProgress={() => void markInProgress()}
            onMarkWon={() => void markWon()}
            onMarkLost={() => void markLost()}
          />
          <DealDetailMeta deal={deal} />
        </div>

        <DealComments
          comments={comments}
          isSubmitting={isSubmittingComment}
          onSubmit={async (content) => {
            await addComment(content);
          }}
        />
      </div>
    </Page>
  );
}
