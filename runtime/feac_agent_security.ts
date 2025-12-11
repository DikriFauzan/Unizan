import * as fs from "fs";
import * as path from "path";
import { BaseAgent } from "./feac_agent_base";
import { scanAllMemory } from "./feac_memory_scanner";
import { submitProposal } from "./feac_proposal";
import { learn } from "./feac_cortex";

export class SecurityAgent extends BaseAgent {
  private allowedFiles: Set<string> = new Set();

  constructor() {
    super("Security-Enforcer", 5000); // Scan tiap 5 detik (Agresif)
  }

  async tick() {
    // 1. SCAN MEMORY
    const scan = scanAllMemory(); // Dari Step 11
    if (!scan.files) return;

    // 2. DETEKSI ANOMALI (Logic Sederhana: File baru yang tidak dikenal)
    // Di real production, ini harus cek Hash/Signature
    const currentFiles = scan.files.map((f: any) => f.name);
    
    // Inisialisasi whitelist saat pertama jalan
    if (this.allowedFiles.size === 0) {
      currentFiles.forEach((f: string) => this.allowedFiles.add(f));
      return;
    }

    for (const file of currentFiles) {
      if (!this.allowedFiles.has(file)) {
        // !!! ANCAMAN TERDETEKSI !!!
        // Cek ekstensi, jika .exe atau .sh asing, atau .js aneh -> HANCURKAN
        if (file.endsWith(".malware") || file.includes("virus")) {
           this.terminateThreat(file);
        } else {
           // Jika file terlihat aman (misal log), masukkan ke Cortex tapi jangan dihapus dulu
           // Atau ajukan proposal untuk whitelist
           if (!file.endsWith(".log") && !file.endsWith(".json")) {
             // Suspicious tapi belum tentu virus
             learn("security_warning", { file, msg: "Unknown file detected" }, ["security"]);
           }
        }
      }
    }
  }

  // ACT OF WAR (Tanpa Izin)
  private terminateThreat(filename: string) {
    const fullPath = path.join(process.cwd(), "runtime", filename);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // DELETE PERMANENT
        console.warn(`[SECURITY] THREAT ELIMINATED: ${filename}`);
        
        // Lapor ke Cortex (History)
        learn("security_action", { action: "delete", file: filename }, ["kill-switch"]);
      }
    } catch (e) {
      console.error(`[SECURITY] Failed to eliminate ${filename}`, e);
    }
  }

  // SYSTEM UPGRADE (Perlu Izin)
  public requestFirewallUpdate(newRule: string) {
    submitProposal("security.update_firewall", { rule: newRule }, "Security Agent advises firewall update");
  }
}
