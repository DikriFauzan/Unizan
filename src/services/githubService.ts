import { AppSettings } from '../types';

export interface GithubFile {
    name: string;
    path: string;
    type: 'file' | 'dir';
    sha: string;
}

export const fetchRepoTree = async (settings: AppSettings, path: string = ''): Promise<GithubFile[]> => {
    if (!settings.githubToken || !settings.githubRepo) return [];
    try {
        const url = `https://api.github.com/repos/${settings.githubRepo}/contents/${path}`;
        const res = await fetch(url, { headers: { Authorization: `token ${settings.githubToken}` } });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.map((item: any) => ({ name: item.name, path: item.path, type: item.type, sha: item.sha })) : [];
    } catch(e) { return []; }
};

export const fetchFileContent = async (settings: AppSettings, path: string): Promise<string> => {
     if (!settings.githubToken || !settings.githubRepo) return "";
     try {
        const url = `https://api.github.com/repos/${settings.githubRepo}/contents/${path}`;
        const res = await fetch(url, { headers: { Authorization: `token ${settings.githubToken}` } });
        const data = await res.json();
        return decodeURIComponent(escape(atob(data.content)));
    } catch (e) { return ""; }
};

export const commitFileToGithub = async (settings: AppSettings, filePath: string, content: string, message: string) => {
    if (!settings.githubToken || !settings.githubRepo) throw new Error("Config Missing");
    const baseUrl = `https://api.github.com/repos/${settings.githubRepo}/contents/${filePath}`;
    let sha = null;
    try {
        const get = await fetch(baseUrl, { headers: { Authorization: `token ${settings.githubToken}` }});
        if(get.ok) sha = (await get.json()).sha;
    } catch(e){}
    const body: any = { message, content: btoa(unescape(encodeURIComponent(content))) };
    if(sha) body.sha = sha;
    const res = await fetch(baseUrl, {
        method: 'PUT',
        headers: { Authorization: `token ${settings.githubToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error("Commit Failed");
    return await res.json();
};

export const triggerWorkflow = async (settings: AppSettings, workflowFileName: string, inputs: { build_target: string, build_mode: string }) => {
    if (!settings.githubToken || !settings.githubRepo) throw new Error("GitHub Config Missing");
    const url = `https://api.github.com/repos/${settings.githubRepo}/actions/workflows/${workflowFileName}/dispatches`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `token ${settings.githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ref: 'main', inputs: inputs })
    });
    if (!res.ok) throw new Error("Workflow Trigger Failed");
    return true;
};
