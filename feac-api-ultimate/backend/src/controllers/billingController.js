const pool = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. Create Checkout Session (User wants to upgrade)
exports.createCheckoutSession = async (req, res) => {
  const { plan, userId } = req.body; // plan: 'price_123...'
  
  try {
    // Get or Create Stripe Customer
    let r = await pool.query('SELECT stripe_customer_id FROM subscriptions WHERE user_id=$1', [userId]);
    let customerId = r.rows[0]?.stripe_customer_id;

    if (!customerId) {
       // Mock getting user email
       const u = await pool.query('SELECT email FROM users WHERE id=$1', [userId]);
       const customer = await stripe.customers.create({ email: u.rows[0].email });
       customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
      metadata: { userId: userId, planTier: 'pro' } 
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Checkout Failed' });
  }
};

// 2. Stripe Webhook Handler (The Brain of Automation)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle Event Types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSubscriptionSuccess(session);
      break;
    case 'invoice.payment_succeeded':
      // Renew quota logic here
      break;
    case 'customer.subscription.deleted':
      // Downgrade logic here
      break;
  }

  res.json({received: true});
};

async function handleSubscriptionSuccess(session) {
    const userId = session.metadata.userId;
    const tier = session.metadata.planTier;
    const customerId = session.customer;
    const subId = session.subscription;

    // Update DB
    await pool.query(`
      INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan_tier, status)
      VALUES ($1, $2, $3, $4, 'active')
      ON CONFLICT (user_id) DO UPDATE 
      SET plan_tier=$4, status='active', stripe_subscription_id=$3
    `, [userId, customerId, subId, tier]);

    // Auto-Upgrade API Keys
    // If user has keys, bump their quota
    await pool.query(`
      UPDATE api_keys SET tier=$1, quota_limit=100000 
      WHERE app_id IN (SELECT id FROM apps WHERE user_id=$2)
    `, [tier, userId]);
    
    console.log(`✅ User ${userId} upgraded to ${tier}`);
}
