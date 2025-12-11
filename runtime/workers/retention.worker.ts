import { bus } from "../feac_bus";
import { checkCurrentOffer } from "../feac_dynamic_offers";
import { getBenefit } from "../feac_benefits";
import { createSubscription, loadDB as loadSubDB, saveDB as saveSubDB } from "../feac_subscriptions";
import { processRenewals } from "../feac_recurring_worker";
import * as fs from "fs";
import * as path from "path";

const OFFER_PATH = path.join(process.env.HOME || ".", "feac_retention_offers.json");

console.log("[WORKER] Retention Assembly Line Ready (Precision Debug).");

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

bus.on("request:sub.renew_all", async (payload, responseId) => {
  const result = await processRenewals();
  if (responseId) bus.emit(`response:${responseId}`, result);
});

bus.on("request:debug.timetravel", (payload, responseId) => {
  const mode = payload.mode || "expire_sub";

  if (mode === "expire_sub") {
    const db = loadSubDB();
    let count = 0;
    db.forEach(sub => {
      if (sub.status === "active") {
        sub.nextBillingDate = Date.now() - 3600000; 
        count++;
      }
    });
    saveSubDB(db);
    bus.emit(`response:${responseId}`, { status: "ok", mode: "expire_sub", modified: count });
  } 
  
  else if (mode === "advance_offer") {
    if (!fs.existsSync(OFFER_PATH)) {
       bus.emit(`response:${responseId}`, { status: "error", msg: "no offers db" });
       return;
    }
    const offers = JSON.parse(fs.readFileSync(OFFER_PATH, "utf8"));
    let count = 0;
    
    // FIX LOGIC:
    // Flash Sale Active: timeLeft <= 20000 AND timeLeft > (20000 - 5000) = 15000
    // Target Landing: timeLeft = 18000 (18 detik)
    
    const targetTimeLeft = 18000; 

    offers.forEach((o: any) => {
      if (o.status === "active") {
        o.expiresAt = Date.now() + targetTimeLeft; 
        count++;
      }
    });
    
    fs.writeFileSync(OFFER_PATH, JSON.stringify(offers, null, 2));
    bus.emit(`response:${responseId}`, { status: "ok", mode: "advance_offer", modified: count, target: "18s left" });
  }
});
