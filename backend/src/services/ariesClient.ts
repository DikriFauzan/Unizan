/**
 * Aries client for FEAC backend.
 * - Uses ARIES_URL env var (e.g. https://aries.example/v1/chat/completions)
 * - Sends FEAC_INTERNAL_KEY in x-api-key header
 */
import axios from 'axios';

const ARIES_URL = process.env.ARIES_URL || 'http://localhost:8200/v1/chat/completions';
const INTERNAL_KEY = process.env.FEAC_INTERNAL_KEY || 'FEAC-SVR-REPLACE';

export async function ariesChat(body) {
  const r = await axios.post(ARIES_URL, body, {
    headers: { 'x-api-key': INTERNAL_KEY, 'content-type': 'application/json' }
  });
  return r.data;
}
