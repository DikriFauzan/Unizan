import { BaseAgent } from "./feac_agent_base";
import { getRecentTransactions, Transaction } from "./feac_ledger";
import { submitProposal } from "./feac_proposal";
import { learn } from "./feac_cortex";

export class FinancialAgent extends BaseAgent {
  private checkedTxIds: Set<string> = new Set();

  constructor() {
    super("Financial-Auditor", 15000); // Audit tiap 15 detik
  }

  async tick() {
    const recents = getRecentTransactions(20);
    
    // Group transactions by User untuk deteksi Spam/Fraud
    const userActivity: Record<string, number> = {};

    for (const tx of recents) {
      if (this.checkedTxIds.has(tx.id)) continue;
      this.checkedTxIds.add(tx.id);

      // 1. ANALISA POLA TRANSAKSI
      userActivity[tx.userId] = (userActivity[tx.userId] || 0) + 1;

      // 2. DETEKSI NILAI TIDAK WAJAR (Anomaly Detection)
      if (tx.amount > 10000) { // Misal transaksi > $10,000 dianggap besar
        // Lapor ke Cortex
        learn("high_value_transaction", tx, ["financial", "whale"]);
        
        // Ajukan Proposal untuk verifikasi manual
        submitProposal(
          "financial.verify_whale", 
          { txId: tx.id, userId: tx.userId }, 
          `Whale alert: Transaction of $${tx.amount} detected.`
        );
      }
    }

    // 3. DETEKSI SPAM (Fraud Detection)
    // Jika 1 user melakukan > 5 transaksi dalam batch terakhir (15 detik)
    for (const [userId, count] of Object.entries(userActivity)) {
      if (count > 5) {
        console.warn(`[FINANCE] FRAUD ALERT: User ${userId} spamming transactions!`);
        
        // AUTO-FREEZE (Tindakan Keamanan Tanpa Izin)
        // Disini kita blokir user tersebut (Simulasi)
        learn("fraud_block", { userId, reason: "transaction_spam" }, ["security", "ban"]);
        
        // Beritahu Admin
        submitProposal("admin.ban_user", { userId }, "User detected spamming transactions.");
      }
    }
  }
}
