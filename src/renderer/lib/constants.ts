import type { AccountType, TransactionType, TransactionStatus, Currency } from '@shared/types';

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'investment', label: 'Investment' },
  { value: 'cash', label: 'Cash' },
  { value: 'loan', label: 'Loan' },
  { value: 'other', label: 'Other' },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
];

export const TRANSACTION_STATUSES: { value: TransactionStatus; label: string }[] = [
  { value: 'cleared', label: 'Cleared' },
  { value: 'pending', label: 'Pending' },
  { value: 'reconciled', label: 'Reconciled' },
];

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { value: 'USD', label: 'US Dollar', symbol: 'US$' },
];

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  checking: 'landmark',
  savings: 'piggy-bank',
  credit_card: 'credit-card',
  investment: 'trending-up',
  cash: 'banknote',
  loan: 'hand-coins',
  other: 'wallet',
};
