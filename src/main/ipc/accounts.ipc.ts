import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import * as accountService from '../services/account.service';

export function registerAccountHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.ACCOUNTS_LIST, async () => {
    return accountService.listAccounts();
  });

  ipcMain.handle(IPC_CHANNELS.ACCOUNTS_GET, async (_event, id: string) => {
    return accountService.getAccount(id);
  });

  ipcMain.handle(IPC_CHANNELS.ACCOUNTS_CREATE, async (_event, input) => {
    return accountService.createAccount(input);
  });

  ipcMain.handle(IPC_CHANNELS.ACCOUNTS_UPDATE, async (_event, input) => {
    return accountService.updateAccount(input);
  });

  ipcMain.handle(IPC_CHANNELS.ACCOUNTS_DELETE, async (_event, id: string) => {
    return accountService.deleteAccount(id);
  });
}
