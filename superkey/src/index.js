/**
 * SuperKey Sovereign AI Microservice
 * - Minimal HTTP API for 'generate' and 'status'
 * - Configurable to call local emergent or external providers
 * - No secrets hardcoded; use env
 */
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.SUPERKEY_PORT || 9100;
const OWNER_KEY = process.env.FEAC_INTERNAL_KEY || 'FEAC-SVR-PLACEHOLDER';
const MODE = process.env.SUPERKEY_MODE || 'local'; // local | proxy

// simple in-memory small memory for vault usage
let vault = { facts: [], strategies: [] };

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: MODE, vaultCount: vault.facts.length });
});

/**
 * /generate
 * body: { key, prompt, modeHint }
 * Behavior:
 *  - if MODE=proxy and SUPERKEY_PROXY_URL set -> proxy to external LLM
 *  - if MODE=local -> run deterministic emergent-like simulation
 */
app.post('/generate', async (req, res) => {
  try {
    const { key, prompt, modeHint } = req.body;
    // simple auth: owner key gives elevated behavior
    const isOwner = key && key === OWNER_KEY;

    if (MODE === 'proxy' && process.env.SUPERKEY_PROXY_URL) {
      // forward request to configured proxy (user responsible)
      const proxyUrl = process.env.SUPERKEY_PROXY_URL;
      const r = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modeHint, isOwner })
      });
      const data = await r.json();
      return res.json({ provider: 'proxy', data });
    }

    // LOCAL deterministic emergent-style result (fast, offline)
    // Depth adapt: owner gets deeper reasoning
    const depth = isOwner ? 8 : (modeHint === 'long' ? 6 : 3);
    const lines = [];
    lines.push(`[SUPERKEY] Mode: ${MODE} | Depth: ${depth}`);
    lines.push(`Prompt: ${prompt}`);
    for (let i=0;i<depth;i++){
      lines.push(`[L${i+1}] Hypothesis ${i+1}: analysis hash ${require('crypto').createHash('sha256').update(prompt+i).digest('hex').slice(0,8)}`);
    }
    const output = lines.join('\n');
    // optionally save facts to vault (not exposing api for write here)
    if (isOwner && prompt && prompt.length < 2000) vault.facts.push(prompt);
    return res.json({ provider: 'superkey-local', output, depth, isOwner });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`SuperKey running on port ${PORT} (MODE=${process.env.SUPERKEY_MODE || 'local'})`);
});
