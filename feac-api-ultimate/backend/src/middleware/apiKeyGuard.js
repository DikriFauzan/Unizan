const pool = require('../config/db');
const redis = require('../config/redis');
const crypto = require('crypto');

module.exports = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ error: 'Missing API Key' });

  // 1. SUPERUSER
  if (key === process.env.FEAC_INTERNAL_KEY) {
      req.keyInfo = { id: "feac-core", tier: "unlimited", role: "superuser" };
      return next();
  }

  // 2. COMMERCIAL
  // Token Format: feac_live_<public_id>_<secret>
  const parts = key.split('_');
  if (parts.length < 4) return res.status(403).json({ error: 'Invalid Key Format' });
  
  const publicId = parts[2]; // The UUID or ID part
  
  // Cache Check
  const cacheKey = `apikey:${publicId}`;
  const cached = await redis.get(cacheKey);
  
  let keyData;
  
  if (cached) {
      keyData = JSON.parse(cached);
  } else {
      // DB Lookup by Public ID (stored in key_prefix or separate column)
      // We stored `key_prefix` as first 10 chars. Let's rely on that for now or assume ID lookup.
      // Ideally schema has `public_id`.
      
      // Fallback: Query by prefix match (slow but works for now)
      // BETTER: We'll modify the generator to store public_id.
      // For this script, we'll just fail safe.
      return res.status(403).json({ error: 'Key not found (Cache Miss)' });
  }
  
  // Rate Limit
  const usageKey = `usage:${keyData.id}:min`;
  const currentUsage = await redis.incr(usageKey);
  if (currentUsage === 1) await redis.expire(usageKey, 60);
  
  if (currentUsage > (keyData.quota_limit / 30 / 24 / 60)) { // Approx minute limit
      return res.status(429).json({ error: 'Rate Limit' });
  }
  
  req.keyInfo = keyData;
  
  // Log Usage (Async)
  pool.query('INSERT INTO usage_logs (key_id, endpoint, method, ip) VALUES ($1, $2, $3, $4)', 
    [keyData.id, req.path, req.method, req.ip]).catch(console.error);

  next();
};
