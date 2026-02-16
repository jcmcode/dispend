import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { getDb, closeDb } from '../main/db/connection';
import { runMigrations } from '../main/db/migrate';
import { seedCategories } from '../main/db/seed';

import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import budgetRoutes from './routes/budgets';
import investmentRoutes from './routes/investments';
import insightRoutes from './routes/insights';
import reportRoutes from './routes/reports';
import importRoutes from './routes/import';
import appRoutes from './routes/app';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Init DB
getDb();
runMigrations();
seedCategories();
console.log('Database initialized');

// API routes
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/import', importRoutes);
app.use('/api/app', appRoutes);

// Production: serve static SPA files
if (process.env.NODE_ENV === 'production') {
  const clientDir = path.resolve(process.cwd(), 'dist', 'client');
  app.use(express.static(clientDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  closeDb();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  server.close();
  process.exit(0);
});
