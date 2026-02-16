import { Router } from 'express';
import { createBackup } from '../../main/utils/backup';

const router = Router();

router.post('/backup', (_req, res) => {
  try {
    const backupPath = createBackup();
    res.json({ path: backupPath });
  } catch (err) {
    res.status(500).json({ error: 'Backup failed' });
  }
});

export default router;
