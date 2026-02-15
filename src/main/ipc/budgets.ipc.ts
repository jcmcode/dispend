import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import * as budgetService from '../services/budget.service';

export function registerBudgetHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.BUDGETS_LIST, async () => {
    return budgetService.listBudgets();
  });

  ipcMain.handle(IPC_CHANNELS.BUDGETS_GET, async (_event, id: string) => {
    return budgetService.getBudget(id);
  });

  ipcMain.handle(IPC_CHANNELS.BUDGETS_CREATE, async (_event, input) => {
    return budgetService.createBudget(input);
  });

  ipcMain.handle(IPC_CHANNELS.BUDGETS_UPDATE, async (_event, input) => {
    return budgetService.updateBudget(input);
  });

  ipcMain.handle(IPC_CHANNELS.BUDGETS_DELETE, async (_event, id: string) => {
    return budgetService.deleteBudget(id);
  });

  ipcMain.handle(IPC_CHANNELS.BUDGETS_SPENDING, async (_event, period?: string) => {
    return budgetService.getBudgetSpending(period);
  });
}
