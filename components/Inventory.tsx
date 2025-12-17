
import React from 'react';
import { PlayerState, Title, MarketTrend } from '../types';
import { RARITY_CONFIG } from '../constants';
import { Trash2, CheckCircle, Info, Coins, TrendingUp, TrendingDown, Globe, Sparkles, Zap } from 'lucide-react';
import { audio } from '../audioService';

interface InventoryProps {
  player: PlayerState;
  sellTitle: (id: string) => void;
  equipTitle: (id: string) => void;
  trends: MarketTrend[];
}

const Inventory: React.FC<InventoryProps> = ({ player, sellTitle, equipTitle, trends }) => {
  const worldIcons = { 1: <Globe size={10}/>, 2: <Sparkles size={10}/>, 3: <Zap size={10}/> };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-cinzel font-bold text-glow-sm">The Lexicon</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Vault of Discovered Echoes</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Records</span>
          <span className="text-white font-black text-xl tabular-nums leading-none">{player.inventory.length}</span>
        </div>
      </div>

      {player.inventory.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center text-gray-600 space-y-6">
          <div className="w-24 h-24 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-pulse">
            <Info size={32} className="opacity-20" />
          </div>
          <p className="font-bold uppercase tracking-widest text-[10px]">Your library awaits its first inscription.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {player.inventory.map(title => {
            const trend = trends.find(t => t.rarity === title.rarity);
            const marketValue = Math.floor(title.value * (trend?.multiplier || 1));
            const isEquipped = player.equippedId === title.id;

            return (
              <div key={title.id} 
                   className={`relative bg-white/[0.02] border rounded-[2.5rem] p-8 transition-all duration-700 group overflow-hidden ${isEquipped ? 'border-blue-500/40 bg-blue-500/[0.04] ring-1 ring-blue-500/20' : 'border-white/5 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-2'} ${title.mutation?.effectClass || ''}`}>
                
                <div className="flex justify-between items-start mb-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/5 border border-white/5 self-start" 
                            style={{ color: RARITY_CONFIG[title.rarity].color }}>
                        {title.rarity}
                      </span>
                      <div className="flex items-center gap-1 text-[8px] font-black text-gray-500 uppercase px-2 py-1 rounded bg-black/20 border border-white/5">
                        {worldIcons[title.world as keyof typeof worldIcons]}
                        <span>W{title.world}</span>
                      </div>
                    </div>
                    {title.mutation && (
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] ml-1 px-2 py-0.5 rounded bg-white/5 border border-white/5" style={{ color: title.mutation.color }}>
                        {title.mutation.type}
                      </span>
                    )}
                    {title.isPurity && (
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40 ml-1">Purity Echo</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isEquipped && (
                      <button 
                        onClick={() => equipTitle(title.id)} 
                        title="Equip Title"
                        className="p-3 rounded-2xl text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => sellTitle(title.id)} 
                      title="Sell for currency"
                      className="p-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-cinzel font-bold mb-6 leading-tight tracking-wider text-glow-sm">
                  {title.words.map((w, idx) => (
                    <span key={idx} style={{ color: RARITY_CONFIG[w.rarity].color }}>
                      {w.text}{' '}
                    </span>
                  ))}
                </h3>

                {title.history && (
                  <p className="text-xs text-gray-500 italic mb-10 leading-relaxed font-medium">
                    "{title.history}"
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Market Valuation</span>
                    <div className="flex items-center gap-2 font-black text-xl">
                      {title.world === 1 ? <Coins size={16} className="text-yellow-400" /> : title.world === 2 ? <Sparkles size={16} className="text-cyan-400" /> : <Zap size={16} className="text-purple-400" />}
                      <span className="text-white tabular-nums">{marketValue.toLocaleString()}</span>
                      {trend && trend.multiplier !== 1 && (
                        <div className={`flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md ${trend.direction === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {trend.direction === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {Math.abs(Math.round((trend.multiplier - 1) * 100))}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[8px] text-gray-700 font-bold uppercase tracking-widest bg-white/[0.03] px-2 py-1 rounded">
                    {title.seed.toUpperCase()}
                  </div>
                </div>

                <div className="absolute -bottom-24 -right-24 w-56 h-56 blur-[100px] opacity-[0.05] pointer-events-none group-hover:opacity-15 transition-opacity duration-1000" 
                     style={{ backgroundColor: title.mutation?.color || RARITY_CONFIG[title.rarity].color }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inventory;
