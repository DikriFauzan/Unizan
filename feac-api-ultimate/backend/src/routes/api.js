const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const keys = require('../controllers/keyController');
const billing = require('../controllers/billingController');
const guard = require('../middleware/apiKeyGuard');

// ... (Existing Auth & Keys routes) ...
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/keys', keys.createKey);
router.get('/apps/:appId/keys', keys.listKeys);

// BILLING ROUTES
router.post('/billing/checkout', billing.createCheckoutSession);

// WEBHOOK (Must be raw body parser in real app, simplified here)
// Note: In server.js, ensure raw body parser is used for this route specifically
router.post('/billing/webhook', express.raw({type: 'application/json'}), billing.handleWebhook);

module.exports = router;
