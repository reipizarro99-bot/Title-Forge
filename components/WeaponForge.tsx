
import React, { useState } from 'react';
import { PlayerState, Weapon, Rarity, MutationType } from '../types';
import { RARITY_CONFIG, MUTATION_CONFIG, WEAPON_TEMPLATES } from '../constants';
import { Sword, Hammer, Loader2, Sparkles, Zap } from 'lucide-react';
import { audio } from '../audioService';

interface WeaponForgeProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  addWeapon: (weapon: Weapon) => void;
}

const WeaponForge: React.FC<WeaponForgeProps> = ({ player, setPlayer, addWeapon }) => {
  const [isForging, setIsForging] = useState(false);
  const [lastWeapon, setLastWeapon] = useState<Weapon | null>(null);

  const startWeaponForge = () => {
    if (player.glyphs < 200 || player.materials < 10 || isForging) return;

    setIsForging(true);
    setPlayer(prev => ({ ...prev, glyphs: prev.glyphs - 200, materials: prev.materials - 10 }));
    audio.playFusion();

    setTimeout(() => {
      const rarities = Object.keys(RARITY_CONFIG) as Rarity[];
      const rarity = rarities[Math.floor(Math.random() * 8)]; // Lower pool for weapons initially
      const rIdx = rarities.indexOf(rarity);
      
      const name = `${WEAPON_TEMPLATES.names[Math.floor(Math.random() * WEAPON_TEMPLATES.names.length)]} ${WEAPON_TEMPLATES.suffixes[Math.floor(Math.random() * WEAPON_TEMPLATES.suffixes.length)]}`;
      
      const newWeapon: Weapon = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        rarity,
        damage: 10 * (rIdx + 1) * (1 + Math.random()),
        attackSpeed: 0.5 + (Math.random() * 1.5)
      };

      if (Math.random() < 0.1) {
        const mutations = Object.values(MutationType).filter(m => m !== MutationType.NONE);
        newWeapon.mutation = MUTATION_CONFIG[mutations[Math.floor(Math.random() * mutations.length)]] || undefined;
      }

      addWeapon(newWeapon);
      setLastWeapon(newWeapon);
      setIsForging(false);
      audio.playSuccess();
    }, 1500);
  };

  const equipWeapon = (id: string) => {
    setPlayer(prev => ({ ...prev, equippedWeaponId: id }));
    audio.playTick();
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-5xl font-cinzel font-bold text-glow-sm">Arsenal Forge</h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Prepare for the Siege</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Forging UI */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 backdrop-blur-xl group">
          <div className="w-32 h-32 rounded-full bg-blue-500/10 border-2 border-dashed border-blue-500/40 flex items-center justify-center animate-pulse">
            <Sword size={48} className="text-blue-400" />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-cinzel font-bold">Forge Weapon</h3>
            <p className="text-gray-500 text-sm">Combine 200 Glyphs and 10 Pure Materials to manifest a combat instrument.</p>
          </div>
          <button 
            onClick={startWeaponForge}
            disabled={isForging || player.glyphs < 200 || player.materials < 10}
            className={`w-full py-6 rounded-3xl font-cinzel font-bold text-xl transition-all ${isForging ? 'opacity-50' : 'bg-blue-600 hover:bg-blue-500 shadow-2xl'}`}
          >
            {isForging ? <Loader2 className="animate-spin mx-auto" /> : 'FORGE WEAPON'}
          </button>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <span>Glyphs: {player.glyphs}/200</span>
            <span>Mats: {player.materials}/10</span>
          </div>
        </div>

        {/* Arsenal List */}
        <div className="space-y-6">
          <h4 className="font-cinzel font-bold text-gray-400 uppercase tracking-widest text-sm border-b border-white/5 pb-2">Your Arsenal</h4>
          <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {player.arsenal.length === 0 ? (
               <div className="text-center py-20 opacity-20 italic">No weapons forged yet.</div>
            ) : (
              player.arsenal.map(w => (
                <div key={w.id} className={`p-6 rounded-2xl border transition-all flex justify-between items-center ${player.equippedWeaponId === w.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: RARITY_CONFIG[w.rarity].color }}>{w.rarity}</span>
                      {w.mutation && <span className="text-[7px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 rounded" style={{ color: w.mutation.color }}>{w.mutation.type}</span>}
                    </div>
                    <div className="font-cinzel font-bold text-lg">{w.name}</div>
                    <div className="flex gap-4 text-[10px] text-gray-500 font-black uppercase">
                      <span>DMG: {Math.round(w.damage)}</span>
                      <span>SPD: {w.attackSpeed.toFixed(1)}x</span>
                    </div>
                  </div>
                  <button onClick={() => equipWeapon(w.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${player.equippedWeaponId === w.id ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-400'}`}>
                    {player.equippedWeaponId === w.id ? 'EQUIPPED' : 'EQUIP'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponForge;
