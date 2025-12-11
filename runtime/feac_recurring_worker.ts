import { getDueSubscriptions, updateSubscriptionStatus } from "./feac_subscriptions";
import { createRetentionOffer } from "./feac_dynamic_offers";
import { learn } from "./feac_cortex";

export async function processRenewals() {
  const due = getDueSubscriptions();
  if (due.length === 0) return { processed: 0 };

  console.log(`[SUBSCRIPTION] Found ${due.length} expired. Generating Psychological Offers...`);
  const results = [];

  for (const sub of due) {
    // 1. Matikan Langganan Lama
    updateSubscriptionStatus(sub.id, "past_due");
    
    // 2. Buat Offer 24 Jam
    createRetentionOffer(sub.userId);

    results.push({ subId: sub.id, status: "offer_generated" });
    learn("sub_expired_offer_sent", { user: sub.userId }, ["churn_prevention"]);
  }

  return { processed: due.length, details: results };
}
