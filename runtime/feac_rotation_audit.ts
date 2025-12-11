import * as fs from "fs";
import * as path from "path";

const LOG_PATH = path.join(process.env.HOME || ".", "feac_rotation_log.json");

export interface RotationLogEntry {
  id: string;
  timestamp: number;
  oldKeyMasked?: string | null;
  newKeyMasked?: string | null;
  reason?: string;
}

function loadLog(): RotationLogEntry[] {
  if (!fs.existsSync(LOG_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
  } catch {
    return [];
  }
}

function saveLog(list: RotationLogEntry[]) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(list, null, 2));
}

export function writeRotationLog(entry: RotationLogEntry) {
  const list = loadLog();
  list.push(entry);
  saveLog(list);
}

export function listRotationLog(limit = 100) {
  const list = loadLog();
  return list.slice(-limit).reverse();
}
