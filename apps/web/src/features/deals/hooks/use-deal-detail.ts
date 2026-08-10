import { useCallback, useEffect, useState } from 'react';

import { commentsApi } from '@/features/comments/api/comments-api';
import type { Comment } from '@/features/comments/model/types';
import { dealsApi } from '@/features/deals/api/deals-api';
import type { Deal, DealAiInsights } from '@/features/deals/model/types';
import { getErrorMessage } from '@/shared/http/errors';

export function useDealDetail(dealId: string | undefined) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<DealAiInsights | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingAction, setIsPendingAction] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const load = useCallback(async () => {
    if (!dealId) {
      setError('Negócio não encontrado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [dealResponse, commentsResponse] = await Promise.all([
        dealsApi.get(dealId),
        commentsApi.listByDeal(dealId),
      ]);

      setDeal(dealResponse.deal);
      setComments(commentsResponse.comments);
      setAiInsights(null);
      setAiError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar o negócio'));
      setDeal(null);
      setComments([]);
      setAiInsights(null);
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runTransition(action: () => Promise<{ deal: Deal }>) {
    setActionError(null);
    setIsPendingAction(true);

    try {
      const response = await action();
      setDeal(response.deal);
    } catch (err) {
      setActionError(
        getErrorMessage(err, 'Não foi possível atualizar o status'),
      );
    } finally {
      setIsPendingAction(false);
    }
  }

  async function addComment(content: string) {
    if (!dealId) {
      return;
    }

    setActionError(null);
    setIsSubmittingComment(true);

    try {
      const response = await commentsApi.createForDeal(dealId, { content });
      setComments((current) => [...current, response.comment]);
    } catch (err) {
      setActionError(
        getErrorMessage(err, 'Não foi possível enviar o comentário'),
      );
      throw err;
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function generateAiInsights() {
    if (!dealId) {
      return;
    }

    setAiError(null);
    setIsGeneratingAi(true);

    try {
      const insights = await dealsApi.generateAiInsights(dealId);
      setAiInsights(insights);
    } catch (err) {
      setAiError(
        getErrorMessage(
          err,
          'Não foi possível gerar insights com IA. Verifique se OPENAI_API_KEY está configurada na API.',
        ),
      );
    } finally {
      setIsGeneratingAi(false);
    }
  }

  return {
    deal,
    comments,
    error,
    actionError,
    aiInsights,
    aiError,
    isLoading,
    isPendingAction,
    isSubmittingComment,
    isGeneratingAi,
    markInProgress: () =>
      dealId
        ? runTransition(() => dealsApi.markInProgress(dealId))
        : Promise.resolve(),
    markWon: () =>
      dealId ? runTransition(() => dealsApi.markWon(dealId)) : Promise.resolve(),
    markLost: () =>
      dealId
        ? runTransition(() => dealsApi.markLost(dealId))
        : Promise.resolve(),
    addComment,
    generateAiInsights,
  };
}
