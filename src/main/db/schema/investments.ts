import { sqliteTable, text, real, index } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';

export const investmentHoldings = sqliteTable('investment_holdings', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  assetClass: text('asset_class', {
    enum: ['stock', 'bond', 'etf', 'mutual_fund', 'crypto', 'reit', 'cash', 'other'],
  }).notNull(),
  shares: real('shares').notNull(),
  costBasis: real('cost_basis').notNull(),
  currentPrice: real('current_price').notNull(),
  currentValue: real('current_value').notNull(),
  currency: text('currency', { enum: ['CAD', 'USD'] }).notNull().default('CAD'),
  lastPriceUpdate: text('last_price_update'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const priceHistory = sqliteTable(
  'price_history',
  {
    id: text('id').primaryKey(),
    symbol: text('symbol').notNull(),
    date: text('date').notNull(),
    price: real('price').notNull(),
    currency: text('currency', { enum: ['CAD', 'USD'] }).notNull(),
    source: text('source'),
  },
  (table) => [
    index('idx_price_history_symbol_date').on(table.symbol, table.date),
  ]
);
