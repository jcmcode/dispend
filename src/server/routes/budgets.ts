import { Router } from 'express';
import * as budgetService from '../../main/services/budget.service';

const router = Router();

router.get('/', (_req, res) => {
  const budgets = budgetService.listBudgets();
  res.json(budgets);
});

router.get('/spending', (req, res) => {
  const period = req.query.period as string | undefined;
  const spending = budgetService.getBudgetSpending(period);
  res.json(spending);
});

router.get('/:id', (req, res) => {
  const budget = budgetService.getBudget(req.params.id);
  if (!budget) return res.status(404).json({ error: 'Budget not found' });
  res.json(budget);
});

router.post('/', (req, res) => {
  const budget = budgetService.createBudget(req.body);
  res.status(201).json(budget);
});

router.put('/:id', (req, res) => {
  const budget = budgetService.updateBudget({ ...req.body, id: req.params.id });
  res.json(budget);
});

router.delete('/:id', (req, res) => {
  budgetService.deleteBudget(req.params.id);
  res.status(204).end();
});

export default router;
