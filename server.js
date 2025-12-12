const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');
<<<<<<< HEAD

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// DATA STORAGE
const DATA_DIR = path.join(__dirname, 'data_store');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

// API ENDPOINTS
app.get('/api/chats', (req, res) => { if(fs.existsSync(CHATS_FILE)) res.json(JSON.parse(fs.readFileSync(CHATS_FILE))); else res.json([]); });
app.post('/api/chats', (req, res) => { fs.writeFileSync(CHATS_FILE, JSON.stringify(req.body)); res.json({success:true}); });

app.get('/api/cloud/status', (req, res) => res.json({ setup_complete: true })); // Force Setup Complete
app.post('/api/cloud/setup', (req, res) => res.json({ success: true }));
app.post('/api/termux', (req, res) => { exec(req.body.cmd, (e,o,r)=>res.json({output:o||r||e?.message})); });

// SERVE UI (Production)
app.use(express.static(path.join(__dirname, 'gen25-ui/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'gen25-ui/dist/index.html')));

app.listen(PORT, () => console.log(`SERVER RUNNING: ${PORT}`));
=======
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// POINTING KE PUBLIC ASSETS (HASIL BUILD REACT)
// Saat dicompile pkg, kita gunakan snapshot file system
const distPath = path.join(__dirname, 'gen25-ui/dist');
app.use(express.static(distPath));

// DATA STORE
const DATA_DIR = path.join(process.cwd(), 'data_store'); // Gunakan process.cwd agar data tersimpan di luar binary
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const CLOUD_CONFIG_FILE = path.join(DATA_DIR, 'cloud_identity.json');
const REPOS_FILE = path.join(DATA_DIR, 'repos.json');

// API ROUTES
app.get('/api/config', (req, res) => { if (fs.existsSync(CONFIG_FILE)) res.json(JSON.parse(fs.readFileSync(CONFIG_FILE))); else res.json({}); });
app.post('/api/config', (req, res) => { fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body)); res.json({ success: true }); });
app.get('/api/cloud/status', (req, res) => res.json({ setup_complete: fs.existsSync(CLOUD_CONFIG_FILE) }));
app.post('/api/cloud/setup', (req, res) => { fs.writeFileSync(CLOUD_CONFIG_FILE, JSON.stringify(req.body)); res.json({ success: true }); });
app.post('/api/cloud/access', (req, res) => { if (!fs.existsSync(CLOUD_CONFIG_FILE)) return res.json({ auth: false }); setTimeout(()=>res.json({ auth: true, data: ["access_granted"] }), 1000); });
app.post('/api/architect/audit', upload.single('manual'), (req, res) => res.json({ success: true }));
app.post('/api/architect/interact', (req, res) => res.json({ role: 'ai', text: `Architect: ${req.body.prompt}` }));
app.post('/api/engine/interact', (req, res) => res.json({ role: 'ai', text: `Engine: ${req.body.prompt}` }));
app.get('/api/repos', (req, res) => { if(fs.existsSync(REPOS_FILE)) res.json(JSON.parse(fs.readFileSync(REPOS_FILE))); else res.json([]); });
app.post('/api/repos', (req, res) => { fs.writeFileSync(REPOS_FILE, JSON.stringify(req.body)); res.json({success:true}); });
app.post('/api/repos/scan', (req, res) => { setTimeout(() => res.json({ issues: [] }), 1000); });
app.get('/api/chats', (req, res) => { if(fs.existsSync(CHATS_FILE)) res.json(JSON.parse(fs.readFileSync(CHATS_FILE))); else res.json([]); });
app.post('/api/chats', (req, res) => { fs.writeFileSync(CHATS_FILE, JSON.stringify(req.body)); res.json({success:true}); });
app.post('/api/termux', (req, res) => { exec(req.body.cmd, {cwd:process.env.HOME}, (e,o,r)=>res.json({output:o||r||e?.message})); });

// SPA FALLBACK
app.get('*', (req, res) => {
    // Cek jika ada di dalam binary atau folder biasa
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) res.sendFile(indexPath);
    else res.send("System Loading... Please wait.");
});

app.listen(PORT, () => console.log(`SOVEREIGN ONLINE: ${PORT}`));
>>>>>>> gen25-ui-20251212-0053
