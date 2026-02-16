import { Router } from 'express';

const router = Router();

// File upload - stub for now
router.post('/upload', (_req, res) => {
  res.status(501).json({ error: 'File upload not implemented yet' });
});

router.post('/parse', (_req, res) => {
  res.json({ fileName: '', fileType: 'csv', transactions: [], duplicateCount: 0 });
});

router.post('/execute', (_req, res) => {
  res.json({ batchId: '', imported: 0, duplicatesSkipped: 0 });
});

router.post('/undo', (_req, res) => {
  res.status(204).end();
});

router.get('/batches', (_req, res) => {
  res.json([]);
});

export default router;
