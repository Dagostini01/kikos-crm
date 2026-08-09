import type { DealStatus } from '@/features/deals/model/types';

export type DealStatusMeta = {
  status: DealStatus;
  label: string;
  dotClassName: string;
  valueClassName: string;
};

export const DEAL_STATUS_ORDER: DealStatus[] = [
  'NEW',
  'IN_PROGRESS',
  'WON',
  'LOST',
];

export const DEAL_STATUS_META: Record<DealStatus, DealStatusMeta> = {
  NEW: {
    status: 'NEW',
    label: 'Novo',
    dotClassName: 'bg-sky-400',
    valueClassName: 'text-sky-400',
  },
  IN_PROGRESS: {
    status: 'IN_PROGRESS',
    label: 'Em andamento',
    dotClassName: 'bg-primary',
    valueClassName: 'text-primary',
  },
  WON: {
    status: 'WON',
    label: 'Ganho',
    dotClassName: 'bg-emerald-400',
    valueClassName: 'text-emerald-400',
  },
  LOST: {
    status: 'LOST',
    label: 'Perdido',
    dotClassName: 'bg-destructive',
    valueClassName: 'text-destructive',
  },
};

export function formatDealValue(valueInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valueInCents / 100);
}
