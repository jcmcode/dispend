import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { getDbPath } from '../utils/paths';

let db: ReturnType<typeof drizzle> | null = null;
let sqlite: Database.Database | null = null;

export function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    db = drizzle(sqlite, { schema });
  }
  return db;
}

export function closeDb() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    db = null;
  }
}

export function getRawDb() {
  if (!sqlite) {
    getDb();
  }
  return sqlite!;
}
