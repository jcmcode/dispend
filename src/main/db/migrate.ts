import { getRawDb } from './connection';

const MIGRATIONS: { version: number; name: string; sql: string }[] = [
  {
    version: 1,
    name: 'initial_schema',
    sql: `
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('checking','savings','credit_card','investment','cash','loan','other')),
        institution TEXT,
        currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency IN ('CAD','USD')),
        current_balance REAL NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        color TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        type TEXT NOT NULL CHECK(type IN ('expense','income','transfer')),
        is_system INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        original_description TEXT,
        notes TEXT,
        type TEXT NOT NULL CHECK(type IN ('expense','income','transfer')),
        status TEXT NOT NULL DEFAULT 'cleared' CHECK(status IN ('cleared','pending','reconciled')),
        currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency IN ('CAD','USD')),
        is_recurring INTEGER NOT NULL DEFAULT 0,
        recurring_id TEXT,
        import_batch_id TEXT,
        tags TEXT DEFAULT '[]',
        exclude_from_budget INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_date_account ON transactions(date, account_id);

      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        amount REAL NOT NULL,
        period TEXT NOT NULL CHECK(period IN ('weekly','monthly','yearly')),
        currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency IN ('CAD','USD')),
        start_date TEXT NOT NULL,
        end_date TEXT,
        rollover INTEGER NOT NULL DEFAULT 0,
        alert_threshold REAL NOT NULL DEFAULT 0.8,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recurring_transactions (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('expense','income','transfer')),
        frequency TEXT NOT NULL CHECK(frequency IN ('daily','weekly','biweekly','monthly','quarterly','yearly')),
        day_of_month INTEGER,
        day_of_week INTEGER,
        start_date TEXT NOT NULL,
        end_date TEXT,
        last_generated_date TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS investment_holdings (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        asset_class TEXT NOT NULL CHECK(asset_class IN ('stock','bond','etf','mutual_fund','crypto','reit','cash','other')),
        shares REAL NOT NULL,
        cost_basis REAL NOT NULL,
        current_price REAL NOT NULL,
        current_value REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency IN ('CAD','USD')),
        last_price_update TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS price_history (
        id TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        date TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL CHECK(currency IN ('CAD','USD')),
        source TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_price_history_symbol_date ON price_history(symbol, date);

      CREATE TABLE IF NOT EXISTS net_worth_snapshots (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        total_assets REAL NOT NULL,
        total_liabilities REAL NOT NULL,
        net_worth REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'CAD' CHECK(currency IN ('CAD','USD')),
        breakdown TEXT DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS import_batches (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL CHECK(file_type IN ('csv','pdf')),
        transaction_count INTEGER NOT NULL DEFAULT 0,
        duplicates_skipped INTEGER NOT NULL DEFAULT 0,
        imported_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS category_rules (
        id TEXT PRIMARY KEY,
        pattern TEXT NOT NULL,
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        match_type TEXT NOT NULL DEFAULT 'contains' CHECK(match_type IN ('contains','starts_with','regex','exact')),
        priority INTEGER NOT NULL DEFAULT 0,
        is_auto_generated INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS _migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL
      );
    `,
  },
];

export function runMigrations(): void {
  const sqlite = getRawDb();

  // Ensure migrations table exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = sqlite
    .prepare('SELECT version FROM _migrations ORDER BY version')
    .all() as { version: number }[];
  const appliedVersions = new Set(applied.map((m) => m.version));

  for (const migration of MIGRATIONS) {
    if (!appliedVersions.has(migration.version)) {
      sqlite.exec(migration.sql);
      sqlite
        .prepare('INSERT INTO _migrations (version, name, applied_at) VALUES (?, ?, ?)')
        .run(migration.version, migration.name, new Date().toISOString());
      console.log(`Applied migration ${migration.version}: ${migration.name}`);
    }
  }
}
