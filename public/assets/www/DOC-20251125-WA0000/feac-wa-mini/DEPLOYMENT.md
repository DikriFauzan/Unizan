# FEAC WA Mini - Deployment Guide

## Quick Start

### 1. Prerequisites
- Android device with Termux installed
- Node.js 18+ (for development)
- Godot 4.2+ (for APK building)
- Git

### 2. Installation

#### Option A: Direct Installation
```bash
# Clone repository
git clone https://github.com/username/feac-wa-mini.git
cd feac-wa-mini

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

#### Option B: Termux Installation
```bash
# Download and run setup script
wget https://raw.githubusercontent.com/username/feac-wa-mini/main/scripts/setup-termux.sh
chmod +x setup-termux.sh
./setup-termux.sh
```

### 3. Configuration

1. Copy environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration
3. Ensure phone number is set to `085119887826`

### 4. First Run

1. Start the application:
```bash
npm run dev
```

2. Open browser to `http://localhost:3000`
3. Login with phone number: `085119887826`
4. Complete 2FA setup

## Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Start Production Server
```bash
npm start
```

### 3. Deploy as PWA
- Deploy to static hosting (Vercel, Netlify)
- Configure custom domain
- Enable HTTPS

### 4. Setup Termux Bridge
```bash
# On Android device with Termux
./scripts/setup-termux.sh

# Connect to WebSocket
# Configure in app settings
```

## APK Building

### 1. Setup Godot
```bash
# Termux will auto-install Godot
# Or manually install from: https://godotengine.org
```

### 2. Build APK
```bash
# Via app interface
# Go to Termux-Bridge room
# Send command: /build-apk

# Or via script
./scripts/build-apk.sh
```

### 3. APK Output
- Location: `/sdcard/Documents/Dikri/apk-release.apk`
- Signed and aligned automatically

## NeoEngine Integration

### 1. Configure NeoEngine
```bash
# Set NeoEngine URL in .env
NEOENGINE_URL=http://your-neoengine-server:8080
```

### 2. Connect to NeoEngine
- Go to NeoEngine room in app
- Monitor events and commands
- Send commands via chat interface

## Security Setup

### 1. 2FA Configuration
- Scan QR code with authenticator app
- Save backup codes securely
- Test TOTP verification

### 2. Fingerprint Setup
- Enable fingerprint in settings
- Test fingerprint authentication
- Configure fallback to TOTP

### 3. API Keys
- Generate secure API keys
- Configure in environment variables
- Set proper permissions

## Monitoring

### 1. Application Logs
```bash
# View logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

### 2. Database Monitoring
```bash
# Check database
npx prisma studio

# View metrics
npm run analytics
```

### 3. Health Checks
```bash
# Check WebSocket connection
# Check Termux bridge
# Check NeoEngine connection
```

## Backup & Recovery

### 1. Database Backup
```bash
# Backup SQLite database
cp feac-wa-mini.db feac-wa-mini.db.backup

# Export data
npx prisma db seed
```

### 2. Configuration Backup
```bash
# Backup environment
cp .env .env.backup

# Backup scripts
tar -czf scripts-backup.tar.gz scripts/
```

### 3. Full System Backup
```bash
# Create full backup
tar -czf feac-wa-mini-backup.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=logs \
  .
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check server is running
   - Verify port configuration
   - Check firewall settings

2. **Termux Command Failed**
   - Ensure Termux has storage permission
   - Check path configuration
   - Verify script permissions

3. **Build Failed**
   - Check Godot installation
   - Verify export templates
   - Check Android SDK

4. **Login Failed**
   - Verify phone number (085119887826)
   - Check 2FA configuration
   - Reset if needed

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev

# Check WebSocket messages
DEBUG=websocket npm run dev
```

## Performance Optimization

### 1. Database Optimization
- Add indexes for frequent queries
- Regular database maintenance
- Archive old data

### 2. WebSocket Optimization
- Implement connection pooling
- Optimize message size
- Use compression

### 3. Build Optimization
- Use production builds
- Minimize assets
- Enable caching

## Scaling

### 1. Horizontal Scaling
- Use load balancer
- Multiple server instances
- Shared database

### 2. Vertical Scaling
- Increase server resources
- Optimize code performance
- Use caching

### 3. Monitoring
- Setup monitoring tools
- Alert on failures
- Track performance metrics

## Maintenance

### Regular Tasks
- Update dependencies
- Backup data
- Monitor logs
- Check security

### Monthly Tasks
- Review analytics
- Optimize performance
- Update documentation
- Test disaster recovery

## Support

For issues and support:
- Check logs first
- Review documentation
- Contact support if needed
- Provide detailed error information

---

**Note**: This application is exclusively for phone number 085119887826. All security measures are in place to ensure privacy and data protection.