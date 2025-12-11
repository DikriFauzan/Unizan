import { createSnapshot, listSnapshots } from "./feac_snapshot";
import { loadSnapshot } from "./feac_snapshot_loader";
import { verifySnapshot } from "./feac_snapshot_verify";
import { runSnapshot } from "./feac_sandbox_executor";
import * as path from "path";

const ROOT = path.join(process.env.HOME || ".", "feac_sovereign_compiler", "runtime");

export async function snapshotRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "snapshot.list": return { status: "ok", snapshots: listSnapshots() };
    case "snapshot.create":
      if (!payload?.id) return { status: "error", error: "missing-id" };
      return { status: "ok", meta: createSnapshot(payload.id, ROOT, payload?.notes || "") };
    case "snapshot.load":
      if (!payload?.id) return { status: "error", error: "missing-id" };
      return loadSnapshot(payload.id, ROOT);
    case "snapshot.verify":
      if (!payload?.id) return { status: "error", error: "missing-id" };
      return verifySnapshot(payload.id, ROOT);
    case "snapshot.run":
      if (!payload?.id) return { status: "error", error: "missing-id" };
      return runSnapshot(payload.id, ROOT);
    default: return null;
  }
}
