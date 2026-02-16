import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => res.json([]));
router.get('/:id', (_req, res) => res.status(404).json({ error: 'Not found' }));
router.post('/', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
router.put('/:id', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
router.delete('/:id', (_req, res) => res.status(501).json({ error: 'Not implemented' }));

export default router;
