import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';

// Stub handlers for Phase 6
export function registerInsightHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.INSIGHTS_GET, async () => []);
  ipcMain.handle(IPC_CHANNELS.INSIGHTS_ANOMALIES, async () => []);
  ipcMain.handle(IPC_CHANNELS.INSIGHTS_TRENDS, async () => []);
  ipcMain.handle(IPC_CHANNELS.INSIGHTS_RECURRING, async () => []);
}
