import * as fs from "fs";
import * as path from "path";

const SUB_PATH = path.join(process.env.HOME || ".", "feac_subscriptions_db.json");

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: "active" | "cancelled" | "past_due";
  interval: "monthly" | "yearly";
  nextBillingDate: number;
}

// EXPORTED NOW
export function loadDB(): Subscription[] {
  if (!fs.existsSync(SUB_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(SUB_PATH, "utf8")); } catch { return []; }
}

export function saveDB(data: Subscription[]) {
  fs.writeFileSync(SUB_PATH, JSON.stringify(data, null, 2));
}

export function createSubscription(userId: string, productId: string, interval: "monthly" | "yearly") {
  const db = loadDB();
  const intervalMs = interval === "monthly" ? 30000 : 360000; 

  const sub: Subscription = {
    id: "sub-" + Date.now().toString(36),
    userId,
    productId,
    status: "active",
    interval,
    nextBillingDate: Date.now() + intervalMs
  };

  db.push(sub);
  saveDB(db);
  return sub;
}

export function getDueSubscriptions() {
  const now = Date.now();
  return loadDB().filter(s => s.status === "active" && s.nextBillingDate <= now);
}

export function updateSubscriptionStatus(subId: string, status: "active" | "past_due") {
  const db = loadDB();
  const sub = db.find(s => s.id === subId);
  if (sub) {
    sub.status = status;
    saveDB(db);
  }
}
