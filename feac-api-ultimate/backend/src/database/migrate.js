const pool = require('../config/db');

const schema = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'developer',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  key_hash text NOT NULL,
  key_salt text NOT NULL,
  key_prefix text NOT NULL,
  label text,
  scopes text[],
  tier text DEFAULT 'free',
  quota_limit bigint DEFAULT 1000,
  quota_used bigint DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id bigserial PRIMARY KEY,
  key_id uuid REFERENCES api_keys(id),
  endpoint text,
  method text,
  status int,
  ip text,
  cost numeric DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_usage_key ON usage_logs(key_id);
`;

(async () => {
  try {
    await pool.query(schema);
    console.log('✅ DB Migration Complete');
    process.exit(0);
  } catch (e) {
    console.error('❌ DB Migration Failed', e);
    process.exit(1);
  }
})();
