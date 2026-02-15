import type { Currency } from './account';

export type TransactionType = 'expense' | 'income' | 'transfer';
export type TransactionStatus = 'cleared' | 'pending' | 'reconciled';

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string | null;
  date: string;
  amount: number;
  description: string;
  originalDescription: string | null;
  notes: string | null;
  type: TransactionType;
  status: TransactionStatus;
  currency: Currency;
  isRecurring: boolean;
  recurringId: string | null;
  importBatchId: string | null;
  tags: string[];
  excludeFromBudget: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  accountName?: string;
  categoryName?: string;
}

export interface CreateTransactionInput {
  accountId: string;
  categoryId?: string;
  date: string;
  amount: number;
  description: string;
  originalDescription?: string;
  notes?: string;
  type: TransactionType;
  status?: TransactionStatus;
  currency: Currency;
  isRecurring?: boolean;
  recurringId?: string;
  tags?: string[];
  excludeFromBudget?: boolean;
}

export interface UpdateTransactionInput {
  id: string;
  accountId?: string;
  categoryId?: string | null;
  date?: string;
  amount?: number;
  description?: string;
  notes?: string | null;
  type?: TransactionType;
  status?: TransactionStatus;
  tags?: string[];
  excludeFromBudget?: boolean;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}
