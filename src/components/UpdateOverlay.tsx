import React from 'react';
import { CloudLightning, Download, RefreshCw, X, Zap } from 'lucide-react';
import { ReleaseInfo } from '../services/updateService';

interface Props {
    info: ReleaseInfo;
    onUpdate: () => void;
    onDismiss: () => void;
    isUpdating: boolean;
    progress: number;
}

export const UpdateOverlay: React.FC<Props> = ({ info, onUpdate, onDismiss, isUpdating, progress }) => {
    return (
        <div className="absolute top-4 right-4 z-50 animate-fade-in-up max-w-sm w-full">
            <div className="bg-[#111b21]/95 backdrop-blur-md border border-green-500/30 shadow-2xl rounded-lg overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-start bg-green-900/20">
                    <div className="flex gap-3">
                        <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                            {isUpdating ? <RefreshCw size={20} className="animate-spin"/> : <CloudLightning size={20} />}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">NEURAL CORE UPDATE</h3>
                            <p className="text-xs text-green-300 font-mono">{info.tag}</p>
                        </div>
                    </div>
                    {!isUpdating && <button onClick={onDismiss}><X size={16} className="text-slate-400 hover:text-white"/></button>}
                </div>
                
                <div className="p-4">
                    <div className="text-xs text-slate-300 mb-4 max-h-24 overflow-y-auto bg-black/20 p-2 rounded">
                        {info.body}
                    </div>
                    
                    {isUpdating ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-green-400 font-bold">
                                <span>DOWNLOADING PATCH...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={onUpdate}
                            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                        >
                            <Download size={14} /> INSTALL UPDATE (HOT SWAP)
                        </button>
                    )}
                </div>
                
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"></div>
            </div>
        </div>
    );
};
