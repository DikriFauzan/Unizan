import * as fs from "fs";
import * as path from "path";
import { dispatch } from "./feac_dispatcher";

const DB_PATH = path.join(process.env.HOME || ".", "feac_proposal_db.json");

export interface Proposal {
  id: string;
  cmd: string;
  payload: any;
  reason: string;
  status: "pending" | "approved" | "rejected" | "executed" | "failed";
  createdAt: number;
}

function loadDB(): Proposal[] {
  if (!fs.existsSync(DB_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); } catch { return []; }
}

function saveDB(data: Proposal[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function submitProposal(cmd: string, payload: any, reason: string) {
  const db = loadDB();
  const prop: Proposal = {
    id: "prop-" + Date.now().toString(36),
    cmd,
    payload,
    reason,
    status: "pending",
    createdAt: Date.now()
  };
  db.push(prop);
  saveDB(db);
  return { status: "submitted", id: prop.id, msg: "Waiting for human approval" };
}

// FIX: Added ': Promise<any>' explicitly
export async function approveProposal(id: string): Promise<any> {
  const db = loadDB();
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) return { status: "error", error: "not-found" };
  
  const p = db[idx];
  if (p.status !== "pending") return { status: "error", error: "not-pending" };

  try {
    console.log(`[PROPOSAL] Approving ${p.cmd} by Human Command`);
    const result = await dispatch(p.cmd, p.payload);
    
    p.status = "executed";
    saveDB(db);
    return { status: "executed", result };
  } catch (e: any) {
    p.status = "failed";
    saveDB(db);
    return { status: "error", error: e.message };
  }
}

export function rejectProposal(id: string) {
  const db = loadDB();
  const idx = db.findIndex(p => p.id === id);
  if (idx === -1) return { status: "error", error: "not-found" };
  
  db[idx].status = "rejected";
  saveDB(db);
  return { status: "rejected", id };
}

export function listProposals(statusFilter?: string) {
  const db = loadDB();
  if (statusFilter) return db.filter(p => p.status === statusFilter);
  return db;
}
