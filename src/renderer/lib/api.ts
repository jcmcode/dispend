import type { DispendAPI } from '@shared/types/api';

const BASE = '/api';

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function toQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const api: DispendAPI = {
  accounts: {
    list: () => request('/accounts'),
    get: (id) => request(`/accounts/${id}`),
    create: (input) => request('/accounts', { method: 'POST', body: JSON.stringify(input) }),
    update: (input) => request(`/accounts/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/accounts/${id}`, { method: 'DELETE' }),
  },

  transactions: {
    list: (filters = {}) => request(`/transactions${toQuery(filters as Record<string, unknown>)}`),
    get: (id) => request(`/transactions/${id}`),
    create: (input) => request('/transactions', { method: 'POST', body: JSON.stringify(input) }),
    update: (input) => request(`/transactions/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
    bulkDelete: (ids) => request('/transactions/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
  },

  categories: {
    list: () => request('/categories'),
    get: (id) => request(`/categories/${id}`),
    create: (input) => request('/categories', { method: 'POST', body: JSON.stringify(input) }),
    update: (input) => request(`/categories/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },

  budgets: {
    list: () => request('/budgets'),
    get: (id) => request(`/budgets/${id}`),
    create: (input) => request('/budgets', { method: 'POST', body: JSON.stringify(input) }),
    update: (input) => request(`/budgets/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),
    getSpending: (period?) => request(`/budgets/spending${period ? `?period=${period}` : ''}`),
  },

  import: {
    openFile: async () => null,
    parse: (_filePath, _accountId) => request('/import/parse', { method: 'POST', body: JSON.stringify({}) }),
    execute: (accountId, transactions, batchInfo) =>
      request('/import/execute', { method: 'POST', body: JSON.stringify({ accountId, transactions, batchInfo }) }),
    undo: (batchId) => request('/import/undo', { method: 'POST', body: JSON.stringify({ batchId }) }),
    listBatches: () => request('/import/batches'),
  },

  investments: {
    list: (accountId?) => request(`/investments${accountId ? `?accountId=${accountId}` : ''}`),
    get: (id) => request(`/investments/${id}`),
    create: (input) => request('/investments', { method: 'POST', body: JSON.stringify(input) }),
    update: (input) => request(`/investments/${input.id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/investments/${id}`, { method: 'DELETE' }),
  },

  insights: {
    getAll: () => request('/insights'),
    getAnomalies: () => request('/insights/anomalies'),
    getTrends: () => request('/insights/trends'),
    getRecurring: () => request('/insights/recurring'),
  },

  reports: {
    spendingByCategory: (startDate, endDate) =>
      request(`/reports/spending-by-category?startDate=${startDate}&endDate=${endDate}`),
    monthlySummary: (months) => request(`/reports/monthly-summary?months=${months}`),
    exportCsv: async () => { /* handled client-side in future */ },
  },

  netWorth: {
    getSnapshots: () => request('/reports/net-worth/snapshots'),
    createSnapshot: () => request('/reports/net-worth/snapshots', { method: 'POST' }),
  },

  categoryRules: {
    list: () => request('/reports/category-rules'),
    create: (input) => request('/reports/category-rules', { method: 'POST', body: JSON.stringify(input) }),
    update: (id, input) => request(`/reports/category-rules/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
    delete: (id) => request(`/reports/category-rules/${id}`, { method: 'DELETE' }),
  },

  app: {
    getTheme: async () => {
      return (localStorage.getItem('dispend-theme') as 'light' | 'dark' | 'system') || 'dark';
    },
    setTheme: async (theme) => {
      localStorage.setItem('dispend-theme', theme);
    },
    backup: async () => {
      const result = await request<{ path: string }>('/app/backup', { method: 'POST' });
      return result.path;
    },
  },
};
