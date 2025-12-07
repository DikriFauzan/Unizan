const pool = require('../config/db');

const schema = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_tier text DEFAULT 'free', -- free, pro, enterprise
  status text DEFAULT 'active', -- active, past_due, canceled
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  stripe_invoice_id text,
  amount_paid numeric,
  currency text DEFAULT 'usd',
  status text, -- paid, open, void
  created_at timestamptz DEFAULT now()
);

-- Link API Keys to Subscription limits
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS subscription_id uuid REFERENCES subscriptions(id);
`;

(async () => {
  try {
    await pool.query(schema);
    console.log('✅ Billing Schema Migration Complete');
    process.exit(0);
  } catch (e) {
    console.error('❌ Billing Migration Failed', e);
    process.exit(1);
  }
})();
