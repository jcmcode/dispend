import { eq, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '../db/connection';
import { accounts } from '../db/schema';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@shared/types';

/**
 * Returns all accounts ordered by sortOrder then name.
 */
export function listAccounts(): Account[] {
  const db = getDb();

  const rows = db
    .select()
    .from(accounts)
    .orderBy(asc(accounts.sortOrder), asc(accounts.name))
    .all();

  return rows as Account[];
}

/**
 * Retrieves a single account by its ID, or null if not found.
 */
export function getAccount(id: string): Account | null {
  const db = getDb();

  const row = db
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .get();

  return (row as Account) ?? null;
}

/**
 * Creates a new account and returns the full row.
 */
export function createAccount(input: CreateAccountInput): Account {
  const db = getDb();
  const now = new Date().toISOString();
  const id = nanoid();

  const newAccount = {
    id,
    name: input.name,
    type: input.type,
    institution: input.institution ?? null,
    currency: input.currency,
    currentBalance: input.currentBalance ?? 0,
    isActive: true,
    notes: input.notes ?? null,
    color: input.color ?? null,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.insert(accounts).values(newAccount).run();

  const created = getAccount(id);
  if (!created) {
    throw new Error('Failed to create account: could not retrieve inserted row.');
  }

  return created;
}

/**
 * Updates an existing account and returns the full updated row.
 * Only the fields present on the input object are modified.
 */
export function updateAccount(input: UpdateAccountInput): Account {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = getAccount(input.id);
  if (!existing) {
    throw new Error(`Account not found: ${input.id}`);
  }

  const updates: Record<string, unknown> = { updatedAt: now };

  if (input.name !== undefined) updates.name = input.name;
  if (input.type !== undefined) updates.type = input.type;
  if (input.institution !== undefined) updates.institution = input.institution;
  if (input.currency !== undefined) updates.currency = input.currency;
  if (input.currentBalance !== undefined) updates.currentBalance = input.currentBalance;
  if (input.isActive !== undefined) updates.isActive = input.isActive;
  if (input.notes !== undefined) updates.notes = input.notes;
  if (input.color !== undefined) updates.color = input.color;
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;

  db.update(accounts).set(updates).where(eq(accounts.id, input.id)).run();

  const updated = getAccount(input.id);
  if (!updated) {
    throw new Error(`Failed to retrieve account after update: ${input.id}`);
  }

  return updated;
}

/**
 * Deletes an account by ID.
 * Associated transactions are removed via ON DELETE CASCADE.
 */
export function deleteAccount(id: string): void {
  const db = getDb();

  const existing = getAccount(id);
  if (!existing) {
    throw new Error(`Account not found: ${id}`);
  }

  db.delete(accounts).where(eq(accounts.id, id)).run();
}
