import * as fs from "fs";
import * as path from "path";

const SNAP_DIR = path.join(process.env.HOME || ".", "feac_runtime_snapshots");
if (!fs.existsSync(SNAP_DIR)) fs.mkdirSync(SNAP_DIR, { recursive: true });

export interface SnapshotMeta {
  id: string;
  createdAt: number;
  files: { path: string; mtime: number; size: number }[];
  notes?: string;
}

export function createSnapshot(id: string, sourceDir: string, notes?: string): SnapshotMeta {
  const meta: SnapshotMeta = {
    id,
    createdAt: Date.now(),
    files: [],
    notes
  };

  function walk(dir: string) {
    const items = fs.readdirSync(dir);
    for (const it of items) {
      const p = path.join(dir, it);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        walk(p);
      } else {
        const rel = path.relative(sourceDir, p);
        const destDir = path.join(SNAP_DIR, id, path.dirname(rel));
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(p, path.join(SNAP_DIR, id, rel));
        meta.files.push({ path: rel, mtime: st.mtimeMs, size: st.size });
      }
    }
  }

  walk(sourceDir);

  fs.writeFileSync(path.join(SNAP_DIR, id, "snapshot.meta.json"), JSON.stringify(meta, null, 2));
  return meta;
}

export function listSnapshots(): string[] {
  if (!fs.existsSync(SNAP_DIR)) return [];
  return fs.readdirSync(SNAP_DIR).filter(d => fs.statSync(path.join(SNAP_DIR, d)).isDirectory());
}
