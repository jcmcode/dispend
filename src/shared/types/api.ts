import type { Account, CreateAccountInput, UpdateAccountInput } from './account';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from './transaction';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './category';
import type { Budget, CreateBudgetInput, UpdateBudgetInput, BudgetSpending } from './budget';
import type {
  InvestmentHolding,
  CreateInvestmentInput,
  UpdateInvestmentInput,
  NetWorthSnapshot,
} from './investment';
import type {
  ImportPreview,
  ImportResult,
  ImportBatch,
  CategoryRule,
  CreateCategoryRuleInput,
} from './import';
import type { Insight, SpendingAnomaly, SpendingTrend, RecurringDetection } from './insight';

export interface DispendAPI {
  // Accounts
  accounts: {
    list(): Promise<Account[]>;
    get(id: string): Promise<Account | null>;
    create(input: CreateAccountInput): Promise<Account>;
    update(input: UpdateAccountInput): Promise<Account>;
    delete(id: string): Promise<void>;
  };

  // Transactions
  transactions: {
    list(filters?: TransactionFilters): Promise<{ data: Transaction[]; total: number }>;
    get(id: string): Promise<Transaction | null>;
    create(input: CreateTransactionInput): Promise<Transaction>;
    update(input: UpdateTransactionInput): Promise<Transaction>;
    delete(id: string): Promise<void>;
    bulkDelete(ids: string[]): Promise<void>;
  };

  // Categories
  categories: {
    list(): Promise<Category[]>;
    get(id: string): Promise<Category | null>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(input: UpdateCategoryInput): Promise<Category>;
    delete(id: string): Promise<void>;
  };

  // Budgets
  budgets: {
    list(): Promise<Budget[]>;
    get(id: string): Promise<Budget | null>;
    create(input: CreateBudgetInput): Promise<Budget>;
    update(input: UpdateBudgetInput): Promise<Budget>;
    delete(id: string): Promise<void>;
    getSpending(period?: string): Promise<BudgetSpending[]>;
  };

  // Import
  import: {
    openFile(): Promise<{ filePath: string; fileType: string } | null>;
    parse(filePath: string, accountId: string): Promise<ImportPreview>;
    execute(
      accountId: string,
      transactions: ImportPreview['transactions'],
      batchInfo: { fileName: string; fileType: string }
    ): Promise<ImportResult>;
    undo(batchId: string): Promise<void>;
    listBatches(): Promise<ImportBatch[]>;
  };

  // Investments
  investments: {
    list(accountId?: string): Promise<InvestmentHolding[]>;
    get(id: string): Promise<InvestmentHolding | null>;
    create(input: CreateInvestmentInput): Promise<InvestmentHolding>;
    update(input: UpdateInvestmentInput): Promise<InvestmentHolding>;
    delete(id: string): Promise<void>;
  };

  // Insights
  insights: {
    getAll(): Promise<Insight[]>;
    getAnomalies(): Promise<SpendingAnomaly[]>;
    getTrends(): Promise<SpendingTrend[]>;
    getRecurring(): Promise<RecurringDetection[]>;
  };

  // Reports
  reports: {
    spendingByCategory(startDate: string, endDate: string): Promise<{ category: string; amount: number; color: string }[]>;
    monthlySummary(months: number): Promise<{ month: string; income: number; expenses: number }[]>;
    exportCsv(data: Record<string, unknown>[], fileName: string): Promise<void>;
  };

  // Net Worth
  netWorth: {
    getSnapshots(): Promise<NetWorthSnapshot[]>;
    createSnapshot(): Promise<NetWorthSnapshot>;
  };

  // Category Rules
  categoryRules: {
    list(): Promise<CategoryRule[]>;
    create(input: CreateCategoryRuleInput): Promise<CategoryRule>;
    update(id: string, input: Partial<CreateCategoryRuleInput>): Promise<CategoryRule>;
    delete(id: string): Promise<void>;
  };

  // App
  app: {
    getTheme(): Promise<'light' | 'dark' | 'system'>;
    setTheme(theme: 'light' | 'dark' | 'system'): Promise<void>;
    backup(): Promise<string>;
  };
}
