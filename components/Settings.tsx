
import React from 'react';
import { PlayerState } from '../types';
import { User, Volume2, Trash2, Zap, RotateCcw } from 'lucide-react';
import { audio } from '../audioService';

interface SettingsProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const Settings: React.FC<SettingsProps> = ({ player, setPlayer }) => {
  const resetGame = () => {
    if (confirm("Reset everything? All your legendary titles will be lost to the void.")) {
      localStorage.removeItem('TITLE_FORGE_SAVE_V2');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-cinzel font-bold">Lexicon Config</h2>
        <p className="text-gray-400">Personalize your journey through the Grand Library.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-10">
        {/* Username */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            <User size={16} /> Player Identity
          </label>
          <input 
            type="text" 
            value={player.settings.username}
            onChange={(e) => setPlayer(prev => ({ ...prev, settings: { ...prev.settings, username: e.target.value } }))}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xl font-cinzel focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="Enter name..."
          />
        </div>

        {/* Volume */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            <Volume2 size={16} /> Celestial Resonance (Volume)
          </label>
          <div className="flex items-center gap-6">
            <input 
              type="range" 
              min="0" max="1" step="0.01"
              value={player.settings.soundVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setPlayer(prev => ({ ...prev, settings: { ...prev.settings, soundVolume: vol } }));
                audio.setVolume(vol);
                audio.playTick();
              }}
              className="flex-1 accent-blue-500 h-2 bg-white/10 rounded-lg cursor-pointer"
            />
            <span className="w-12 text-right font-mono font-bold">{Math.round(player.settings.soundVolume * 100)}%</span>
          </div>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                <Zap size={16} /> Cosmic Motion
              </label>
              <p className="text-xs text-gray-600">Toggle high-intensity UI animations.</p>
           </div>
           <button 
             onClick={() => setPlayer(prev => ({ ...prev, settings: { ...prev.settings, uiAnimations: !prev.settings.uiAnimations } }))}
             className={`w-14 h-8 rounded-full p-1 transition-all ${player.settings.uiAnimations ? 'bg-blue-600' : 'bg-white/10'}`}>
             <div className={`w-6 h-6 rounded-full bg-white transition-transform ${player.settings.uiAnimations ? 'translate-x-6' : 'translate-x-0'}`} />
           </button>
        </div>

        {/* Dangerous */}
        <div className="pt-6 border-t border-white/5 space-y-4">
           <button 
             onClick={resetGame}
             className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
             <RotateCcw size={14} /> Reset Progress to Zero
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
