import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { DealAiInsights } from '@/features/deals/model/types';

type DealAiInsightsCardProps = {
  insights: DealAiInsights | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
};

export function DealAiInsightsCard({
  insights,
  isLoading,
  error,
  onGenerate,
}: DealAiInsightsCardProps) {
  return (
    <Card>
      <CardHeader className="gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            Assistente IA
          </CardTitle>
          <CardDescription>
            Resumo dos comentários e sugestão do próximo passo
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
          disabled={isLoading}
          onClick={onGenerate}
        >
          {isLoading ? 'Gerando…' : insights ? 'Gerar novamente' : 'Gerar insights'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {!insights && !error && !isLoading ? (
          <p className="text-sm text-muted-foreground">
            Use a IA para resumir o histórico deste negócio e sugerir a próxima
            ação comercial.
          </p>
        ) : null}

        {insights ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Resumo
              </p>
              <p className="text-sm leading-relaxed">{insights.summary}</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="mb-1 text-xs font-medium tracking-wide text-primary uppercase">
                Próximo passo
              </p>
              <p className="text-sm leading-relaxed">{insights.nextStep}</p>
            </div>
            <p className="text-xs text-muted-foreground">Modelo: {insights.model}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
