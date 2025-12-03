#!/bin/bash

# FEAC WA Mini GitHub Integration Script
# This script handles Git operations for the project

set -e

PROJECT_PATH="/sdcard/Documents/Dikri"
REPO_URL="https://github.com/username/feac-wa-mini.git"
BRANCH="main"
COMMIT_MESSAGE="Auto-commit from FEAC WA Mini"

echo "📦 FEAC WA Mini GitHub Integration"
echo "================================="
echo "Project: $PROJECT_PATH"
echo "Repository: $REPO_URL"
echo "Branch: $BRANCH"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    echo "Installing git..."
    pkg install git -y
fi

# Function to initialize repository
init_repo() {
    echo "🔧 Initializing repository..."
    
    cd "$PROJECT_PATH"
    
    if [ ! -d ".git" ]; then
        git init
        git remote add origin "$REPO_URL"
        echo "✅ Repository initialized"
    else
        echo "✅ Repository already exists"
    fi
}

# Function to clone repository
clone_repo() {
    local repo_url=$1
    local target_path=$2
    
    echo "📥 Cloning repository..."
    
    if [ -d "$target_path" ]; then
        echo "⚠️  Directory already exists: $target_path"
        return 1
    fi
    
    git clone "$repo_url" "$target_path"
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository cloned successfully"
        return 0
    else
        echo "❌ Failed to clone repository"
        return 1
    fi
}

# Function to pull latest changes
pull_changes() {
    echo "⬇️  Pulling latest changes..."
    
    cd "$PROJECT_PATH"
    
    # Stash local changes
    git stash
    
    # Pull from remote
    git pull origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes pulled successfully"
        
        # Restore stashed changes
        git stash pop
        return 0
    else
        echo "❌ Failed to pull changes"
        return 1
    fi
}

# Function to commit changes
commit_changes() {
    local message=$1
    
    echo "💾 Committing changes..."
    
    cd "$PROJECT_PATH"
    
    # Add all changes
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        echo "ℹ️  No changes to commit"
        return 0
    fi
    
    # Commit changes
    git commit -m "$message"
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes committed successfully"
        return 0
    else
        echo "❌ Failed to commit changes"
        return 1
    fi
}

# Function to push changes
push_changes() {
    echo "⬆️  Pushing changes..."
    
    cd "$PROJECT_PATH"
    
    git push origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes pushed successfully"
        return 0
    else
        echo "❌ Failed to push changes"
        return 1
    fi
}

# Function to create branch
create_branch() {
    local branch_name=$1
    
    echo "🌿 Creating branch: $branch_name..."
    
    cd "$PROJECT_PATH"
    
    git checkout -b "$branch_name"
    
    if [ $? -eq 0 ]; then
        echo "✅ Branch created successfully"
        return 0
    else
        echo "❌ Failed to create branch"
        return 1
    fi
}

# Function to switch branch
switch_branch() {
    local branch_name=$1
    
    echo "🔄 Switching to branch: $branch_name..."
    
    cd "$PROJECT_PATH"
    
    git checkout "$branch_name"
    
    if [ $? -eq 0 ]; then
        echo "✅ Switched to branch successfully"
        return 0
    else
        echo "❌ Failed to switch branch"
        return 1
    fi
}

# Function to merge branch
merge_branch() {
    local source_branch=$1
    local target_branch=${2:-"main"}
    
    echo "🔀 Merging $source_branch into $target_branch..."
    
    cd "$PROJECT_PATH"
    
    # Switch to target branch
    git checkout "$target_branch"
    
    # Merge source branch
    git merge "$source_branch"
    
    if [ $? -eq 0 ]; then
        echo "✅ Merge completed successfully"
        return 0
    else
        echo "❌ Merge failed - conflicts detected"
        return 1
    fi
}

# Function to get status
get_status() {
    echo "📊 Repository Status"
    echo "==================="
    
    cd "$PROJECT_PATH"
    
    echo "Current branch: $(git branch --show-current)"
    echo ""
    echo "Git status:"
    git status
    echo ""
    echo "Recent commits:"
    git log --oneline -5
}

# Function to create tag
create_tag() {
    local tag_name=$1
    local message=${2:-"Release $tag_name"}
    
    echo "🏷️  Creating tag: $tag_name..."
    
    cd "$PROJECT_PATH"
    
    git tag -a "$tag_name" -m "$message"
    
    if [ $? -eq 0 ]; then
        echo "✅ Tag created successfully"
        
        # Push tag
        git push origin "$tag_name"
        
        if [ $? -eq 0 ]; then
            echo "✅ Tag pushed successfully"
            return 0
        else
            echo "❌ Failed to push tag"
            return 1
        fi
    else
        echo "❌ Failed to create tag"
        return 1
    fi
}

# Function to handle deployment
deploy_to_production() {
    echo "🚀 Deploying to production..."
    
    # Ensure we're on main branch
    switch_branch "main"
    
    # Pull latest changes
    pull_changes
    
    # Run tests (if any)
    if [ -f "package.json" ]; then
        echo "🧪 Running tests..."
        npm test
        if [ $? -ne 0 ]; then
            echo "❌ Tests failed"
            return 1
        fi
    fi
    
    # Build project
    if [ -f "package.json" ]; then
        echo "🔨 Building project..."
        npm run build
        if [ $? -ne 0 ]; then
            echo "❌ Build failed"
            return 1
        fi
    fi
    
    # Create release tag
    local version=$(date +"v%Y.%m.%d-%H%M%S")
    create_tag "$version" "Production release"
    
    echo "✅ Deployment completed successfully"
    echo "DEPLOY_SUCCESS|$version"
}

# Main command handler
case "$1" in
    init)
        init_repo
        ;;
    clone)
        clone_repo "$2" "$3"
        ;;
    pull)
        pull_changes
        ;;
    commit)
        commit_changes "${2:-$COMMIT_MESSAGE}"
        ;;
    push)
        push_changes
        ;;
    status)
        get_status
        ;;
    branch)
        create_branch "$2"
        ;;
    switch)
        switch_branch "$2"
        ;;
    merge)
        merge_branch "$2" "$3"
        ;;
    tag)
        create_tag "$2" "$3"
        ;;
    deploy)
        deploy_to_production
        ;;
    full-deploy)
        # Full deployment pipeline
        echo "🔄 Starting full deployment pipeline..."
        
        # Commit changes
        commit_changes "Auto-commit before deployment"
        
        # Push changes
        push_changes
        
        # Deploy to production
        deploy_to_production
        
        echo "✅ Full deployment completed!"
        ;;
    *)
        echo "Usage: $0 {init|clone|pull|commit|push|status|branch|switch|merge|tag|deploy|full-deploy}"
        echo ""
        echo "Commands:"
        echo "  init              - Initialize repository"
        echo "  clone <url> <path> - Clone repository"
        echo "  pull              - Pull latest changes"
        echo "  commit [message]  - Commit changes"
        echo "  push              - Push changes"
        echo "  status            - Show repository status"
        echo "  branch <name>     - Create new branch"
        echo "  switch <name>     - Switch to branch"
        echo "  merge <source> [target] - Merge branches"
        echo "  tag <name> [message] - Create tag"
        echo "  deploy            - Deploy to production"
        echo "  full-deploy       - Full deployment pipeline"
        exit 1
        ;;
esac