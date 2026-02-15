import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  period: text('period', { enum: ['weekly', 'monthly', 'yearly'] }).notNull(),
  currency: text('currency', { enum: ['CAD', 'USD'] }).notNull().default('CAD'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  rollover: integer('rollover', { mode: 'boolean' }).notNull().default(false),
  alertThreshold: real('alert_threshold').notNull().default(0.8),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
