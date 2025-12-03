const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController'); // Assume exist from prev step
const keys = require('../controllers/keyController');
const guard = require('../middleware/apiKeyGuard');

// Public
router.get('/health', (req, res) => res.json({status: 'ok'}));

// Protected (Internal/Commercial)
router.get('/protected/stats', guard, (req, res) => {
    res.json({ 
        msg: 'Secure Data', 
        user: req.keyInfo.role, 
        tier: req.keyInfo.tier 
    });
});

// Management (Should be protected by JWT, open for dev)
router.post('/keys', keys.createKey);
router.get('/apps/:appId/keys', keys.listKeys);

module.exports = router;
