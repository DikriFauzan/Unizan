# FEAC WA Mini - AI Core Pribadi Terhubung NeoEngine

## Overview

FEAC WA Mini adalah aplikasi AI Core pribadi yang berjalan sebagai PWA/WebApp dengan tampilan mirip WhatsApp. Aplikasi ini dirancang khusus untuk user dengan nomor telepon **085119887826** dan terintegrasi dengan NeoEngine untuk pengembangan game.

## Fitur Utama

### 1. Chat Interface (WhatsApp Style)
- Tampilan bubble chat seperti WhatsApp
- 3 room khusus: Termux-Bridge, NeoEngine, Admin
- Real-time messaging dengan WebSocket
- Support berbagai tipe pesan (text, command, event, error)

### 2. Termux Bridge
- Integrasi dengan Termux untuk command execution
- File read/write di `/sdcard/Documents/Dikri/`
- Build APK Godot via Termux
- Git operations (clone, pull, commit, push)
- Python, Node.js, dan Bash execution

### 3. NeoEngine Integration
- Dual channel communication (HTTP + WebSocket)
- Event listener untuk build dan runtime events
- Command envelope dengan signature
- Auto recovery dengan retry dan fallback
- AdminCore untuk manajemen game

### 4. AI Core - Code Analysis & Auto-Fix
- File reader dan syntax analyzer
- Logic analyzer untuk multiple languages
- Scene graph analyzer untuk Godot
- Patch generator dan auto-fix system
- Code quality metrics dan review

### 5. Security Features
- Single-user access (085119887826 only)
- 2FA dengan TOTP
- Fingerprint authentication
- Encrypted storage
- Session management dan audit log

### 6. Revenue Optimization AI
- Ad placement analyzer
- IAP strategy optimizer
- Player retention analyzer
- A/B test automation
- Revenue predictor

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma, SQLite
- **Real-time**: WebSocket
- **Security**: JWT, bcrypt, speakeasy
- **Build Tools**: Godot headless, Termux

## Installation

### Prerequisites
- Node.js 18+
- Termux (Android)
- Godot 4.2+ (for APK building)

### Setup

1. Clone repository:
```bash
git clone https://github.com/username/feac-wa-mini.git
cd feac-wa-mini
```

2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
npx prisma generate
npx prisma db push
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start development server:
```bash
npm run dev
```

## Usage

### Login
- Akses hanya untuk nomor telepon: **085119887826**
- Verifikasi dengan 2FA (TOTP) atau fingerprint

### Commands
- `/build-apk` - Build APK menggunakan Godot
- `/autofix` - Jalankan auto-fix untuk kode
- `/deploy` - Deploy ke production
- `/analyze` - Analisis kode dengan AI Core

### Termux Integration
1. Install Termux di Android
2. Jalankan script setup:
```bash
./scripts/setup-termux.sh
```
3. Hubungkan dengan FEAC WA Mini melalui WebSocket

### NeoEngine Integration
1. Pastikan NeoEngine berjalan
2. Configure connection di settings
3. Monitor events di room NeoEngine

## Project Structure

```
feac-wa-mini/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── chat/           # Chat interface
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── chat-header.tsx
│   │   ├── chat-messages.tsx
│   │   ├── chat-input.tsx
│   │   └── room-selector.tsx
│   ├── lib/                # Core libraries
│   │   ├── auth-context.tsx
│   │   ├── trpc.ts
│   │   ├── websocket.ts
│   │   ├── termux-bridge.ts
│   │   ├── neoengine.ts
│   │   ├── ai-core.ts
│   │   └── revenue-ai.ts
│   └── server/             # Server-side code
│       ├── trpc/
│       └── websocket.ts
├── scripts/                # Build and utility scripts
│   ├── build-apk.sh
│   ├── autofix.sh
│   └── github.sh
├── prisma/                 # Database schema
├── public/                 # Static files
└── README.md
```

## Configuration

### Environment Variables
```env
DATABASE_URL="file:./feac-wa-mini.db"
JWT_SECRET="your-jwt-secret"
NEOENGINE_URL="http://localhost:8080"
NEOENGINE_API_KEY="your-api-key"
```

### Termux Setup
```bash
# Install required packages
pkg update
pkg install git nodejs-lts python
pkg install openjdk-17 wget unzip

# Setup Godot
mkdir -p ~/godot
cd ~/godot
wget https://downloads.tuxfamily.org/godotengine/4.2.1/Godot_v4.2.1-stable_linux.arm64.zip
unzip Godot_v4.2.1-stable_linux.arm64.zip
```

## Development

### Adding New Features
1. Create component di `src/components/`
2. Add tRPC router di `src/server/trpc/router.ts`
3. Update database schema jika diperlukan
4. Add WebSocket handlers di `src/server/websocket.ts`

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production
```bash
# Build application
npm run build

# Start production server
npm start
```

## Deployment

### PWA Deployment
1. Build application:
```bash
npm run build
```

2. Deploy to static hosting (Vercel, Netlify, etc.)

### APK Deployment
1. Build APK:
```bash
./scripts/build-apk.sh
```

2. APK akan tersedia di `/sdcard/Documents/Dikri/apk-release.apk`

## Security Considerations

- Akses terbatas untuk user 085119887826
- Semua data sensitif dienkripsi
- Session timeout setelah 24 jam
- Audit logging untuk semua aktivitas
- 2FA wajib untuk login

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Pastikan server berjalan di port yang benar
   - Check firewall settings
   - Verify JWT token

2. **Termux Command Failed**
   - Pastikan Termux memiliki permission
   - Check path configuration
   - Verify Godot installation

3. **Build APK Failed**
   - Pastikan Godot export templates terinstall
   - Check Android SDK configuration
   - Verify project structure

### Logs
- Application logs: `logs/app.log`
- Build logs: `logs/build.log`
- Error logs: `logs/error.log`

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Untuk support dan pertanyaan:
- Email: support@feac-mini.com
- WhatsApp: 085119887826 (Admin)
- Documentation: [Link Docs]

---

**Note**: Aplikasi ini dikembangkan khusus untuk user dengan nomor telepon 085119887826. Akses dibatasi untuk keamanan dan privacy.