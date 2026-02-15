export const IPC_CHANNELS = {
  // Accounts
  ACCOUNTS_LIST: 'accounts:list',
  ACCOUNTS_GET: 'accounts:get',
  ACCOUNTS_CREATE: 'accounts:create',
  ACCOUNTS_UPDATE: 'accounts:update',
  ACCOUNTS_DELETE: 'accounts:delete',

  // Transactions
  TRANSACTIONS_LIST: 'transactions:list',
  TRANSACTIONS_GET: 'transactions:get',
  TRANSACTIONS_CREATE: 'transactions:create',
  TRANSACTIONS_UPDATE: 'transactions:update',
  TRANSACTIONS_DELETE: 'transactions:delete',
  TRANSACTIONS_BULK_DELETE: 'transactions:bulk-delete',

  // Categories
  CATEGORIES_LIST: 'categories:list',
  CATEGORIES_GET: 'categories:get',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  // Budgets
  BUDGETS_LIST: 'budgets:list',
  BUDGETS_GET: 'budgets:get',
  BUDGETS_CREATE: 'budgets:create',
  BUDGETS_UPDATE: 'budgets:update',
  BUDGETS_DELETE: 'budgets:delete',
  BUDGETS_SPENDING: 'budgets:spending',

  // Import
  IMPORT_OPEN_FILE: 'import:open-file',
  IMPORT_PARSE: 'import:parse',
  IMPORT_EXECUTE: 'import:execute',
  IMPORT_UNDO: 'import:undo',
  IMPORT_BATCHES: 'import:batches',

  // Investments
  INVESTMENTS_LIST: 'investments:list',
  INVESTMENTS_GET: 'investments:get',
  INVESTMENTS_CREATE: 'investments:create',
  INVESTMENTS_UPDATE: 'investments:update',
  INVESTMENTS_DELETE: 'investments:delete',

  // Insights
  INSIGHTS_GET: 'insights:get',
  INSIGHTS_ANOMALIES: 'insights:anomalies',
  INSIGHTS_TRENDS: 'insights:trends',
  INSIGHTS_RECURRING: 'insights:recurring',

  // Reports
  REPORTS_SPENDING_BY_CATEGORY: 'reports:spending-by-category',
  REPORTS_MONTHLY_SUMMARY: 'reports:monthly-summary',
  REPORTS_EXPORT_CSV: 'reports:export-csv',

  // Net Worth
  NET_WORTH_SNAPSHOTS: 'net-worth:snapshots',
  NET_WORTH_CREATE_SNAPSHOT: 'net-worth:create-snapshot',

  // Category Rules
  CATEGORY_RULES_LIST: 'category-rules:list',
  CATEGORY_RULES_CREATE: 'category-rules:create',
  CATEGORY_RULES_UPDATE: 'category-rules:update',
  CATEGORY_RULES_DELETE: 'category-rules:delete',

  // App
  APP_GET_THEME: 'app:get-theme',
  APP_SET_THEME: 'app:set-theme',
  APP_BACKUP: 'app:backup',
} as const;
