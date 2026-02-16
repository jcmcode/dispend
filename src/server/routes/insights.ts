import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => res.json([]));
router.get('/anomalies', (_req, res) => res.json([]));
router.get('/trends', (_req, res) => res.json([]));
router.get('/recurring', (_req, res) => res.json([]));

export default router;
