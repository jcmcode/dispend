import { Router } from 'express';

const router = Router();

router.get('/spending-by-category', (_req, res) => res.json([]));
router.get('/monthly-summary', (_req, res) => res.json([]));
router.post('/export-csv', (_req, res) => res.status(501).json({ error: 'Not implemented' }));

// Net Worth sub-routes
router.get('/net-worth/snapshots', (_req, res) => res.json([]));
router.post('/net-worth/snapshots', (_req, res) => res.status(501).json({ error: 'Not implemented' }));

// Category Rules sub-routes
router.get('/category-rules', (_req, res) => res.json([]));
router.post('/category-rules', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
router.put('/category-rules/:id', (_req, res) => res.status(501).json({ error: 'Not implemented' }));
router.delete('/category-rules/:id', (_req, res) => res.status(501).json({ error: 'Not implemented' }));

export default router;
