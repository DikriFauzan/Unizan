const pool = require('../config/db');
const redis = require('../config/redis');
const { generateKey, hashKey, generateSalt } = require('../utils/keyGenerator');
const { v4: uuidv4 } = require('uuid');

exports.createKey = async (req, res) => {
  const { appId, label, tier } = req.body;
  const publicId = uuidv4().split('-')[0]; // Short ID
  const secret = generateKey(); // The actual secret part
  const fullKey = `feac_live_${publicId}_${secret}`;
  
  const salt = generateSalt();
  const hashed = hashKey(fullKey, salt);

  try {
    const r = await pool.query(
      `INSERT INTO api_keys (app_id, key_hash, key_salt, key_prefix, label, tier, quota_limit) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [appId, hashed, salt, publicId, label, tier || 'free', tier === 'pro' ? 100000 : 1000]
    );
    
    // Cache immediately
    const keyData = r.rows[0];
    await redis.set(`apikey:${publicId}`, JSON.stringify(keyData), { EX: 3600 }); // 1 hour cache
    
    res.json({ ...keyData, key: fullKey }); // Show Full Key ONCE
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.listKeys = async (req, res) => {
  const { appId } = req.params;
  const r = await pool.query('SELECT id, label, key_prefix, tier, is_active, created_at FROM api_keys WHERE app_id=$1', [appId]);
  res.json(r.rows);
};
