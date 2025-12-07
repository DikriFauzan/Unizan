#!/bin/bash

# FEAC WA Mini APK Builder Script
# This script builds APK using Godot headless mode

set -e

# Configuration
GODOT_PATH="/data/data/com.termux/files/home/godot/godot"
PROJECT_PATH="/sdcard/Documents/Dikri/feac-wa-mini"
OUTPUT_PATH="/sdcard/Documents/Dikri/apk-release.apk"
EXPORT_TEMPLATE="Android"
BUILD_VERSION=${1:-"5.0.0"}
BUILD_NUMBER=${2:-"1"}

echo "🔨 FEAC WA Mini APK Builder"
echo "=========================="
echo "Project: $PROJECT_PATH"
echo "Output: $OUTPUT_PATH"
echo "Version: $BUILD_VERSION"
echo "Build Number: $BUILD_NUMBER"
echo ""

# Check if Godot is installed
if [ ! -f "$GODOT_PATH" ]; then
    echo "❌ Godot not found at $GODOT_PATH"
    echo "Installing Godot..."
    
    # Download and install Godot
    cd /data/data/com.termux/files/home
    wget https://downloads.tuxfamily.org/godotengine/4.2.1/Godot_v4.2.1-stable_linux.arm64.zip
    unzip Godot_v4.2.1-stable_linux.arm64.zip
    mv Godot_v4.2.1-stable_linux.arm64 godot
    chmod +x godot
fi

# Check if project exists
if [ ! -f "$PROJECT_PATH/project.godot" ]; then
    echo "❌ Project not found at $PROJECT_PATH"
    exit 1
fi

# Build APK
echo "🚀 Building APK..."
cd "$PROJECT_PATH"

# Export project
$GODOT_PATH --headless --export-release "$EXPORT_TEMPLATE" "$OUTPUT_PATH"

if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    echo "Output: $OUTPUT_PATH"
    
    # Sign APK if keystore exists
    KEYSTORE_PATH="/sdcard/Documents/Dikri/keystore.jks"
    if [ -f "$KEYSTORE_PATH" ]; then
        echo "🔐 Signing APK..."
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$KEYSTORE_PATH" "$OUTPUT_PATH" feac-wa-mini
        
        # Align APK
        aligned_apk="/sdcard/Documents/Dikri/apk-release-aligned.apk"
        zipalign -v 4 "$OUTPUT_PATH" "$aligned_apk"
        mv "$aligned_apk" "$OUTPUT_PATH"
        
        echo "✅ APK signed and aligned!"
    fi
    
    # Get file size
    APK_SIZE=$(ls -lh "$OUTPUT_PATH" | awk '{print $5}')
    echo "📦 APK Size: $APK_SIZE"
    
    # Send success notification
    echo "🎉 Build completed successfully!"
    
    # Return build info
    echo "BUILD_SUCCESS|$OUTPUT_PATH|$BUILD_VERSION|$BUILD_NUMBER"
else
    echo "❌ Build failed!"
    exit 1
fi
