import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { accounts } from './accounts';

export const importBatches = sqliteTable('import_batches', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type', { enum: ['csv', 'pdf'] }).notNull(),
  transactionCount: integer('transaction_count').notNull().default(0),
  duplicatesSkipped: integer('duplicates_skipped').notNull().default(0),
  importedAt: text('imported_at').notNull(),
});
