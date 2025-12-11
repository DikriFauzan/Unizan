import * as fs from "fs";
import * as path from "path";
import { applyBenefit } from "./feac_benefits";

const OFFER_PATH = path.join(process.env.HOME || ".", "feac_retention_offers.json");

interface Offer {
  userId: string;
  createdAt: number;
  expiresAt: number;
  status: "active" | "expired" | "accepted";
}

function loadDB(): Offer[] {
  if (!fs.existsSync(OFFER_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(OFFER_PATH, "utf8")); } catch { return []; }
}

function saveDB(data: Offer[]) {
  fs.writeFileSync(OFFER_PATH, JSON.stringify(data, null, 2));
}

export function createRetentionOffer(userId: string) {
  const db = loadDB();
  const existing = db.find(o => o.userId === userId && o.status === "active");
  if (existing) return existing;

  // SIMULASI WAKTU:
  // 24 Jam Real = 240 Detik (4 Menit) Simulasi
  // 2 Jam Real  = 20 Detik Simulasi
  // 15 Menit Real = 2.5 Detik Simulasi (Kita bulatkan jadi 5 Detik agar terlihat)
  
  const duration = 240 * 1000; 

  const offer: Offer = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + duration,
    status: "active"
  };

  db.push(offer);
  saveDB(db);
  return offer;
}

export function checkCurrentOffer(userId: string) {
  const db = loadDB();
  const offer = db.find(o => o.userId === userId && o.status === "active");
  
  if (!offer) return { status: "no_offer" };

  const now = Date.now();
  const timeLeft = offer.expiresAt - now;

  if (timeLeft <= 0) {
    offer.status = "expired";
    saveDB(db);
    return { status: "expired" };
  }

  // --- LOGIKA PSIKOLOGI RARITY ---
  // Threshold 2 Jam Terakhir (Simulasi: 20 detik)
  const twoHourZoneMs = 20000; 
  // Durasi Flash Sale 15 Menit (Simulasi: 5 detik setelah masuk zona 2 jam)
  const flashDurationMs = 5000; 

  let yearlyDiscount = 0.20; // Default Standard
  let monthlyDiscount = 0.0; // Default Standard
  let urgency = "NORMAL";
  let msg = "Standard retention offer";

  // Apakah kita masuk zona 2 jam terakhir?
  if (timeLeft <= twoHourZoneMs) {
    // Hitung sudah berapa lama kita di dalam zona ini
    // (Semakin kecil timeLeft, semakin lama kita di zona)
    const timeInZone = twoHourZoneMs - timeLeft;

    if (timeInZone <= flashDurationMs) {
      // --- FLASH SALE WINDOW (15 MENIT PERTAMA) ---
      yearlyDiscount = 0.40;  // Diskon Besar
      monthlyDiscount = 0.20; // Diskon Lumayan
      urgency = "FLASH_SALE";
      msg = "🔥 FLASH SALE ACTIVATED! 15 MINS ONLY!";
    } else {
      // --- MISSED OPPORTUNITY (LEWAT 15 MENIT) ---
      // Harga KEMBALI NORMAL. User dihukum karena telat.
      yearlyDiscount = 0.20; 
      monthlyDiscount = 0.0;
      urgency = "MISSED";
      msg = "Flash sale missed. Back to standard price.";
    }
  }

  return {
    status: "active",
    timeLeftMs: timeLeft,
    urgencyLevel: urgency,
    message: msg,
    offers: {
      yearly: { discount: yearlyDiscount, save: (yearlyDiscount * 100) + "%" },
      monthly: { discount: monthlyDiscount, save: (monthlyDiscount * 100) + "%" }
    }
  };
}
