import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/channels';
import type { DispendAPI } from '../shared/types/api';

export const api: DispendAPI = {
  accounts: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNTS_LIST),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNTS_GET, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNTS_CREATE, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNTS_UPDATE, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.ACCOUNTS_DELETE, id),
  },

  transactions: {
    list: (filters) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_LIST, filters),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_GET, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_CREATE, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_UPDATE, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_DELETE, id),
    bulkDelete: (ids) => ipcRenderer.invoke(IPC_CHANNELS.TRANSACTIONS_BULK_DELETE, ids),
  },

  categories: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_LIST),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_GET, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_CREATE, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_UPDATE, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORIES_DELETE, id),
  },

  budgets: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_LIST),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_GET, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_CREATE, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_UPDATE, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_DELETE, id),
    getSpending: (period) => ipcRenderer.invoke(IPC_CHANNELS.BUDGETS_SPENDING, period),
  },

  import: {
    openFile: () => ipcRenderer.invoke(IPC_CHANNELS.IMPORT_OPEN_FILE),
    parse: (filePath, accountId) =>
      ipcRenderer.invoke(IPC_CHANNELS.IMPORT_PARSE, filePath, accountId),
    execute: (accountId, transactions, batchInfo) =>
      ipcRenderer.invoke(IPC_CHANNELS.IMPORT_EXECUTE, accountId, transactions, batchInfo),
    undo: (batchId) => ipcRenderer.invoke(IPC_CHANNELS.IMPORT_UNDO, batchId),
    listBatches: () => ipcRenderer.invoke(IPC_CHANNELS.IMPORT_BATCHES),
  },

  investments: {
    list: (accountId) => ipcRenderer.invoke(IPC_CHANNELS.INVESTMENTS_LIST, accountId),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.INVESTMENTS_GET, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.INVESTMENTS_CREATE, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.INVESTMENTS_UPDATE, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.INVESTMENTS_DELETE, id),
  },

  insights: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.INSIGHTS_GET),
    getAnomalies: () => ipcRenderer.invoke(IPC_CHANNELS.INSIGHTS_ANOMALIES),
    getTrends: () => ipcRenderer.invoke(IPC_CHANNELS.INSIGHTS_TRENDS),
    getRecurring: () => ipcRenderer.invoke(IPC_CHANNELS.INSIGHTS_RECURRING),
  },

  reports: {
    spendingByCategory: (startDate, endDate) =>
      ipcRenderer.invoke(IPC_CHANNELS.REPORTS_SPENDING_BY_CATEGORY, startDate, endDate),
    monthlySummary: (months) =>
      ipcRenderer.invoke(IPC_CHANNELS.REPORTS_MONTHLY_SUMMARY, months),
    exportCsv: (data, fileName) =>
      ipcRenderer.invoke(IPC_CHANNELS.REPORTS_EXPORT_CSV, data, fileName),
  },

  netWorth: {
    getSnapshots: () => ipcRenderer.invoke(IPC_CHANNELS.NET_WORTH_SNAPSHOTS),
    createSnapshot: () => ipcRenderer.invoke(IPC_CHANNELS.NET_WORTH_CREATE_SNAPSHOT),
  },

  categoryRules: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.CATEGORY_RULES_LIST),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORY_RULES_CREATE, input),
    update: (id, input) =>
      ipcRenderer.invoke(IPC_CHANNELS.CATEGORY_RULES_UPDATE, id, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.CATEGORY_RULES_DELETE, id),
  },

  app: {
    getTheme: () => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_THEME),
    setTheme: (theme) => ipcRenderer.invoke(IPC_CHANNELS.APP_SET_THEME, theme),
    backup: () => ipcRenderer.invoke(IPC_CHANNELS.APP_BACKUP),
  },
};
