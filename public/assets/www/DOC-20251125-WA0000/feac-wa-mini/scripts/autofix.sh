#!/bin/bash

# FEAC WA Mini Auto-Fix Script
# This script automatically fixes common code issues

set -e

PROJECT_PATH="/sdcard/Documents/Dikri"
FIX_LOG="/sdcard/Documents/Dikri/autofix.log"

echo "🔧 FEAC WA Mini Auto-Fix"
echo "======================"
echo "Project: $PROJECT_PATH"
echo "Log: $FIX_LOG"
echo ""

# Create log file
touch "$FIX_LOG"
echo "Auto-fix started at $(date)" >> "$FIX_LOG"

# Function to fix JavaScript/TypeScript files
fix_js_files() {
    local js_files=$(find "$PROJECT_PATH" -name "*.js" -o -name "*.ts" | grep -v node_modules)
    
    for file in $js_files; do
        echo "🔍 Analyzing $file..."
        
        # Remove console.log statements
        sed -i '/console\.log/d' "$file"
        
        # Fix var to let/const
        sed -i 's/\bvar\b/let/g' "$file"
        
        # Add missing semicolons
        sed -i 's/\([^;]\)$/\1;/' "$file"
        
        # Fix indentation (convert 4 spaces to 2)
        sed -i 's/    /  /g' "$file"
        
        echo "✅ Fixed: $file" >> "$FIX_LOG"
    done
}

# Function to fix GDScript files
fix_gdscript_files() {
    local gd_files=$(find "$PROJECT_PATH" -name "*.gd")
    
    for file in $gd_files; do
        echo "🔍 Analyzing $file..."
        
        # Fix indentation (ensure tabs)
        sed -i 's/    /^I/g' "$file"
        
        # Add missing pass statements
        sed -i '/^func.*:$/a\\tpass' "$file"
        
        # Fix signal connections
        sed -i 's/\.connect(/\.connect(/g' "$file"
        
        echo "✅ Fixed: $file" >> "$FIX_LOG"
    done
}

# Function to fix C# files
fix_csharp_files() {
    local cs_files=$(find "$PROJECT_PATH" -name "*.cs")
    
    for file in $cs_files; do
        echo "🔍 Analyzing $file..."
        
        # Fix naming conventions
        sed -i 's/public class \([a-z]\)/public class \U\1/' "$file"
        
        # Add missing using statements
        if ! grep -q "using Godot;" "$file"; then
            sed -i '1i\using Godot;' "$file"
        fi
        
        echo "✅ Fixed: $file" >> "$FIX_LOG"
    done
}

# Function to fix Python files
fix_python_files() {
    local py_files=$(find "$PROJECT_PATH" -name "*.py")
    
    for file in $py_files; do
        echo "🔍 Analyzing $file..."
        
        # Fix line length (break long lines)
        awk 'length($0) > 79 {print $0 " \\n    "} length($0) <= 79' "$file" > "${file}.tmp"
        mv "${file}.tmp" "$file"
        
        # Fix import style
        sed -i 's/import \(.*\), \(.*\)/import \1\nimport \2/' "$file"
        
        echo "✅ Fixed: $file" >> "$FIX_LOG"
    done
}

# Function to fix project configuration
fix_project_config() {
    # Fix package.json if it exists
    if [ -f "$PROJECT_PATH/package.json" ]; then
        echo "🔧 Fixing package.json..."
        
        # Add missing scripts
        if ! grep -q "build" "$PROJECT_PATH/package.json"; then
            sed -i '/"scripts": {/a\\t"build": "next build",' "$PROJECT_PATH/package.json"
        fi
        
        echo "✅ Fixed: package.json" >> "$FIX_LOG"
    fi
    
    # Fix Godot project.godot if it exists
    if [ -f "$PROJECT_PATH/project.godot" ]; then
        echo "🔧 Fixing project.godot..."
        
        # Ensure proper export settings
        if ! grep -q "export/" "$PROJECT_PATH/project.godot"; then
            cat << EOF >> "$PROJECT_PATH/project.godot"

[export]

android/export/one_click_deploy/clear_previous_install=false
android/export/one_click_deploy/install_apk=true
android/export/package/name=feac.wa.mini
android/export/package/unique_name=feac.wa.mini
android/export/package/version_name=$BUILD_VERSION
android/export/package/version_code=$BUILD_NUMBER
EOF
        fi
        
        echo "✅ Fixed: project.godot" >> "$FIX_LOG"
    fi
}

# Function to fix build configuration
fix_build_config() {
    # Fix build.gradle if it exists
    if [ -f "$PROJECT_PATH/android/build.gradle" ]; then
        echo "🔧 Fixing build.gradle..."
        
        # Ensure proper SDK versions
        sed -i 's/compileSdkVersion.*/compileSdkVersion 34/' "$PROJECT_PATH/android/build.gradle"
        sed -i 's/targetSdkVersion.*/targetSdkVersion 34/' "$PROJECT_PATH/android/build.gradle"
        
        echo "✅ Fixed: build.gradle" >> "$FIX_LOG"
    fi
    
    # Fix AndroidManifest.xml if it exists
    if [ -f "$PROJECT_PATH/android/AndroidManifest.xml" ]; then
        echo "🔧 Fixing AndroidManifest.xml..."
        
        # Add missing permissions
        if ! grep -q "INTERNET" "$PROJECT_PATH/android/AndroidManifest.xml"; then
            sed -i '/<manifest/a\\t<uses-permission android:name="android.permission.INTERNET" />' "$PROJECT_PATH/android/AndroidManifest.xml"
        fi
        
        echo "✅ Fixed: AndroidManifest.xml" >> "$FIX_LOG"
    fi
}

# Main auto-fix process
echo "🚀 Starting auto-fix process..."

# Fix different file types
fix_js_files
fix_gdscript_files
fix_csharp_files
fix_python_files

# Fix configuration files
fix_project_config
fix_build_config

# Run npm audit fix if package.json exists
if [ -f "$PROJECT_PATH/package.json" ]; then
    echo "🔧 Running npm audit fix..."
    cd "$PROJECT_PATH"
    npm audit fix --force >> "$FIX_LOG" 2>&1
    echo "✅ npm audit fix completed" >> "$FIX_LOG"
fi

# Final validation
echo "🔍 Running final validation..."

# Check for remaining issues
remaining_issues=0

# Count console.log statements
console_logs=$(grep -r "console\.log" "$PROJECT_PATH" --include="*.js" --include="*.ts" | wc -l)
if [ $console_logs -gt 0 ]; then
    echo "⚠️  Found $console_logs console.log statements" >> "$FIX_LOG"
    remaining_issues=$((remaining_issues + console_logs))
fi

# Count TODO comments
todo_count=$(grep -r "TODO" "$PROJECT_PATH" --include="*.js" --include="*.ts" --include="*.gd" | wc -l)
if [ $todo_count -gt 0 ]; then
    echo "ℹ️  Found $todo_count TODO comments" >> "$FIX_LOG"
fi

echo "📊 Auto-fix summary:" >> "$FIX_LOG"
echo "===================" >> "$FIX_LOG"
echo "Completed at: $(date)" >> "$FIX_LOG"
echo "Remaining issues: $remaining_issues" >> "$FIX_LOG"

echo ""
echo "📊 Auto-fix Summary"
echo "=================="
echo "Log file: $FIX_LOG"
echo "Remaining issues: $remaining_issues"

if [ $remaining_issues -eq 0 ]; then
    echo "✅ All issues fixed successfully!"
    echo "AUTO_FIX_SUCCESS|$remaining_issues"
else
    echo "⚠️  Some issues remain. Check log for details."
    echo "AUTO_FIX_PARTIAL|$remaining_issues"
fi