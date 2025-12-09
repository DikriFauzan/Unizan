const { emitLog } = require('./logger/emit');
/**
 * FEAC Build Agent - Worker
 * - Listens to "build-jobs" BullMQ queue
 * - Processes job: clone -> optional patch -> perform Godot export (placeholder) -> sign -> upload -> notify
 *
 * NOTE: Godot headless export and Android signing steps are placeholders and must be implemented
 *       with the real Godot 4.5.1 headless binary and Android SDK toolchain.
 *       -> butuh riset lanjutan
 */

const { Worker, Queue, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');

const connection = new IORedis(process.env.REDIS_URL || 'redis://redis:6379');

const queueName = 'build-jobs';
new QueueScheduler(queueName, { connection });
const buildQueue = new Queue(queueName, { connection });

// MinIO client (artifact storage)
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS || 'minioadmin',
  secretKey: process.env.MINIO_SECRET || 'minioadmin'
});

async function ensureBucket(bucket) {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) await minioClient.makeBucket(bucket);
  } catch (e) {
    console.error('MinIO error', e);
  }
}

const workdirRoot = path.resolve(process.env.WORKDIR || '/workspace/builds');

if (!fs.existsSync(workdirRoot)) fs.mkdirSync(workdirRoot, { recursive: true });

console.log('[build-agent] starting worker, workdir=', workdirRoot);

const worker = new Worker(queueName, async job => {
  console.log('[build-agent] processing job', job.id, job.name);

  const payload = job.data;
  const { gitUrl, branch='main', commit, buildType='apk', keystore, callbackUrl, requesterKey } = payload;
  const jobId = job.id || uuidv4();
  const tmpDir = path.join(workdirRoot, `job_${jobId}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // 1) Clone repository
    console.log('[build-agent] cloning', gitUrl, 'branch', branch);
    const git = simpleGit(tmpDir);
    await git.clone(gitUrl, tmpDir, ['--branch', branch, '--single-branch']);
    if (commit) await git.checkout(commit);

    // 2) Optional patch step (placeholder)
    //    Example: apply patches from payload.patches
    if (payload.patches && payload.patches.length) {
      console.log('[build-agent] applying patches (count)', payload.patches.length);
      // implement patch application here (butuh riset lanjutan)
    }

    // 3) Prepare build: install node deps (if web wrapper) OR prepare Godot project
    console.log('[build-agent] preparing build environment');
    // If project uses npm (e.g., Capacitor), run install (safeguard)
    const hasPackage = fs.existsSync(path.join(tmpDir, 'package.json'));
    if (hasPackage) {
      console.log('[build-agent] installing npm deps (if present)');
      spawnSync('npm', ['install', '--production'], { cwd: tmpDir, stdio: 'inherit' });
    }

    // 4) Invoke Godot headless export (PLACEHOLDER)
    //    *REQUIREMENT*: Godot 4.5.1 headless binary must be installed on runner.
    //    Recommended command (example, adjust — butuh riset lanjutan):
    //    /opt/godot/godot4.5.1-headless --export "Android" path/to/output.apk
    console.log('[build-agent] performing Godot export (placeholder)');
    const artifactName = `feac_build_${jobId}.${buildType === 'aab' ? 'aab' : 'apk'}`;
    const artifactPath = path.join('/artifacts', artifactName);
    fs.mkdirSync('/artifacts', { recursive: true });
    // For now create a dummy artifact to simulate success
    fs.writeFileSync(artifactPath, `FEAC DUMMY ARTIFACT for job ${jobId}\n`);

    // 5) Signing with provided keystore (if present) - PLACEHOLDER
    if (keystore && keystore.base64) {
      console.log('[build-agent] received keystore, writing temporary keystore (simulation)');
      const ksPath = path.join(tmpDir, 'keystore.jks');
      const bytes = Buffer.from(keystore.base64, 'base64');
      fs.writeFileSync(ksPath, bytes);
      // Real signing workflow with apksigner/jarsigner must be implemented (butuh riset lanjutan)
    }

    // 6) Upload artifact to MinIO
    const bucket = process.env.MINIO_BUCKET || 'feac-artifacts';
    await ensureBucket(bucket);
    const objectName = `${jobId}/${artifactName}`;
    await minioClient.fPutObject(bucket, objectName, artifactPath, { 'x-amz-meta-jobid': jobId });

    const artifactUrl = `${process.env.MINIO_URL || 'http://minio:9000'}/${bucket}/${objectName}`;
    console.log('[build-agent] uploaded artifact', artifactUrl);

    // 7) Notify callback if provided
    if (callbackUrl) {
      try {
        await require('axios').post(callbackUrl, { jobId, status: 'success', artifactUrl });
      } catch (e) {
        console.warn('[build-agent] callback failed', e.message);
      }
    }

    // 8) Return success
    return { jobId, status: 'success', artifactUrl };
  } catch (err) {
    console.error('[build-agent] job failed', err);
    if (callbackUrl) {
      try { await require('axios').post(callbackUrl, { jobId, status: 'failed', error: err.message }); } catch (e){}
    }
    throw err;
  } finally {
    // optional cleanup - keep artifacts
    // fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}, { connection });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[build-agent] shutting down');
  await worker.close();
  process.exit(0);
});
