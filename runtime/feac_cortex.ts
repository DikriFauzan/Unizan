import * as fs from "fs";
import * as path from "path";

const CORTEX_PATH = path.join(process.env.HOME || ".", "feac_cortex_memory.json");

interface KnowledgeNode {
  topic: string;
  data: any;
  timestamp: number;
  tags: string[];
}

function loadCortex(): Record<string, KnowledgeNode[]> {
  if (!fs.existsSync(CORTEX_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(CORTEX_PATH, "utf8")); } catch { return {}; }
}

function saveCortex(mem: Record<string, KnowledgeNode[]>) {
  fs.writeFileSync(CORTEX_PATH, JSON.stringify(mem, null, 2));
}

// Belajar (Otomatis OK)
export function learn(topic: string, data: any, tags: string[] = []) {
  const mem = loadCortex();
  if (!mem[topic]) mem[topic] = [];
  
  mem[topic].push({
    topic,
    data,
    timestamp: Date.now(),
    tags
  });
  
  // Batasi memori per topik (FIFO 100 item) agar tidak meledak
  if (mem[topic].length > 100) mem[topic].shift();
  
  saveCortex(mem);
  return { status: "learned", topic, count: mem[topic].length };
}

// Mengingat
export function recall(topic: string, limit = 5) {
  const mem = loadCortex();
  if (!mem[topic]) return [];
  // Ambil yang terbaru
  return mem[topic].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

// Insight Global (List Topics)
export function listTopics() {
  const mem = loadCortex();
  return Object.keys(mem).map(k => ({ topic: k, entries: mem[k].length }));
}
