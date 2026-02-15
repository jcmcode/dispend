import type { Currency } from './account';

export type AssetClass = 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'crypto' | 'reit' | 'cash' | 'other';

export interface InvestmentHolding {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  shares: number;
  costBasis: number;
  currentPrice: number;
  currentValue: number;
  currency: Currency;
  lastPriceUpdate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed
  gainLoss?: number;
  gainLossPercent?: number;
}

export interface CreateInvestmentInput {
  accountId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  shares: number;
  costBasis: number;
  currentPrice: number;
  currency: Currency;
  notes?: string;
}

export interface UpdateInvestmentInput {
  id: string;
  symbol?: string;
  name?: string;
  assetClass?: AssetClass;
  shares?: number;
  costBasis?: number;
  currentPrice?: number;
  notes?: string | null;
}

export interface NetWorthSnapshot {
  id: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  currency: Currency;
  breakdown: Record<string, number>;
  createdAt: string;
}
