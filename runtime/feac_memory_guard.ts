import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

const MEM_PATH = path.join(process.env.HOME || ".", "feac_memory_guard.json");

export interface IntegrityRecord {
  file: string;
  hash: string;
  updated: number;
}

function sha256(data: string | Buffer) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function loadGuard(): IntegrityRecord[] {
  if (!fs.existsSync(MEM_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(MEM_PATH, "utf8"));
  } catch {
    return [];
  }
}

function saveGuard(list: IntegrityRecord[]) {
  fs.writeFileSync(MEM_PATH, JSON.stringify(list, null, 2));
}

export function registerMemory(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const data = fs.readFileSync(filePath);
  const h = sha256(data);

  const list = loadGuard();
  const idx = list.findIndex(e => e.file === filePath);

  const entry: IntegrityRecord = {
    file: filePath,
    hash: h,
    updated: Date.now()
  };

  if (idx >= 0) list[idx] = entry;
  else list.push(entry);

  saveGuard(list);

  return entry;
}

export function verifyMemory(filePath: string) {
  if (!fs.existsSync(filePath)) return { ok: false, cause: "file-missing" };
  const list = loadGuard();
  const e = list.find(x => x.file === filePath);
  if (!e) return { ok: false, cause: "not-registered" };

  const h = sha256(fs.readFileSync(filePath));
  return { ok: h === e.hash, expected: e.hash, actual: h };
}

export function listGuard() {
  return loadGuard();
}
