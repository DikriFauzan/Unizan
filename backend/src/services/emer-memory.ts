/**
 * emergent memory store
 * - shortTerm: in-memory circular buffer (fast: any)
 * - longTerm: persisted (Prisma) — if Prisma not present, fallback to file
 *
 * NOTE: This is skeleton — production should move longTerm to Redis/Postgres.
 *       — butuh riset lanjutan
 */
let shortTermBuffer: Array<any> = [];
const SHORT_TERM_LIMIT = 200; // recent tokens / events

import prisma from "../config/db"; // may exist in project

export const addShortTerm = (item: any) => {
  shortTermBuffer.push({ ...item, ts: new Date() });
  if (shortTermBuffer.length > SHORT_TERM_LIMIT) shortTermBuffer.shift();
};

export const getShortTerm = (n = 50) => {
  return shortTermBuffer.slice(Math.max(0, shortTermBuffer.length - n));
};

export const persistLongTerm = async (item: any) => {
  try {
    if (prisma && (prisma as any).emergentMemory) {
      return await (prisma as any).emergentMemory.create({ data: { payload: JSON.stringify(item: any) }});
    }
  } catch (e: any) {
    // fallback: append to file
    const fs = require("fs");
    try { fs.appendFileSync("./emergent_long_term.log", JSON.stringify({ ts: new Date(), item }) + "\n"); } catch(e: any){}
  }
  return null;
};

export const queryLongTerm = async (q: string, limit=20) => {
  try {
    if (prisma && (prisma as any).emergentMemory) {
      const rows = await (prisma as any).$queryRaw`SELECT * FROM "EmergentMemory" WHERE payload ILIKE ${'%' + q + '%'} LIMIT ${limit}`;
      return rows;
    }
  } catch(e: any){}
  return [];
};
