
import React, { useState } from 'react';
import { PlayerState, Title } from '../types';
import { Dice6, Flame, AlertTriangle } from 'lucide-react';
import { RARITY_CONFIG } from '../constants';
import { audio } from '../audioService';

interface GambleBoothProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  addTitle: (title: Title) => void;
}

const GambleBooth: React.FC<GambleBoothProps> = ({ player, setPlayer, addTitle }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGambling, setIsGambling] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    audio.playTick();
  };

  const crucibleSacrifice = () => {
    if (selectedIds.length !== 3 || isGambling) return;

    setIsGambling(true);
    audio.playSacrifice();
    
    setTimeout(() => {
        setPlayer(prev => ({
            ...prev,
            inventory: prev.inventory.filter(t => !selectedIds.includes(t.id)),
            materials: prev.materials + 30
        }));
        setSelectedIds([]);
        setIsGambling(false);
        audio.playUpgrade();
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-cinzel font-bold tracking-tighter">The Abyss Edge</h2>
        <p className="text-gray-400 font-medium">Sacrifice your creations to the void for forbidden materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* The Crucible */}
        <div className="bg-red-950/20 border border-red-500/20 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 backdrop-blur-xl relative group">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <Flame size={80} className="text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <div className="space-y-2">
            <h3 className="text-3xl font-cinzel font-bold">The Crucible</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">Incinerate 3 titles to extract 30 Pure Materials for advanced crafting.</p>
          </div>
          
          <div className="w-full bg-black/60 rounded-[2rem] p-6 min-h-[160px] border border-white/5 flex flex-wrap gap-2 justify-center items-center shadow-inner">
            {selectedIds.length === 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700 uppercase font-black tracking-widest text-[10px]">
                <AlertTriangle size={24} />
                <span>Select 3 Titles</span>
              </div>
            )}
            {selectedIds.map(id => {
                const t = player.inventory.find(x => x.id === id);
                return (
                    <div key={id} className="px-4 py-2 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/10 animate-in zoom-in" style={{ color: t ? RARITY_CONFIG[t.rarity].color : 'white' }}>
                        {t?.words.map(w => w.text).join(' ')}
                    </div>
                );
            })}
          </div>

          <button 
            onClick={crucibleSacrifice}
            disabled={selectedIds.length !== 3 || isGambling}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 ${selectedIds.length === 3 ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] text-white' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
          >
            {isGambling ? 'PURIFYING...' : 'IGNITE CRUCIBLE'}
          </button>
        </div>

        {/* Title Roulette */}
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 backdrop-blur-xl opacity-60">
          <Dice6 size={80} className="text-blue-500" />
          <div className="space-y-2">
            <h3 className="text-3xl font-cinzel font-bold">Lexicon Roulette</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">Stake a title to potentially double its value or lose it forever to the dealer.</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <span className="text-blue-400/50 uppercase font-black tracking-[0.5em] text-xs">Closed for Maintenance</span>
          </div>
          <button disabled className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] bg-white/5 text-gray-700 cursor-not-allowed">
            UNAVAILABLE
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h4 className="font-cinzel font-bold text-gray-400 uppercase tracking-[0.2em] text-sm">Select Offerings ({selectedIds.length}/3)</h4>
          {selectedIds.length > 0 && <button onClick={() => setSelectedIds([])} className="text-[10px] font-black text-red-400 uppercase hover:underline">Clear All</button>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {player.inventory.map(t => (
                <button
                    key={t.id}
                    onClick={() => toggleSelect(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${selectedIds.includes(t.id) ? 'bg-red-500/20 border-red-500 scale-[1.05] shadow-lg z-10' : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'}`}
                >
                    <div className="text-[9px] uppercase font-black tracking-wider mb-1" style={{ color: RARITY_CONFIG[t.rarity].color }}>{t.rarity}</div>
                    <div className="text-xs font-bold truncate leading-tight">{t.words.map(w => w.text).join(' ')}</div>
                    <div className="mt-2 text-[9px] text-gray-600 font-mono italic">Val: {t.value.toLocaleString()}</div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GambleBooth;
