import express from 'express';
import { superkeyStatus, superkeyGenerate } from '../controllers/superkeyController';
import { apiKeyGuard } from '../middleware/apiKeyGuard';

const router = express.Router();

// Only owner / admin should call these, apiKeyGuard will mark owner bypass
router.get('/admin/superkey/status', apiKeyGuard, superkeyStatus);
router.post('/admin/superkey/generate', apiKeyGuard, superkeyGenerate);

export default router;
