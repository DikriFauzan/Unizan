import fetch from "node-fetch";

const API_URL = "http://localhost:3000";
const USER_ID = "gamer_king_99";

async function post(endpoint: string, body: any) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e: any) { return { error: e.message }; }
}

async function main() {
  console.log(`\n🎮 STARTING FINAL SIMULATION (DOUBLE TIME JUMP)...\n`);

  // 1. SETUP & SUBSCRIBE
  await post("v1/store/create", { id: "vip_sub", name: "VIP Monthly", price: 500, type: "SUBSCRIPTION" });
  await post("v1/uci/execute", { cmd: "finance.deposit", payload: { userId: USER_ID, amount: 5000 } });
  await post("v1/uci/execute", { cmd: "sub.create", payload: { userId: USER_ID, productId: "vip_sub", interval: "monthly" } });
  console.log("✅ Subscribed.");

  // 2. JUMP 1: EXPIRE SUB
  console.log("⏩ JUMP 1: Expiring Subscription...");
  await post("v1/uci/execute", { cmd: "debug.timetravel", payload: { mode: "expire_sub" } });
  
  // 3. TRIGGER RENEWAL -> CREATE OFFER (STANDARD)
  console.log("⏳ Triggering Renewal Check...");
  await post("v1/uci/execute", { cmd: "sub.renew_all", payload: {} });
  
  // 4. JUMP 2: ADVANCE OFFER TO CRITICAL ZONE
  console.log("⏩ JUMP 2: Fast Forward 23h 58m (Entering Panic Zone)...");
  await post("v1/uci/execute", { cmd: "debug.timetravel", payload: { mode: "advance_offer" } });

  // 5. CHECK OFFER (EXPECT FLASH SALE)
  console.log("\n--- [USER] CHECKING SPECIAL OFFERS ---");
  const offer = await post("v1/uci/execute", { cmd: "offer.check", payload: { userId: USER_ID } });
  
  if (offer.status === "active") {
    console.log(`🔥 OFFER FOUND! Urgency: ${offer.urgencyLevel}`);
    console.log(`📢 Message: ${offer.message}`);
    console.log(`📉 Discount: Yearly ${offer.offers?.yearly.save}`);
    console.log(`⏱️ Time Left: ${Math.floor(offer.timeLeftMs / 1000)}s`);
    
    if (offer.urgencyLevel === "FLASH_SALE") {
      console.log("\n🎉 CONGRATULATIONS! FLASH SALE LOGIC IS 100% WORKING!");
      console.log("   Psychological Engine is successfully manipulating user FOMO.");
    } else {
      console.log("🤔 Still Normal? Try adjusting time jump logic.");
    }
  } else {
    console.log(`❌ No Offer. Status: ${offer.status}`);
  }

  console.log("\n🎮 SIMULATION COMPLETE.");
}
main();
