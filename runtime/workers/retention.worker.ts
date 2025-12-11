import { bus } from "../feac_bus";
import { checkCurrentOffer } from "../feac_dynamic_offers";
import { getBenefit } from "../feac_benefits";
import { createSubscription } from "../feac_subscriptions";
import { processRenewals } from "../feac_recurring_worker";

console.log("[WORKER] Retention Assembly Line Ready.");

bus.on("request:offer.check", (payload, responseId) => {
  const result = checkCurrentOffer(payload.userId);
  bus.emit(`response:${responseId}`, result);
});

bus.on("request:user.benefit", (payload, responseId) => {
  const result = getBenefit(payload.userId);
  bus.emit(`response:${responseId}`, result);
});

bus.on("request:sub.create", (payload, responseId) => {
  const result = createSubscription(payload.userId, payload.productId, payload.interval);
  bus.emit(`response:${responseId}`, result);
});

// Worker ini juga bisa dipicu oleh Sentinel
bus.on("trigger:renewals", async () => {
  await processRenewals();
});
