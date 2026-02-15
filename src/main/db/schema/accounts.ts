import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['checking', 'savings', 'credit_card', 'investment', 'cash', 'loan', 'other'],
  }).notNull(),
  institution: text('institution'),
  currency: text('currency', { enum: ['CAD', 'USD'] }).notNull().default('CAD'),
  currentBalance: real('current_balance').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  notes: text('notes'),
  color: text('color'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
