#!/usr/bin/env bash
set -euo pipefail

# gen25_rebuild_safe.sh
# Membangun UI di SUB-FOLDER 'gen25-ui' agar tidak merusak Backend Root.

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "Error: Cd ke root repo terlebih dahulu."
  exit 1
fi

cd "$REPO_ROOT"
echo "Repo root: $REPO_ROOT"

# 1) Safety: Check Clean Tree
if ! git diff-index --quiet HEAD --; then
  echo "ERROR: Working tree tidak bersih. Commit dulu perubahan Anda."
  git status --porcelain
  exit 1
fi

# 2) Create Branch
BRANCH="gen25-ui-$(date +%Y%m%d-%H%M)"
git checkout -b "$BRANCH"
echo "Branch created: $BRANCH"

# 3) Build UI in SUBFOLDER
UI_DIR="gen25-ui"
echo "Membangun UI di folder: $UI_DIR ..."
mkdir -p "$UI_DIR/src/components" "$UI_DIR/src/layout" "$UI_DIR/src/pages" "$UI_DIR/public"

# --- Masuk ke folder UI untuk generate file ---
cd "$UI_DIR"

# 3a) package.json (Frontend Only)
cat > package.json <<'PJ'
{
  "name": "feac-gen25-ui",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.0.0",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
PJ

# 3b) tsconfig.json
cat > tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "unusedLocals": false,
    "unusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
TS

cat > tsconfig.node.json <<'TSN'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
TSN

# 3c) vite config
cat > vite.config.ts <<'VC'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
VC

# 3d) index.html
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FEAC Sovereign UI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML

# 3e) src/main.tsx
cat > src/main.tsx <<'MT'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MT

# 3f) src/styles.css
cat > src/styles.css <<'SC'
:root{--bg:#f7f7f8; --panel:#ffffff; --text:#0f172a;}
body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text);}
* {box-sizing: border-box;}
SC

# 3g) src/App.tsx (Sovereign Chat Interface)
cat > src/App.tsx <<'APP'
import React, { useState } from "react";
import { Menu, Terminal, Shield, Cpu, Activity } from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState(["[SYSTEM] Sovereign UI Connected.", "[CORE] Waiting for Neural Bus..."]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if(!input) return;
    setLogs(prev => [...prev, `[USER] ${input}`, `[AI] Processing command: ${input}...`]);
    setInput("");
  };

  return (
    <div style={{display:"flex", height:"100vh", width:"100vw"}}>
      {/* SIDEBAR */}
      <aside style={{width:260, background:"#202123", color:"#ECECF1", padding:10, display:"flex", flexDirection:"column"}}>
        <div style={{padding:10, fontWeight:"bold", display:"flex", alignItems:"center", gap:10}}>
          <Shield size={20} color="#10a37f"/> FEAC CORE
        </div>
        <nav style={{flex:1}}>
          <div style={{padding:10, borderRadius:5, background:"#343541", marginBottom:5, cursor:"pointer"}}>
            <Terminal size={16} style={{marginRight:8, display:"inline"}}/> Terminal Output
          </div>
          <div style={{padding:10, borderRadius:5, cursor:"pointer"}}>
            <Cpu size={16} style={{marginRight:8, display:"inline"}}/> Neural Bus
          </div>
          <div style={{padding:10, borderRadius:5, cursor:"pointer"}}>
            <Activity size={16} style={{marginRight:8, display:"inline"}}/> Financial Ledger
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{flex:1, display:"flex", flexDirection:"column", background:"#343541", position:"relative"}}>
        <div style={{flex:1, padding:20, overflowY:"auto", color:"#D1D5DB", fontFamily:"monospace"}}>
          {logs.map((l,i) => (
            <div key={i} style={{marginBottom:8, borderBottom:"1px solid #444654", paddingBottom:8}}>{l}</div>
          ))}
        </div>
        <div style={{padding:20, background:"#343541", borderTop:"1px solid #555"}}>
           <div style={{display:"flex", background:"#40414F", borderRadius:8, padding:10}}>
             <input 
               style={{flex:1, background:"transparent", border:"none", color:"white", outline:"none"}}
               placeholder="Enter command to Sovereign Core..."
               value={input}
               onChange={e=>setInput(e.target.value)}
               onKeyDown={e=> e.key === 'Enter' && handleSend()}
             />
             <button onClick={handleSend} style={{background:"transparent", border:"none", cursor:"pointer", color:"#ccc"}}><Terminal size={18}/></button>
           </div>
        </div>
      </main>
    </div>
  );
}
APP

# --- Kembali ke ROOT untuk Git Operations ---
cd "$REPO_ROOT"

# 4) Add to Git
echo "Adding new files..."
git add "$UI_DIR"

git commit -m "feat: Add GEN25 Sovereign UI in /$UI_DIR"

# 5) Safer Push Method
echo
echo "=== READY TO PUSH ==="
read -p "GitHub Username: " GUSER
read -s -p "GitHub PAT: " GPAT
echo ""

# Push menggunakan URL Auth sementara TANPA mengubah config local secara permanen
git push "https://${GUSER}:${GPAT}@github.com/DikriFauzan/Unizan.git" "$BRANCH"

echo ""
echo "✅ SUCCESS."
echo "UI Code ada di folder: $UI_DIR"
echo "Branch '$BRANCH' telah dipush."
echo "Untuk menjalankan UI:"
echo "  cd $UI_DIR"
echo "  npm install"
echo "  npm run dev"
