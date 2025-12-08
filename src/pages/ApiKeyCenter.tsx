import React, { useState } from 'react';
import { Key, PlusCircle } from 'lucide-react';

export default function ApiKeyCenter() {
    const [apiKey, setApiKey] = useState(localStorage.getItem('feac_api_key') || "");

    const save = () => {
        localStorage.setItem('feac_api_key', apiKey);
        alert("API Key saved!");
    };

    return (
        <div className="p-6 text-white h-full">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Key className="text-blue-400"/> API Key Manager
            </h1>

            <div className="bg-[#0f172a] border border-blue-500/40 rounded-xl p-6">
                <h3 className="text-blue-300 text-lg font-bold mb-2">Your API Key</h3>

                <input
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="w-full bg-black/60 text-white p-3 font-mono rounded border border-blue-500/40"
                    placeholder="feac_live_XXXX..."
                />

                <button
                    onClick={save}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
                >
                    <PlusCircle size={20}/> Save Key
                </button>
            </div>
        </div>
    );
}
