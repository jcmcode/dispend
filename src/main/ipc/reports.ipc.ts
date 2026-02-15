import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';

// Stub handlers for Phase 4
export function registerReportHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.REPORTS_SPENDING_BY_CATEGORY, async () => []);
  ipcMain.handle(IPC_CHANNELS.REPORTS_MONTHLY_SUMMARY, async () => []);
  ipcMain.handle(IPC_CHANNELS.REPORTS_EXPORT_CSV, async () => {});

  ipcMain.handle(IPC_CHANNELS.NET_WORTH_SNAPSHOTS, async () => []);
  ipcMain.handle(IPC_CHANNELS.NET_WORTH_CREATE_SNAPSHOT, async () => ({}));

  ipcMain.handle(IPC_CHANNELS.CATEGORY_RULES_LIST, async () => []);
  ipcMain.handle(IPC_CHANNELS.CATEGORY_RULES_CREATE, async () => ({}));
  ipcMain.handle(IPC_CHANNELS.CATEGORY_RULES_UPDATE, async () => ({}));
  ipcMain.handle(IPC_CHANNELS.CATEGORY_RULES_DELETE, async () => {});
}
