import path from 'path';
import fs from 'fs';

function getDataRoot(): string {
  return process.env.DISPEND_DATA_DIR || path.join(process.cwd(), 'data');
}

export function getDbPath(): string {
  const dbDir = getDataRoot();
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return path.join(dbDir, 'dispend.db');
}

export function getBackupDir(): string {
  const backupDir = path.join(getDataRoot(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}
