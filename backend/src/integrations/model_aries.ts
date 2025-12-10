/**
 * Aries/SuperKey adapter (PRIMARY target)
 * Implement network calls to Aries superkey service.
 * Requires: FEAC_INTERNAL_KEY, ARIES_URL
 *
 * NOTE: replace placeholder HTTP call with actual protocol and auth.
 */
import axios from "axios";

const ARIES_URL = process.env.ARIES_URL || "http://localhost:8200";
const INTERNAL_KEY = process.env.FEAC_INTERNAL_KEY || "FEAC-SVR-PLACEHOLDER";

export default {
  async generate(prompt: string, opts: any = {}) {
    const resp = await axios.post(`${ARIES_URL}/v1/generate`, {
      prompt, options: opts
    }, { headers: { "x-internal-key": INTERNAL_KEY }});
    return resp.data;
  }
};
