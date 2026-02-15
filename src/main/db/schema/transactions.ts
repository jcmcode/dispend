import { sqliteTable, text, real, integer, index } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';
import { categories } from './categories';

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
    date: text('date').notNull(),
    amount: real('amount').notNull(),
    description: text('description').notNull(),
    originalDescription: text('original_description'),
    notes: text('notes'),
    type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
    status: text('status', { enum: ['cleared', 'pending', 'reconciled'] })
      .notNull()
      .default('cleared'),
    currency: text('currency', { enum: ['CAD', 'USD'] }).notNull().default('CAD'),
    isRecurring: integer('is_recurring', { mode: 'boolean' }).notNull().default(false),
    recurringId: text('recurring_id'),
    importBatchId: text('import_batch_id'),
    tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
    excludeFromBudget: integer('exclude_from_budget', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_transactions_date').on(table.date),
    index('idx_transactions_account').on(table.accountId),
    index('idx_transactions_category').on(table.categoryId),
    index('idx_transactions_date_account').on(table.date, table.accountId),
  ]
);
