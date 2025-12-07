const crypto = require('crypto');

const generateKey = () => {
  const prefix = 'feac_live_';
  const buffer = crypto.randomBytes(32);
  const token = buffer.toString('base64url');
  return `${prefix}${token}`;
};

const hashKey = (key, salt) => {
  const secret = process.env.API_KEY_SECRET;
  return crypto.createHmac('sha256', secret + salt).update(key).digest('hex');
};

const generateSalt = () => crypto.randomBytes(16).toString('hex');

module.exports = { generateKey, hashKey, generateSalt };
