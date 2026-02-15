import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const netWorthSnapshots = sqliteTable('net_worth_snapshots', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  totalAssets: real('total_assets').notNull(),
  totalLiabilities: real('total_liabilities').notNull(),
  netWorth: real('net_worth').notNull(),
  currency: text('currency', { enum: ['CAD', 'USD'] }).notNull().default('CAD'),
  breakdown: text('breakdown', { mode: 'json' }).$type<Record<string, number>>().default({}),
  createdAt: text('created_at').notNull(),
});
