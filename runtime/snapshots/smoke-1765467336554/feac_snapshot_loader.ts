import * as fs from "fs";
import * as path from "path";

const SNAP_DIR = path.join(process.env.HOME || ".", "feac_runtime_snapshots");

export function loadSnapshot(id: string, targetDir: string): { status: string; restored?: number; error?: string } {
  try {
    const snapPath = path.join(SNAP_DIR, id);
    if (!fs.existsSync(snapPath)) return { status: "error", error: "snapshot-not-found" };

    // restore all files under snapshot into targetDir/<id> to keep sandbox isolation
    const destRoot = path.join(targetDir, "snapshots", id);
    if (!fs.existsSync(destRoot)) fs.mkdirSync(destRoot, { recursive: true });

    function walkRestore(src: string, relBase = "") {
      const items = fs.readdirSync(src);
      for (const it of items) {
        const p = path.join(src, it);
        const st = fs.statSync(p);
        if (st.isDirectory()) {
          walkRestore(p, path.join(relBase, it));
        } else {
          const rel = path.join(relBase, it);
          const destPath = path.join(destRoot, rel);
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(p, destPath);
        }
      }
    }

    walkRestore(snapPath);
    return { status: "ok", restored: 1 };
  } catch (e: any) {
    return { status: "error", error: e.message || String(e) };
  }
}
