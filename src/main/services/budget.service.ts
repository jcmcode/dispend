import { eq, and, gte, lte, asc, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { getDb } from '../db/connection';
import { budgets, categories, transactions } from '../db/schema';
import type {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetSpending,
  BudgetPeriod,
} from '@shared/types';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Computes the ISO date-string boundaries for a given budget period
 * relative to a reference date (defaults to now).
 */
function getPeriodBounds(period: BudgetPeriod, ref: Date = new Date()): { start: string; end: string } {
  switch (period) {
    case 'weekly': {
      // Week starts on Monday (weekStartsOn: 1)
      const start = startOfWeek(ref, { weekStartsOn: 1 });
      const end = endOfWeek(ref, { weekStartsOn: 1 });
      return { start: start.toISOString(), end: end.toISOString() };
    }
    case 'monthly': {
      const start = startOfMonth(ref);
      const end = endOfMonth(ref);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    case 'yearly': {
      const start = startOfYear(ref);
      const end = endOfYear(ref);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    default:
      throw new Error(`Unknown budget period: ${period}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all budgets with joined category names, ordered by category name.
 */
export function listBudgets(): Budget[] {
  const db = getDb();

  const rows = db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      amount: budgets.amount,
      period: budgets.period,
      currency: budgets.currency,
      startDate: budgets.startDate,
      endDate: budgets.endDate,
      rollover: budgets.rollover,
      alertThreshold: budgets.alertThreshold,
      isActive: budgets.isActive,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
      categoryName: categories.name,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .orderBy(asc(categories.name))
    .all();

  return rows as Budget[];
}

/**
 * Retrieves a single budget by ID with its category name, or null if not found.
 */
export function getBudget(id: string): Budget | null {
  const db = getDb();

  const row = db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      amount: budgets.amount,
      period: budgets.period,
      currency: budgets.currency,
      startDate: budgets.startDate,
      endDate: budgets.endDate,
      rollover: budgets.rollover,
      alertThreshold: budgets.alertThreshold,
      isActive: budgets.isActive,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
      categoryName: categories.name,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(eq(budgets.id, id))
    .get();

  return (row as Budget) ?? null;
}

/**
 * Creates a new budget and returns the full row.
 */
export function createBudget(input: CreateBudgetInput): Budget {
  const db = getDb();
  const now = new Date().toISOString();
  const id = nanoid();

  const newBudget = {
    id,
    categoryId: input.categoryId,
    amount: input.amount,
    period: input.period,
    currency: input.currency,
    startDate: input.startDate,
    endDate: input.endDate ?? null,
    rollover: input.rollover ?? false,
    alertThreshold: input.alertThreshold ?? 0.8,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  db.insert(budgets).values(newBudget).run();

  const created = getBudget(id);
  if (!created) {
    throw new Error('Failed to create budget: could not retrieve inserted row.');
  }

  return created;
}

/**
 * Updates an existing budget and returns the full updated row.
 */
export function updateBudget(input: UpdateBudgetInput): Budget {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = getBudget(input.id);
  if (!existing) {
    throw new Error(`Budget not found: ${input.id}`);
  }

  const updates: Record<string, unknown> = { updatedAt: now };

  if (input.amount !== undefined) updates.amount = input.amount;
  if (input.period !== undefined) updates.period = input.period;
  if (input.endDate !== undefined) updates.endDate = input.endDate;
  if (input.rollover !== undefined) updates.rollover = input.rollover;
  if (input.alertThreshold !== undefined) updates.alertThreshold = input.alertThreshold;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  db.update(budgets).set(updates).where(eq(budgets.id, input.id)).run();

  const updated = getBudget(input.id);
  if (!updated) {
    throw new Error(`Failed to retrieve budget after update: ${input.id}`);
  }

  return updated;
}

/**
 * Deletes a budget by ID.
 */
export function deleteBudget(id: string): void {
  const db = getDb();

  const existing = getBudget(id);
  if (!existing) {
    throw new Error(`Budget not found: ${id}`);
  }

  db.delete(budgets).where(eq(budgets.id, id)).run();
}

/**
 * Calculates spending against each active budget for the current period.
 *
 * @param period - Optional ISO date string used as the reference point for
 *                 period calculations. Defaults to the current date.
 * @returns An array of BudgetSpending objects with budget amounts, spent totals,
 *          remaining balances, and percentage used.
 */
export function getBudgetSpending(period?: string): BudgetSpending[] {
  const db = getDb();
  const refDate = period ? new Date(period) : new Date();

  // Fetch all active budgets with their category names
  const activeBudgets = db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      amount: budgets.amount,
      period: budgets.period,
      currency: budgets.currency,
      categoryName: categories.name,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(eq(budgets.isActive, true))
    .all();

  if (activeBudgets.length === 0) return [];

  const results: BudgetSpending[] = [];

  for (const budget of activeBudgets) {
    const bounds = getPeriodBounds(budget.period as BudgetPeriod, refDate);

    // Sum absolute value of expense amounts for this category within the period.
    // Expenses are stored as negative amounts so we use ABS.
    // We also exclude transactions flagged as excludeFromBudget.
    const spentResult = db
      .select({
        total: sql<number>`coalesce(sum(abs(${transactions.amount})), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.categoryId, budget.categoryId),
          gte(transactions.date, bounds.start),
          lte(transactions.date, bounds.end),
          eq(transactions.type, 'expense'),
          eq(transactions.excludeFromBudget, false)
        )
      )
      .get();

    const spent = spentResult?.total ?? 0;
    const remaining = Math.max(budget.amount - spent, 0);
    const percentUsed = budget.amount > 0 ? Math.round((spent / budget.amount) * 10000) / 100 : 0;

    results.push({
      budgetId: budget.id,
      categoryId: budget.categoryId,
      categoryName: budget.categoryName ?? 'Unknown',
      budgetAmount: budget.amount,
      spent,
      remaining,
      percentUsed,
      period: budget.period as BudgetPeriod,
      currency: budget.currency as 'CAD' | 'USD',
    });
  }

  return results;
}
