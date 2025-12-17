
import React, { useState } from 'react';
import { PlayerState, Title } from '../types';
import { generateChaosTitle } from '../geminiService';
import { ShieldCheck, Zap, Sparkles, Loader2 } from 'lucide-react';
import { RARITY_CONFIG } from '../constants';
import { audio } from '../audioService';

interface FusionAltarProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  addTitle: (title: Title) => void;
}

const FusionAltar: React.FC<FusionAltarProps> = ({ player, setPlayer, addTitle }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFusing, setIsFusing] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
      audio.playTick();
    } else if (selectedIds.length < 5) {
      setSelectedIds(prev => [...prev, id]);
      audio.playTick();
    }
  };

  const startFusion = async () => {
    if (selectedIds.length < 2 || isFusing) return;
    setIsFusing(true);
    audio.playFusion();

    try {
        const titlesToFuse = player.inventory.filter(t => selectedIds.includes(t.id));
        const chaosTitle = await generateChaosTitle(titlesToFuse);
        
        // Update player state
        setPlayer(prev => ({
            ...prev,
            inventory: prev.inventory.filter(t => !selectedIds.includes(t.id))
        }));
        
        addTitle(chaosTitle);
        setSelectedIds([]);
        audio.playSuccess();
    } catch (err) {
        alert("The fusion was too unstable and collapsed. Try again later.");
    } finally {
        setIsFusing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-cinzel font-bold">Fusion Altar</h2>
        <p className="text-gray-400">Combine 2-5 titles to breach the boundaries of reality. Chaos Fusion may spawn unheard of rarities.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-fuchsia-900/10 border border-fuchsia-500/20 rounded-[3rem] p-12 flex flex-col items-center space-y-10 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-transparent to-transparent opacity-50" />
        
        <div className="flex -space-x-6 min-h-[100px] items-center">
            {selectedIds.length === 0 && (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-fuchsia-500/20 flex items-center justify-center text-fuchsia-500/30 animate-pulse">
                <Zap size={32} />
              </div>
            )}
            {selectedIds.map(id => {
                const t = player.inventory.find(x => x.id === id);
                return (
                    <div 
                      key={id} 
                      className="w-24 h-24 rounded-full bg-black/60 border-2 border-fuchsia-500/40 flex items-center justify-center p-3 text-center group relative cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-2xl backdrop-blur-md" 
                      onClick={() => toggleSelect(id)}
                    >
                        <div className="text-[9px] font-black leading-tight uppercase tracking-tighter" style={{ color: t ? RARITY_CONFIG[t.rarity].color : 'white' }}>
                            {t?.words.map(w => w.text).join(' ')}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-fuchsia-600 flex items-center justify-center text-[10px] font-bold border-2 border-black">X</div>
                    </div>
                );
            })}
        </div>

        <div className="text-center space-y-1 relative z-10">
            <h3 className="text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">IGNITE CHAOS</h3>
            <p className="text-[10px] text-fuchsia-500 uppercase tracking-[0.4em] font-black">AI GENERATED RARITIES</p>
        </div>

        <button
            onClick={startFusion}
            disabled={selectedIds.length < 2 || isFusing}
            className={`px-16 py-5 rounded-full font-cinzel font-bold text-xl transition-all relative overflow-hidden group ${selectedIds.length >= 2 ? 'text-white scale-105 shadow-2xl' : 'text-gray-600'}`}
        >
            <div className={`absolute inset-0 transition-all duration-700 ${selectedIds.length >= 2 ? 'bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-fuchsia-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]' : 'bg-white/5'}`} />
            <span className="relative flex items-center gap-3">
                {isFusing ? <Loader2 className="animate-spin" /> : <Sparkles className="group-hover:rotate-12 transition-transform" />}
                {isFusing ? 'BREACHING REALITY...' : 'START FUSION'}
            </span>
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-cinzel font-bold text-gray-400 uppercase tracking-widest text-sm flex items-center gap-2">
          <Zap size={16} /> Select Titles for Synthesis ({selectedIds.length}/5)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {player.inventory.map(t => (
                <button
                    key={t.id}
                    onClick={() => toggleSelect(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden ${selectedIds.includes(t.id) ? 'bg-fuchsia-500/20 border-fuchsia-500 scale-[1.05] shadow-lg z-10' : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'}`}
                >
                    <div className="text-[9px] uppercase font-black tracking-wider mb-1" style={{ color: RARITY_CONFIG[t.rarity].color }}>{t.rarity}</div>
                    <div className="text-xs font-bold truncate leading-tight">{t.words.map(w => w.text).join(' ')}</div>
                    {selectedIds.includes(t.id) && (
                      <div className="absolute top-1 right-1">
                        <ShieldCheck size={12} className="text-fuchsia-400" />
                      </div>
                    )}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FusionAltar;
