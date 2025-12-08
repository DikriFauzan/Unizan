const axios = require("axios");

async function notifyStatus(opts) {
  // opts: { backendUrl, buildId, status, artifact, logs, project, branch, userId }
  try {
    const res = await axios.post(`${opts.backendUrl.replace(/\/$/,'')}/v1/build/update-status`, {
      buildId: opts.buildId,
      userId: opts.userId,
      project: opts.project,
      branch: opts.branch,
      status: opts.status,
      artifact: opts.artifact,
      logs: opts.logs
    }, { timeout: 10000 });
    console.log("notifyStatus ok:", res.data);
  } catch (e) {
    console.error("notifyStatus error:", e.message || e);
  }
}

// CLI usage
if (require.main === module) {
  const [,, backendUrl, buildId, status] = process.argv;
  if (!backendUrl || !buildId || !status) {
    console.log("Usage: node notify.js <backendUrl> <buildId> <status>");
    process.exit(1);
  }
  notifyStatus({ backendUrl, buildId, status }).then(()=>process.exit(0));
}

module.exports = notifyStatus;
