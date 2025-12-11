import { createSnapshot, listSnapshots } from "./feac_snapshot";
import { loadSnapshot } from "./feac_snapshot_loader";
import * as path from "path";
const SRC = path.join(process.env.HOME || ".", "feac_sovereign_compiler", "runtime");

async function run() {
  console.log("[smoke] src runtime dir:", SRC);
  const id = "smoke-" + Date.now();
  try {
    const meta = createSnapshot(id, SRC, "smoke test");
    console.log("[smoke] snapshot created:", meta.id, "files:", meta.files.length);
    const res = loadSnapshot(id, SRC);
    console.log("[smoke] loader result:", res);
    console.log("[smoke] available snapshots:", listSnapshots().slice(-5));
  } catch (e) {
    console.error("[smoke] error:", e);
    process.exit(2);
  }
}

run().catch(e => { console.error(e); process.exit(3); });
