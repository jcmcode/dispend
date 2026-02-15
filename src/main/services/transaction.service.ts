import { eq, and, gte, lte, like, desc, sql, inArray, type SQL } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '../db/connection';
import { accounts, transactions, categories } from '../db/schema';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from '@shared/types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Builds an array of WHERE conditions from the filter object.
 */
function buildWhereConditions(filters: TransactionFilters): SQL[] {
  const conditions: SQL[] = [];

  if (filters.accountId) {
    conditions.push(eq(transactions.accountId, filters.accountId));
  }
  if (filters.categoryId) {
    conditions.push(eq(transactions.categoryId, filters.categoryId));
  }
  if (filters.type) {
    conditions.push(eq(transactions.type, filters.type));
  }
  if (filters.status) {
    conditions.push(eq(transactions.status, filters.status));
  }
  if (filters.startDate) {
    conditions.push(gte(transactions.date, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(transactions.date, filters.endDate));
  }
  if (filters.search) {
    conditions.push(like(transactions.description, `%${filters.search}%`));
  }
  if (filters.minAmount !== undefined) {
    conditions.push(gte(transactions.amount, filters.minAmount));
  }
  if (filters.maxAmount !== undefined) {
    conditions.push(lte(transactions.amount, filters.maxAmount));
  }

  return conditions;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Lists transactions with optional filtering, pagination, and joined account/category names.
 * Returns the matching rows and a total count (before limit/offset) for pagination.
 */
export function listTransactions(
  filters: TransactionFilters = {}
): { data: Transaction[]; total: number } {
  const db = getDb();
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;
  const conditions = buildWhereConditions(filters);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Total count for pagination
  const countResult = db
    .select({ value: sql<number>`count(*)` })
    .from(transactions)
    .where(whereClause)
    .get();

  const total = countResult?.value ?? 0;

  // Data query with joined names
  const rows = db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      categoryId: transactions.categoryId,
      date: transactions.date,
      amount: transactions.amount,
      description: transactions.description,
      originalDescription: transactions.originalDescription,
      notes: transactions.notes,
      type: transactions.type,
      status: transactions.status,
      currency: transactions.currency,
      isRecurring: transactions.isRecurring,
      recurringId: transactions.recurringId,
      importBatchId: transactions.importBatchId,
      tags: transactions.tags,
      excludeFromBudget: transactions.excludeFromBudget,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      accountName: accounts.name,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return { data: rows as Transaction[], total };
}

/**
 * Retrieves a single transaction by ID, including joined account/category names.
 */
export function getTransaction(id: string): Transaction | null {
  const db = getDb();

  const row = db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      categoryId: transactions.categoryId,
      date: transactions.date,
      amount: transactions.amount,
      description: transactions.description,
      originalDescription: transactions.originalDescription,
      notes: transactions.notes,
      type: transactions.type,
      status: transactions.status,
      currency: transactions.currency,
      isRecurring: transactions.isRecurring,
      recurringId: transactions.recurringId,
      importBatchId: transactions.importBatchId,
      tags: transactions.tags,
      excludeFromBudget: transactions.excludeFromBudget,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      accountName: accounts.name,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id))
    .get();

  return (row as Transaction) ?? null;
}

/**
 * Creates a new transaction and returns the full row (with joined names).
 */
export function createTransaction(input: CreateTransactionInput): Transaction {
  const db = getDb();
  const now = new Date().toISOString();
  const id = nanoid();

  const newTransaction = {
    id,
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    date: input.date,
    amount: input.amount,
    description: input.description,
    originalDescription: input.originalDescription ?? null,
    notes: input.notes ?? null,
    type: input.type,
    status: input.status ?? 'cleared' as const,
    currency: input.currency,
    isRecurring: input.isRecurring ?? false,
    recurringId: input.recurringId ?? null,
    importBatchId: null,
    tags: input.tags ?? [],
    excludeFromBudget: input.excludeFromBudget ?? false,
    createdAt: now,
    updatedAt: now,
  };

  db.insert(transactions).values(newTransaction).run();

  const created = getTransaction(id);
  if (!created) {
    throw new Error('Failed to create transaction: could not retrieve inserted row.');
  }

  return created;
}

/**
 * Updates an existing transaction and returns the full updated row.
 */
export function updateTransaction(input: UpdateTransactionInput): Transaction {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = getTransaction(input.id);
  if (!existing) {
    throw new Error(`Transaction not found: ${input.id}`);
  }

  const updates: Record<string, unknown> = { updatedAt: now };

  if (input.accountId !== undefined) updates.accountId = input.accountId;
  if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
  if (input.date !== undefined) updates.date = input.date;
  if (input.amount !== undefined) updates.amount = input.amount;
  if (input.description !== undefined) updates.description = input.description;
  if (input.notes !== undefined) updates.notes = input.notes;
  if (input.type !== undefined) updates.type = input.type;
  if (input.status !== undefined) updates.status = input.status;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.excludeFromBudget !== undefined) updates.excludeFromBudget = input.excludeFromBudget;

  db.update(transactions).set(updates).where(eq(transactions.id, input.id)).run();

  const updated = getTransaction(input.id);
  if (!updated) {
    throw new Error(`Failed to retrieve transaction after update: ${input.id}`);
  }

  return updated;
}

/**
 * Deletes a single transaction by ID.
 */
export function deleteTransaction(id: string): void {
  const db = getDb();

  const existing = getTransaction(id);
  if (!existing) {
    throw new Error(`Transaction not found: ${id}`);
  }

  db.delete(transactions).where(eq(transactions.id, id)).run();
}

/**
 * Deletes multiple transactions by their IDs in a single operation.
 * Silently skips any IDs that do not exist.
 */
export function bulkDeleteTransactions(ids: string[]): void {
  if (ids.length === 0) return;

  const db = getDb();

  db.delete(transactions).where(inArray(transactions.id, ids)).run();
}
