import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';

// Stub handlers for Phase 5
export function registerInvestmentHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.INVESTMENTS_LIST, async () => []);
  ipcMain.handle(IPC_CHANNELS.INVESTMENTS_GET, async () => null);
  ipcMain.handle(IPC_CHANNELS.INVESTMENTS_CREATE, async () => ({}));
  ipcMain.handle(IPC_CHANNELS.INVESTMENTS_UPDATE, async () => ({}));
  ipcMain.handle(IPC_CHANNELS.INVESTMENTS_DELETE, async () => {});
}
