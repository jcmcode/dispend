import { Router } from 'express';
import * as transactionService from '../../main/services/transaction.service';
import type { TransactionFilters } from '@shared/types';

const router = Router();

router.get('/', (req, res) => {
  const q = req.query;
  const filters: TransactionFilters = {};

  if (q.accountId) filters.accountId = q.accountId as string;
  if (q.categoryId) filters.categoryId = q.categoryId as string;
  if (q.type) filters.type = q.type as TransactionFilters['type'];
  if (q.status) filters.status = q.status as TransactionFilters['status'];
  if (q.startDate) filters.startDate = q.startDate as string;
  if (q.endDate) filters.endDate = q.endDate as string;
  if (q.search) filters.search = q.search as string;
  if (q.minAmount) filters.minAmount = Number(q.minAmount);
  if (q.maxAmount) filters.maxAmount = Number(q.maxAmount);
  if (q.limit) filters.limit = Number(q.limit);
  if (q.offset) filters.offset = Number(q.offset);

  const result = transactionService.listTransactions(filters);
  res.json(result);
});

router.get('/:id', (req, res) => {
  const txn = transactionService.getTransaction(req.params.id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });
  res.json(txn);
});

router.post('/', (req, res) => {
  const txn = transactionService.createTransaction(req.body);
  res.status(201).json(txn);
});

router.post('/bulk-delete', (req, res) => {
  transactionService.bulkDeleteTransactions(req.body.ids);
  res.status(204).end();
});

router.put('/:id', (req, res) => {
  const txn = transactionService.updateTransaction({ ...req.body, id: req.params.id });
  res.json(txn);
});

router.delete('/:id', (req, res) => {
  transactionService.deleteTransaction(req.params.id);
  res.status(204).end();
});

export default router;
