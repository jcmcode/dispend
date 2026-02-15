import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';
import { categories } from './categories';

export const recurringTransactions = sqliteTable('recurring_transactions', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
  frequency: text('frequency', {
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
  }).notNull(),
  dayOfMonth: integer('day_of_month'),
  dayOfWeek: integer('day_of_week'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  lastGeneratedDate: text('last_generated_date'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});
