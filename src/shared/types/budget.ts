import type { Currency } from './account';

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  currency: Currency;
  startDate: string;
  endDate: string | null;
  rollover: boolean;
  alertThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed
  categoryName?: string;
  spent?: number;
  remaining?: number;
  percentUsed?: number;
}

export interface CreateBudgetInput {
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  currency: Currency;
  startDate: string;
  endDate?: string;
  rollover?: boolean;
  alertThreshold?: number;
}

export interface UpdateBudgetInput {
  id: string;
  amount?: number;
  period?: BudgetPeriod;
  endDate?: string | null;
  rollover?: boolean;
  alertThreshold?: number;
  isActive?: boolean;
}

export interface BudgetSpending {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  period: BudgetPeriod;
  currency: Currency;
}
