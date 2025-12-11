import { applyBenefit } from "./feac_benefits";
import { learn } from "./feac_cortex";

export function triggerChurnPrevention(userId: string, subId: string) {
  console.log(`[RETENTION] User ${userId} churn risk. Activating Safety Net.`);

  // Rekam event agar offer engine tahu kapan start
  learn("churn_start", { userId, subId, timestamp: Date.now() }, ["churn"]);

  // Safety Net: Ad Reward +30% selama 7 hari (tanpa planTier)
  applyBenefit(userId, 1.3, 7); 
  
  return { 
    status: "offer_active", 
    msg: "24H Timer Started. Check offers."
  };
}

export function triggerWinBack(userId: string, planTier: string) {
  console.log(`[RETENTION] User ${userId} returned! Stacking benefits.`);

  let baseMult = 1.1; 
  if (planTier === "gold") baseMult = 1.5;
  if (planTier === "silver") baseMult = 1.2;

  const totalMult = baseMult + 0.3;

  // FIX: Memanggil dengan 4 argumen sekarang aman
  applyBenefit(userId, totalMult, 7, planTier);

  learn("winback_success", { userId, plan: planTier }, ["revenue", "retention"]);
  return { status: "benefits_stacked", currentMultiplier: totalMult };
}
