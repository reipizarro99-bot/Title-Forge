
import React from 'react';
import { PlayerState } from '../types';
import { Star, ShieldCheck, Zap } from 'lucide-react';
import { audio } from '../audioService';

interface MarketProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const Market: React.FC<MarketProps> = ({ player, setPlayer }) => {
  const charms = [
    { id: 'luck', name: 'Luck Charm', desc: 'Increases odds of high rarity words.', cost: 500, icon: <Star className="text-yellow-400" />, value: 0.1 },
    { id: 'purity', name: 'Purity Charm', desc: 'Increases odds of aligned rarities.', cost: 750, icon: <ShieldCheck className="text-blue-400" />, value: 0.05 },
    { id: 'synergy', name: 'Synergy Charm', desc: 'Boosts lore-connection value.', cost: 1000, icon: <Zap className="text-purple-400" />, value: 0.1 }
  ];

  const buyCharm = (charmId: 'luck' | 'purity' | 'synergy', cost: number, value: number) => {
    if (player.glyphs < cost) return;
    setPlayer(prev => ({
      ...prev,
      glyphs: prev.glyphs - cost,
      charms: {
        ...prev.charms,
        [charmId]: prev.charms[charmId] + value
      }
    }));
    audio.playUpgrade();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-cinzel font-bold">Charm Market</h2>
        <p className="text-gray-400">Permanently enhance your forging outcome with celestial artifacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {charms.map(charm => (
          <div key={charm.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center transition-all hover:bg-white/10 group backdrop-blur-md">
            <div className="p-6 rounded-3xl bg-white/5 mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
              {React.cloneElement(charm.icon as React.ReactElement, { size: 48 })}
            </div>
            <h3 className="text-2xl font-cinzel font-bold mb-2">{charm.name}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{charm.desc}</p>
            <div className="mt-auto w-full space-y-4">
               <div className="flex justify-between items-center text-xs uppercase font-black tracking-widest px-4">
                <span className="text-gray-500">Bonus</span>
                <span className="text-white">+{Math.round(player.charms[charm.id as keyof typeof player.charms] * 100)}%</span>
              </div>
              <button 
                onClick={() => buyCharm(charm.id as any, charm.cost, charm.value)}
                disabled={player.glyphs < charm.cost}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${player.glyphs >= charm.cost ? 'bg-white/10 hover:bg-white/20 text-white shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
              >
                {charm.cost} Glyphs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
