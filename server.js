const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');

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
