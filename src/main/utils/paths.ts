import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export function getDbPath(): string {
  const userDataPath = app.getPath('userData');
  const dbDir = path.join(userDataPath, 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return path.join(dbDir, 'dispend.db');
}

export function getBackupDir(): string {
  const userDataPath = app.getPath('userData');
  const backupDir = path.join(userDataPath, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}
