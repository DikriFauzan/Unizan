/**
 * superkey/src/index.js
 * Minimal SuperKey service: proxies to emergent or returns stub.
 */
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const EMERGENT_URL = process.env.EMERGENT_URL || 'http://emergent:9001/solve';
const PORT = process.env.PORT || 9100;

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/api/v1/generate', async (req, res) => {
  const { prompt, depth = 3, producePdf = false } = req.body || {};
  try {
    // Primary implementation: proxy to emergent (local reasoning engine)
    const prox = await axios.post(EMERGENT_URL, { prompt, depth }, { timeout: 120000 });
    const data = prox.data || {};
    // emergent may already return pdf_url or pdf_base64
    return res.json({ output: data.output || ("[superkey-emergent-proxy] " + (prompt||'').slice(0,200)), pdf_base64: data.pdf_base64 || null, meta: data.meta || {} });
  } catch (e) {
    // Fallback lightweight reasoning stub
    const summary = `[SUPERKEY-STUB] depth=${depth} prompt="${(prompt||'').slice(0,200)}"`;
    const output = `${summary}\n\n[Note] Emergent unreachable; this is fallback response.`;
    return res.json({ output, meta: { fallback: true } });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', source: 'superkey' }));

app.listen(PORT, () => console.log(`SuperKey listening on ${PORT}`));
