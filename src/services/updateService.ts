import { AppSettings } from '../types';

export interface ReleaseInfo {
    tag: string;
    url: string;
    body: string;
    published_at: string;
}

export const checkGithubUpdate = async (settings: AppSettings, currentVersion: string): Promise<ReleaseInfo | null> => {
    if (!settings.githubRepo) return null;
    
    try {
        // Fetch latest release from GitHub API
        const response = await fetch(`https://api.github.com/repos/${settings.githubRepo}/releases/latest`, {
            headers: settings.githubToken ? { Authorization: `token ${settings.githubToken}` } : {}
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        const remoteTag = data.tag_name; // e.g., "v45-ota"
        
        // Simple string comparison or logic to strip 'v' and compare numbers
        // Ideally use a semver library, here we do simple check
        if (remoteTag !== currentVersion && remoteTag > currentVersion) {
            const asset = data.assets.find((a: any) => a.name === 'feac_neural_patch.zip');
            return {
                tag: remoteTag,
                url: asset ? asset.browser_download_url : data.html_url,
                body: data.body || 'Performance improvements and bug fixes.',
                published_at: data.published_at
            };
        }
    } catch (e) {
        console.error("Update Check Failed", e);
    }
    return null;
};

// In a real APK/Cordova environment, this would write to the filesystem.
// In this Web/Termux version, we simulate the "Hot Swap" by updating local storage/cache.
export const performHotUpdate = async (url: string, onProgress: (p: number) => void): Promise<boolean> => {
    try {
        onProgress(10);
        // Simulate download time
        await new Promise(r => setTimeout(r, 1000));
        onProgress(40);
        
        // In a real scenario:
        // 1. Download ZIP blob
        // 2. Extract to local folder
        // 3. Update 'index.html' reference
        
        await new Promise(r => setTimeout(r, 1500));
        onProgress(80);
        
        await new Promise(r => setTimeout(r, 500));
        onProgress(100);
        
        return true;
    } catch (e) {
        return false;
    }
};
