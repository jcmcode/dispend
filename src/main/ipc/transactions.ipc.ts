import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import * as transactionService from '../services/transaction.service';

export function registerTransactionHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_LIST, async (_event, filters) => {
    return transactionService.listTransactions(filters);
  });

  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_GET, async (_event, id: string) => {
    return transactionService.getTransaction(id);
  });

  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_CREATE, async (_event, input) => {
    return transactionService.createTransaction(input);
  });

  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_UPDATE, async (_event, input) => {
    return transactionService.updateTransaction(input);
  });

  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_DELETE, async (_event, id: string) => {
    return transactionService.deleteTransaction(id);
  });

  ipcMain.handle(IPC_CHANNELS.TRANSACTIONS_BULK_DELETE, async (_event, ids: string[]) => {
    return transactionService.bulkDeleteTransactions(ids);
  });
}
