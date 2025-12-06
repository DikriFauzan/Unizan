#!/bin/bash

# FEAC WA Mini Termux Setup Script
# This script sets up Termux environment for FEAC WA Mini

set -e

echo "🚀 FEAC WA Mini Termux Setup"
echo "==========================="

# Update packages
echo "📦 Updating packages..."
pkg update && pkg upgrade -y

# Install required packages
echo "🔧 Installing dependencies..."
pkg install -y \
    git \
    nodejs-lts \
    python \
    python-pip \
    wget \
    unzip \
    curl \
    openssl-tool \
    termux-api \
    termux-tools

# Install additional tools for Android development
echo "📱 Installing Android development tools..."
pkg install -y \
    openjdk-17 \
    aapt \
    apksigner \
    zipalign \
    dx

# Setup Node.js environment
echo "⚙️  Setting up Node.js environment..."
npm install -g npm@latest

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /sdcard/Documents/Dikri
mkdir -p /sdcard/Documents/Dikri/projects
mkdir -p /sdcard/Documents/Dikri/builds
mkdir -p /sdcard/Documents/Dikri/logs

# Setup Godot
echo "🎮 Setting up Godot..."
mkdir -p /data/data/com.termux/files/home/godot
cd /data/data/com.termux/files/home/godot

# Download Godot headless (adjust version as needed)
GODOT_VERSION="4.2.1"
wget -q --show-progress "https://downloads.tuxfamily.org/godotengine/${GODOT_VERSION}/Godot_v${GODOT_VERSION}-stable_linux.arm64.zip"

# Extract Godot
unzip -q "Godot_v${GODOT_VERSION}-stable_linux.arm64.zip"
mv "Godot_v${GODOT_VERSION}-stable_linux.arm64" godot
chmod +x godot

# Create symlink for easy access
ln -sf /data/data/com.termux/files/home/godot/godot /data/data/com.termux/files/usr/bin/godot

# Download Godot export templates
echo "📦 Downloading export templates..."
wget -q --show-progress "https://downloads.tuxfamily.org/godotengine/${GODOT_VERSION}/Godot_v${GODOT_VERSION}-stable_export_templates.tpz"
mkdir -p /data/data/com.termux/files/home/.local/share/godot/export_templates/${GODOT_VERSION}.stable
unzip -q "Godot_v${GODOT_VERSION}-stable_export_templates.tpz" -d /data/data/com.termux/files/home/.local/share/godot/export_templates/${GODOT_VERSION}.stable

# Setup Git configuration
echo "🔐 Setting up Git..."
git config --global user.name "FEAC WA Mini"
git config --global user.email "085119887826@feac.mini"
git config --global init.defaultBranch main

# Create SSH key for GitHub (if needed)
if [ ! -f /data/data/com.termux/files/home/.ssh/id_rsa ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t rsa -b 4096 -f /data/data/com.termux/files/home/.ssh/id_rsa -N ""
    echo "SSH key generated. Add this to GitHub:"
    cat /data/data/com.termux/files/home/.ssh/id_rsa.pub
fi

# Setup environment variables
echo "⚙️  Setting up environment..."
cat << 'EOF' > /data/data/com.termux/files/home/.bashrc.feac
# FEAC WA Mini Environment
export FEAC_MODE="termux"
export FEAC_BASE_PATH="/sdcard/Documents/Dikri"
export GODOT_PATH="/data/data/com.termux/files/home/godot/godot"
export ANDROID_SDK_ROOT="/data/data/com.termux/files/home/android-sdk"

# Add to PATH
export PATH=$PATH:/data/data/com.termux/files/home/godot
export PATH=$PATH:/data/data/com.termux/files/home/.local/bin

# Aliases for convenience
alias feac-build="/sdcard/Documents/Dikri/scripts/build-apk.sh"
alias feac-fix="/sdcard/Documents/Dikri/scripts/autofix.sh"
alias feac-deploy="/sdcard/Documents/Dikri/scripts/github.sh deploy"
alias feac-status="/sdcard/Documents/Dikri/scripts/github.sh status"
EOF

# Add to .bashrc
echo "source /data/data/com.termux/files/home/.bashrc.feac" >> /data/data/com.termux/files/home/.bashrc

# Install Python packages for AI Core
echo "🤖 Installing AI Core dependencies..."
pip install --upgrade pip
pip install \
    numpy \
    pandas \
    scikit-learn \
    tensorflow \
    transformers \
    requests \
    beautifulsoup4 \
    pyyaml \
    python-dotenv

# Setup Android SDK (if needed for advanced features)
echo "📱 Setting up Android SDK..."
mkdir -p /data/data/com.termux/files/home/android-sdk
cd /data/data/com.termux/files/home/android-sdk

# Download command line tools
wget -q --show-progress "https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip"
unzip -q commandlinetools-linux-9477386_latest.zip

# Setup SDK manager
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/

# Accept licenses and install packages
yes | ./cmdline-tools/latest/bin/sdkmanager --licenses
./cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Create build script shortcuts
echo "📜 Creating build shortcuts..."
cat << 'EOF' > /data/data/com.termux/files/usr/bin/feac-build
#!/bin/bash
/sdcard/Documents/Dikri/scripts/build-apk.sh "$@"
EOF
chmod +x /data/data/com.termux/files/usr/bin/feac-build

cat << 'EOF' > /data/data/com.termux/files/usr/bin/feac-fix
#!/bin/bash
/sdcard/Documents/Dikri/scripts/autofix.sh "$@"
EOF
chmod +x /data/data/com.termux/files/usr/bin/feac-fix

cat << 'EOF' > /data/data/com.termux/files/usr/bin/feac-deploy
#!/bin/bash
/sdcard/Documents/Dikri/scripts/github.sh deploy "$@"
EOF
chmod +x /data/data/com.termux/files/usr/bin/feac-deploy

# Setup Termux:API for device features
echo "📱 Setting up Termux:API..."
if [ -f /data/data/com.termux/files/home/.termux/termux.properties ]; then
    # Enable extra keys
    cat << 'EOF' >> /data/data/com.termux/files/home/.termux/termux.properties
extra-keys = [['ESC','/','-','HOME','UP','END','PGUP'],['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]
EOF
fi

# Create startup script
echo "🚀 Creating startup script..."
cat << 'EOF' > /data/data/com.termux/files/home/feac-startup.sh
#!/bin/bash
# FEAC WA Mini Startup Script

echo "🚀 Starting FEAC WA Mini environment..."

# Start Termux:API daemon
termux-wake-lock

# Start WebSocket server (if needed)
# cd /sdcard/Documents/Dikri
# node websocket-server.js &

# Show status
echo "✅ FEAC WA Mini environment ready!"
echo "📱 Available commands:"
echo "  feac-build    - Build APK"
echo "  feac-fix      - Auto-fix code"
echo "  feac-deploy   - Deploy to GitHub"
echo "  feac-status   - Check status"
EOF
chmod +x /data/data/com.termux/files/home/feac-startup.sh

# Final setup
echo ""
echo "✅ Setup completed successfully!"
echo "================================"
echo ""
echo "📱 Termux environment ready for FEAC WA Mini"
echo ""
echo "🔧 Available commands:"
echo "  feac-build    - Build APK"
echo "  feac-fix      - Auto-fix code issues"
echo "  feac-deploy   - Deploy to GitHub"
echo "  feac-status   - Check repository status"
echo ""
echo "📂 Project directory: /sdcard/Documents/Dikri"
echo "🎮 Godot path: /data/data/com.termux/files/home/godot/godot"
echo "🔑 SSH key: /data/data/com.termux/files/home/.ssh/id_rsa"
echo ""
echo "🚀 To start, run: source /data/data/com.termux/files/home/.bashrc"
echo "   Then: /data/data/com.termux/files/home/feac-startup.sh"
echo ""
echo "📋 Next steps:"
echo "1. Add SSH key to GitHub: cat /data/data/com.termux/files/home/.ssh/id_rsa.pub"
echo "2. Clone your project: git clone your-repo-url /sdcard/Documents/Dikri"
echo "3. Start building: feac-build"
echo ""
echo "✨ FEAC WA Mini Termux setup complete!"