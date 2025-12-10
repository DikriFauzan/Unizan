import express from 'express';
import { getStatus, setToggle } from '../controllers/superkeyAdminController';
import { apiKeyGuard } from '../middleware/apiKeyGuard';
const router = express.Router();

router.get('/admin/superkey/status', apiKeyGuard, getStatus);
router.post('/admin/superkey/toggle', apiKeyGuard, setToggle);

export default router;
