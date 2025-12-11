import { createSubscription, getDueSubscriptions } from "./feac_subscriptions";
import { processRenewals } from "./feac_recurring_worker";
import { checkCurrentOffer } from "./feac_dynamic_offers";
import { getBenefit } from "./feac_benefits";

export async function subscriptionRoute(cmd: string, payload: any) {
  switch (cmd) {
    // Create & Renew Logic
    case "sub.create":
      if (!payload?.userId || !payload?.productId) return { error: "missing data" };
      return { status: "created", sub: createSubscription(payload.userId, payload.productId, payload.interval || "monthly") };
    
    case "sub.renew_all":
      return await processRenewals();

    // Client Side Checks
    case "offer.check": // Game Client hit ini setiap buka menu shop
      if (!payload?.userId) return { error: "missing userId" };
      return checkCurrentOffer(payload.userId);

    case "user.benefit": // Cek reward iklan
      if (!payload?.userId) return { error: "missing userId" };
      return getBenefit(payload.userId);

    default: return null;
  }
}
