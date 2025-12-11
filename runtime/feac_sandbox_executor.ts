import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { loadSnapshot } from "./feac_snapshot_loader";

const SNAP_DIR = path.join(process.env.HOME || ".", "feac_runtime_snapshots");

export interface SandboxResult {
  status: string;
  id: string;
  outputDir?: string;
  error?: string;
}

export function runSnapshot(id: string, runtimeRoot: string): SandboxResult {
  try {
    const session = crypto.randomUUID();
    const target = path.join(runtimeRoot, "sandbox", session);
    fs.mkdirSync(target, { recursive: true });

    const loadRes = loadSnapshot(id, runtimeRoot);
    if (loadRes.status !== "ok") {
      return { status: "error", id: session, error: "load-failed" };
    }

    // Move restored snapshot content
    const snapTemp = path.join(runtimeRoot, "snapshots", id);
    if (!fs.existsSync(snapTemp)) {
      return { status: "error", id: session, error: "temp-snapshot-not-found" };
    }

    const copyRecursive = (src: string, rel = "") => {
      for (const it of fs.readdirSync(src)) {
        const abs = path.join(src, it);
        const dst = path.join(target, rel, it);
        const st = fs.statSync(abs);
        if (st.isDirectory()) {
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          copyRecursive(abs, path.join(rel, it));
        } else {
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.copyFileSync(abs, dst);
        }
      }
    };

    copyRecursive(snapTemp);
    return { status: "ok", id: session, outputDir: target };
  } catch (e: any) {
    return { status: "error", id: "none", error: e.message };
  }
}
