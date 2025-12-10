/**
 * Worker hook: simulate emergent execution and report results to backend
 * - Intended to be required by build-worker flow
 */
const axios = require('axios');

async function postResult(backendUrl, jobId, stepId, output) {
  try {
    await axios.post(`${backendUrl}/v1/internal/emer/result`, { jobId, stepId, output });
    console.log("[emer_hook] posted result", stepId);
  } catch (e) {
    console.warn("[emer_hook] failed post", e.message);
  }
}

module.exports = { postResult };
