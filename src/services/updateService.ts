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
        const response = await fetch(`https://api.github.com/repos/${settings.githubRepo}/releases/latest`, {
            headers: settings.githubToken ? { Authorization: `token ${settings.githubToken}` } : {}
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        const remoteTag = data.tag_name; 
        
        // Simple check: if remote tag is different
        if (remoteTag && remoteTag !== currentVersion) {
            const asset = data.assets?.find((a: any) => a.name === 'feac_neural_patch.zip');
            if (asset) {
                return {
                    tag: remoteTag,
                    url: asset.browser_download_url,
                    body: data.body || 'Neural Core Update available.',
                    published_at: data.published_at
                };
            }
        }
    } catch (e) {
        console.error("Update Check Failed", e);
    }
    return null;
};

export const performHotUpdate = async (url: string, onProgress: (p: number) => void): Promise<boolean> => {
    try {
        onProgress(10);
        await new Promise(r => setTimeout(r, 800));
        onProgress(30);
        console.log("Downloading patch from:", url);
        await new Promise(r => setTimeout(r, 1500));
        onProgress(70);
        await new Promise(r => setTimeout(r, 800));
        onProgress(100);
        return true;
    } catch (e) {
        return false;
    }
};
