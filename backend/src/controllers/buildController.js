/**
 * BuildController
 * - Accepts build trigger from FEAC API (protected by apiKeyGuard)
 * - Enqueues job to 'build-jobs' queue
 * - Returns job id and status
 */

const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const connection = new IORedis(process.env.REDIS_URL || 'redis://redis:6379');
const buildQueue = new Queue('build-jobs', { connection });
const { v4: uuidv4 } = require('uuid');

exports.triggerBuild = async (req, res) => {
  try {
    const user = req.user || { id: 'anonymous' };
    const payload = req.body || {};

    // Basic validation
    if (!payload.gitUrl) return res.status(400).json({ error: 'gitUrl required' });

    // Prepare job
    const jobId = uuidv4();
    const jobData = {
      gitUrl: payload.gitUrl,
      branch: payload.branch || 'main',
      commit: payload.commit,
      buildType: payload.buildType || 'apk',
      keystore: payload.keystore, // { base64, alias }
      callbackUrl: payload.callbackUrl,
      requesterKey: req.headers['x-api-key']
    };

    // Enqueue
    await buildQueue.add('build', jobData, { jobId });

    return res.json({ jobId, status: 'queued' });
  } catch (e) {
    console.error('triggerBuild error', e);
    return res.status(500).json({ error: e.message });
  }
};
