const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.METRICS_PORT || 9200;
const BACKEND = process.env.BACKEND_URL || 'http://feac-api:8000';
const SUPERKEY = process.env.SUPERKEY_URL || 'http://superkey:9100';
const EMERGENT = process.env.EMERGENT_URL || 'http://emergent:9001';

async function check(url, path='/health') {
  try {
    const r = await fetch(url.replace(/\/$/, '') + path, { timeout: 3000 });
    return r.ok;
  } catch (e) { return false; }
}

app.get('/metrics', async (req, res) => {
  const backendUp = await check(BACKEND, '/');
  const skUp = await check(SUPERKEY, '/health');
  const emergentUp = await check(EMERGENT, '/health');
  const now = Date.now();
  res.json({
    timestamp: now,
    services: {
      backend: backendUp,
      superkey: skUp,
      emergent: emergentUp
    }
  });
});

app.listen(PORT, () => console.log(`metrics-exporter listening on ${PORT}`));
