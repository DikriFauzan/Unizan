/**
 * build-agent worker skeleton (simulate or implement real build)
 */
const axios = require('axios');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000/v1';

async function simulateBuild(jobId) {
  try {
    console.log("Starting simulated build:", jobId);
    await axios.post(`${BACKEND}/internal/build/progress`, { jobId, progress: 5, status: 'running' });
    const files = ['src/main.gd','scenes/main.tscn','README.md','build/config.json'];
    let order = 0;
    for (const p of files) {
      const f = await axios.post(`${BACKEND}/internal/build/file`, { jobId, path: p, order });
      console.log("file created", f.data.id, p);
      await sleep(800);
      await axios.post(`${BACKEND}/internal/build/file/done`, { fileId: f.data.id, output: "code or url" });
      order++;
      await axios.post(`${BACKEND}/internal/build/progress`, { jobId, progress: Math.min(5 + order*20, 95) });
    }
    await axios.post(`${BACKEND}/internal/build/progress`, { jobId, progress: 100, status: 'succeeded' });
    console.log("Build finished", jobId);
  } catch (e) { console.error("Sim failed", e.message); await axios.post(`${BACKEND}/internal/build/progress`, { jobId, progress: 0, status: 'failed' }); }
}

if (require.main === module) {
  const jobId = process.argv[2];
  if (!jobId) { console.log("Usage: node worker-build.js <jobId>"); process.exit(1); }
  simulateBuild(jobId);
}

module.exports = { simulateBuild };
