import { learn } from "./feac_cortex";
import { submitProposal } from "./feac_proposal";

// Simulasi Scheduler Sederhana (Interval Loop)
let sentinelInterval: NodeJS.Timeout | null = null;

export function startSentinel() {
  if (sentinelInterval) return;
  console.log("[SENTINEL] Watchdog started...");
  
  // Loop setiap 1 jam (disimulasikan 10 detik untuk test ini)
  sentinelInterval = setInterval(async () => {
    await runRoutineCheck();
  }, 10000); 
}

export function stopSentinel() {
  if (sentinelInterval) clearInterval(sentinelInterval);
  sentinelInterval = null;
}

async function runRoutineCheck() {
  const now = new Date();
  
  // 1. KEGIATAN RUTIN: Auto-Learn / Reporting (DIIZINKAN OTOMATIS)
  // Contoh: Simpan status kesehatan server ke Cortex
  const healthData = { cpu: "ok", memory_usage: process.memoryUsage().rss };
  learn("system_health", healthData, ["routine", "auto"]);
  // console.log("[SENTINEL] Routine health check saved to Cortex.");

  // 2. KEGIATAN KRITIS: Deteksi Anomali (BUTUH APPROVAL)
  // Misal: Jika memory usage > 1GB, jangan restart sendiri! Ajukan Proposal.
  if (healthData.memory_usage > 1024 * 1024 * 1024) { // > 1GB
     submitProposal(
       "admin.memory.cleanup", 
       { force: true }, 
       "High memory usage detected by Sentinel (>1GB)"
     );
     console.log("[SENTINEL] High Memory! Proposal submitted for cleanup.");
  }
}
