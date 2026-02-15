import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/channels';
import { registerAccountHandlers } from './accounts.ipc';
import { registerTransactionHandlers } from './transactions.ipc';
import { registerBudgetHandlers } from './budgets.ipc';
import { registerImportHandlers } from './import.ipc';
import { registerInvestmentHandlers } from './investments.ipc';
import { registerInsightHandlers } from './insights.ipc';
import { registerReportHandlers } from './reports.ipc';
import * as categoryService from '../services/category.service';

export function registerAllIpcHandlers(): void {
  registerAccountHandlers();
  registerTransactionHandlers();
  registerBudgetHandlers();
  registerImportHandlers();
  registerInvestmentHandlers();
  registerInsightHandlers();
  registerReportHandlers();

  // Category handlers (inline since they're simple)
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_LIST, async () => {
    return categoryService.listCategories();
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET, async (_event, id: string) => {
    return categoryService.getCategory(id);
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_CREATE, async (_event, input) => {
    return categoryService.createCategory(input);
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_UPDATE, async (_event, input) => {
    return categoryService.updateCategory(input);
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_DELETE, async (_event, id: string) => {
    return categoryService.deleteCategory(id);
  });

  // App handlers
  let currentTheme: 'light' | 'dark' | 'system' = 'dark';

  ipcMain.handle(IPC_CHANNELS.APP_GET_THEME, async () => {
    return currentTheme;
  });

  ipcMain.handle(IPC_CHANNELS.APP_SET_THEME, async (_event, theme: 'light' | 'dark' | 'system') => {
    currentTheme = theme;
  });

  ipcMain.handle(IPC_CHANNELS.APP_BACKUP, async () => {
    return 'backup-not-implemented';
  });
}
