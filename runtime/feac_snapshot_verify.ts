import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const SNAP_DIR = path.join(process.env.HOME || ".", "feac_runtime_snapshots");

interface FileEntry {
  path: string;
  size: number;
  mtime: number;
}

interface SnapshotMeta {
  id: string;
  createdAt: number;
  files: FileEntry[];
}

export function verifySnapshot(id: string, rootDir: string): any {
  const snapDir = path.join(SNAP_DIR, id);
  const metaPath = path.join(snapDir, "snapshot.meta.json");

  if (!fs.existsSync(metaPath)) {
    return { status: "error", error: "snapshot-meta-not-found" };
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as SnapshotMeta;
  const results: any[] = [];

  for (const f of meta.files) {
    const snapFile = path.join(snapDir, f.path);
    const liveFile = path.join(rootDir, f.path);
    const entry: any = { path: f.path };

    if (!fs.existsSync(liveFile)) {
      entry.status = "missing-live-file";
    } else {
      const st = fs.statSync(liveFile);
      entry.liveSize = st.size;
      entry.snapSize = f.size;

      if (st.size !== f.size) {
        entry.status = "size-mismatch";
      } else {
        const h1 = crypto.createHash("sha256").update(fs.readFileSync(liveFile)).digest("hex");
        const h2 = crypto.createHash("sha256").update(fs.readFileSync(snapFile)).digest("hex");
        if (h1 !== h2) {
          entry.status = "hash-mismatch";
        } else {
          entry.status = "ok";
        }
      }
    }
    results.push(entry);
  }
  return { status: "ok", verify: results };
}
