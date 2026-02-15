import type { Currency } from '@shared/types';

const CAD_FORMATTER = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
});

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number, currency: Currency = 'CAD'): string {
  const formatter = currency === 'USD' ? USD_FORMATTER : CAD_FORMATTER;
  return formatter.format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
