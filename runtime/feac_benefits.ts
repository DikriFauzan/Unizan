import * as fs from "fs";
import * as path from "path";

const BENEFIT_PATH = path.join(process.env.HOME || ".", "feac_user_benefits.json");

export interface UserBenefit {
  userId: string;
  adMultiplier: number;
  bonusExpiresAt: number;
  activePlanTier?: string;
}

function loadDB(): Record<string, UserBenefit> {
  if (!fs.existsSync(BENEFIT_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(BENEFIT_PATH, "utf8")); } catch { return {}; }
}

function saveDB(data: Record<string, UserBenefit>) {
  fs.writeFileSync(BENEFIT_PATH, JSON.stringify(data, null, 2));
}

// FIX: Parameter ke-4 (planTier) dibuat optional
export function applyBenefit(userId: string, multiplier: number, durationDays: number, planTier?: string) {
  const db = loadDB();
  const durationMs = durationDays * 60 * 1000; // Simulasi 1 hari = 1 menit
  
  db[userId] = {
    userId,
    adMultiplier: multiplier,
    bonusExpiresAt: Date.now() + durationMs,
    activePlanTier: planTier || db[userId]?.activePlanTier
  };
  saveDB(db);
  return db[userId];
}

export function getBenefit(userId: string) {
  const db = loadDB();
  const user = db[userId];
  if (!user) return { adMultiplier: 1.0 };

  if (Date.now() > user.bonusExpiresAt) {
    user.adMultiplier = 1.0; 
    saveDB(db);
  }
  return user;
}
