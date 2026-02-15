export type AccountType = 'checking' | 'savings' | 'credit_card' | 'investment' | 'cash' | 'loan' | 'other';
export type Currency = 'CAD' | 'USD';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  currency: Currency;
  currentBalance: number;
  isActive: boolean;
  notes: string | null;
  color: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  institution?: string;
  currency: Currency;
  currentBalance?: number;
  notes?: string;
  color?: string;
}

export interface UpdateAccountInput {
  id: string;
  name?: string;
  type?: AccountType;
  institution?: string | null;
  currency?: Currency;
  currentBalance?: number;
  isActive?: boolean;
  notes?: string | null;
  color?: string | null;
  sortOrder?: number;
}
