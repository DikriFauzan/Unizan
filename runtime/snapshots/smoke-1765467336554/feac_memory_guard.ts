import * as fs from "fs";
import * as crypto from "crypto";

const REGISTRY_FILE = "feac_memory_registry.json";

function getHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return "missing";
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function registerMemory(filePath: string) {
  let reg: Record<string, string> = {};
  if (fs.existsSync(REGISTRY_FILE)) {
    reg = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf8"));
  }
  const h = getHash(filePath);
  reg[filePath] = h;
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(reg, null, 2));
  return { file: filePath, hash: h, status: "registered" };
}

export function verifyMemory(filePath: string) {
  if (!fs.existsSync(REGISTRY_FILE)) return { status: "unknown", reason: "no-registry" };
  const reg = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf8"));
  
  if (!reg[filePath]) return { status: "unknown", reason: "not-registered" };
  
  const current = getHash(filePath);
  const expected = reg[filePath];
  
  return {
    file: filePath,
    status: current === expected ? "secure" : "compromised",
    expected,
    current
  };
}

export function listGuard() {
  if (!fs.existsSync(REGISTRY_FILE)) return {};
  return JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf8"));
}
