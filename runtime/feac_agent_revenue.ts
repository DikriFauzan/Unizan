import { BaseAgent } from "./feac_agent_base";
import { learn } from "./feac_cortex";
import { submitProposal } from "./feac_proposal";

export class RevenueAgent extends BaseAgent {
  private targetRevenue = 1000000; // $1M Target

  constructor() {
    super("Revenue-Optimizer", 10000); // Cek tiap 10 detik (Simulasi)
  }

  async tick() {
    // 1. SIMULASI ANALISA DATA (Nanti diganti data real dari Stripe/IAP)
    const currentSimulatedRevenue = Math.floor(Math.random() * 500000); 
    const gap = this.targetRevenue - currentSimulatedRevenue;

    // 2. REPORTING (Otomatis ke Cortex)
    learn("revenue_stream", { current: currentSimulatedRevenue, gap }, ["financial", "iap"]);

    // 3. ACTION (Jika gap terlalu besar, ajukan Proposal Strategi)
    if (gap > 800000) {
      // Kita butuh promo!
      // Cek apakah sudah ada proposal serupa agar tidak spam
      // (Logic penyederhanaan: langsung submit)
      submitProposal(
        "marketing.run_campaign", 
        { discount: 50, type: "flash_sale" }, 
        "Revenue gap critical. Flash sale recommended to boost IAP."
      );
      console.log("[REVENUE] Proposal submitted: Flash Sale");
      
      // Stop sementara agar tidak spam proposal setiap detik
      this.stop(); 
      setTimeout(() => this.start(), 60000); // Lanjut lagi nanti
    }
  }
}
