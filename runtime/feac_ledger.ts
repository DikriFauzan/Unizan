import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const LEDGER_PATH = path.join(process.env.HOME || ".", "feac_financial_ledger.json");

export interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PURCHASE" | "REFUND";
  amount: number;
  currency: "USD" | "IDR" | "CREDIT";
  userId: string;
  description: string;
  timestamp: number;
  hash: string; // Cryptographic Proof
}

function loadLedger(): Transaction[] {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8")); } catch { return []; }
}

function saveLedger(data: Transaction[]) {
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2));
}

// MENCATAT TRANSAKSI BARU
export function recordTransaction(
  type: "DEPOSIT" | "WITHDRAWAL" | "PURCHASE" | "REFUND",
  amount: number,
  userId: string,
  desc: string
) {
  const ledger = loadLedger();
  
  // Buat Hash dari transaksi sebelumnya untuk rantai keamanan (Blockchain style simple)
  const prevHash = ledger.length > 0 ? ledger[ledger.length - 1].hash : "GENESIS";
  
  const rawData = `${prevHash}-${type}-${amount}-${userId}-${Date.now()}`;
  const hash = crypto.createHash("sha256").update(rawData).digest("hex");

  const tx: Transaction = {
    id: "tx-" + crypto.randomUUID(),
    type,
    amount,
    currency: "USD", // Default currency for now
    userId,
    description: desc,
    timestamp: Date.now(),
    hash
  };

  ledger.push(tx);
  saveLedger(ledger);
  
  return { status: "recorded", txId: tx.id, hash: tx.hash };
}

// CEK SALDO USER
export function getBalance(userId: string) {
  const ledger = loadLedger();
  let balance = 0;
  
  for (const tx of ledger) {
    if (tx.userId === userId) {
      if (tx.type === "DEPOSIT" || tx.type === "REFUND") {
        balance += tx.amount;
      } else {
        balance -= tx.amount;
      }
    }
  }
  return balance;
}

// AUDIT TRAIL (Untuk Agent)
export function getRecentTransactions(limit = 50) {
  const ledger = loadLedger();
  return ledger.slice(-limit);
}
