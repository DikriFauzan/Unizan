const express = require('express');
const router = express.Router();
const buildController = require('../controllers/buildController');
// Note: apiKeyGuard middleware must be applied in top-level router when mounting this file
router.post('/build/trigger', buildController.triggerBuild);
module.exports = router;
