/**
 * backend/src/services/superkeyService.ts
 * Simple adapter to call SuperKey service (local or hosted).
 * Saves returned PDF (base64) into artifacts directory if present.
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SUPERKEY_MODE = process.env.SUPERKEY_MODE || 'local';
const SUPERKEY_ENDPOINT = process.env.SUPERKEY_ENDPOINT || 'http://superkey:9100/api/v1/generate';
const ARTIFACT_DIR = process.env.SUPERKEY_PDF_ARTIFACT_DIR || path.join(process.cwd(), 'artifacts', 'superkey');

export type SuperkeyResult = {
  provider: string;
  text?: string;
  pdf_url?: string;
  meta?: any;
};

export async function callSuperkey(prompt: string, opts: { depth?: number, producePdf?: boolean } = {}): Promise<SuperkeyResult | null> {
  try {
    if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

    const payload = { prompt, depth: opts.depth || 3, producePdf: !!opts.producePdf };
    const resp = await axios.post(SUPERKEY_ENDPOINT, payload, { timeout: 120000 });

    const data = resp.data || {};
    if (data.pdf_base64) {
      const filename = `superkey_${Date.now()}.pdf`;
      const filePath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(data.pdf_base64, 'base64'));
      return { provider: 'superkey', text: data.output || '', pdf_url: `/artifacts/superkey/${filename}`, meta: data.meta || {} };
    }

    if (data.output) return { provider: 'superkey', text: data.output, meta: data.meta || {} };
    return null;
  } catch (e: any) {
    console.warn('SuperKey call failed:', e.message || e);
    return null;
  }
}
