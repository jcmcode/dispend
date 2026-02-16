import { Router } from 'express';
import * as accountService from '../../main/services/account.service';

const router = Router();

router.get('/', (_req, res) => {
  const accounts = accountService.listAccounts();
  res.json(accounts);
});

router.get('/:id', (req, res) => {
  const account = accountService.getAccount(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  res.json(account);
});

router.post('/', (req, res) => {
  const account = accountService.createAccount(req.body);
  res.status(201).json(account);
});

router.put('/:id', (req, res) => {
  const account = accountService.updateAccount({ ...req.body, id: req.params.id });
  res.json(account);
});

router.delete('/:id', (req, res) => {
  accountService.deleteAccount(req.params.id);
  res.status(204).end();
});

export default router;
