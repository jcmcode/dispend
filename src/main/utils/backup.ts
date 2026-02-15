import fs from 'fs';
import path from 'path';
import { getDbPath, getBackupDir } from './paths';

export function createBackup(): string {
  const dbPath = getDbPath();
  const backupDir = getBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `dispend-backup-${timestamp}.db`);
  fs.copyFileSync(dbPath, backupPath);
  return backupPath;
}
