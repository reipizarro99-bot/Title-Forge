
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerState, Weapon } from '../types';
import { ShieldAlert, Sword, Heart, Coins, Zap } from 'lucide-react';
import { audio } from '../audioService';

interface Enemy {
  id: string;
  hp: number;
  maxHp: number;
  pos: number; // 0 to 100
  speed: number;
}

const DefenseGame: React.FC<{ player: PlayerState, setPlayer: React.Dispatch<React.SetStateAction<PlayerState>> }> = ({ player, setPlayer }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [kills, setKills] = useState(0);
  const gameLoop = useRef<any>(null);
  const spawnTimer = useRef<any>(null);

  const equippedWeapon = player.arsenal.find(w => w.id === player.equippedWeaponId);

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      hp: 20 + (kills * 2),
      maxHp: 20 + (kills * 2),
      pos: 100,
      speed: 0.2 + (Math.random() * 0.3)
    };
    setEnemies(prev => [...prev, newEnemy]);
  }, [kills]);

  const startSiege = () => {
    if (!equippedWeapon) {
      alert("You need to equip a weapon in the Arsenal first!");
      return;
    }
    setIsActive(true);
    setKills(0);
    setEnemies([]);
    audio.playReveal();
  };

  const attackEnemy = (id: string) => {
    if (!equippedWeapon) return;
    setEnemies(prev => prev.map(e => {
      if (e.id === id) {
        const newHp = e.hp - equippedWeapon.damage;
        if (newHp <= 0) {
          setKills(k => k + 1);
          setPlayer(p => ({ ...p, glyphs: p.glyphs + 5, materials: p.materials + 0.5 }));
          audio.playTick();
        }
        return { ...e, hp: newHp };
      }
      return e;
    }).filter(e => e.hp > 0));
  };

  useEffect(() => {
    if (isActive) {
      gameLoop.current = setInterval(() => {
        setEnemies(prev => {
          let damaged = false;
          const moved = prev.map(e => {
            const newPos = e.pos - e.speed;
            if (newPos <= 5) {
              damaged = true;
              return { ...e, pos: -100 }; // flag for removal
            }
            return { ...e, pos: newPos };
          });

          if (damaged) {
            setPlayer(p => ({ ...p, baseHealth: Math.max(0, p.baseHealth - 10) }));
            audio.playSacrifice();
          }

          return moved.filter(e => e.pos > 0);
        });
      }, 50);

      spawnTimer.current = setInterval(() => {
        spawnEnemy();
      }, 2000 - Math.min(1500, kills * 20));

      return () => {
        clearInterval(gameLoop.current);
        clearInterval(spawnTimer.current);
      };
    }
  }, [isActive, kills, spawnEnemy, setPlayer]);

  useEffect(() => {
    if (player.baseHealth <= 0 && isActive) {
      setIsActive(false);
      alert("Base Overrun! Repair your defenses and forge stronger weapons.");
      setPlayer(p => ({ ...p, baseHealth: p.maxBaseHealth }));
    }
  }, [player.baseHealth, isActive, setPlayer]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in pb-20">
      <div className="flex justify-between items-center bg-black/40 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-cinzel font-bold text-glow-sm">Frontier Defense</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Slay the Void Echos</p>
        </div>
        <div className="flex gap-8">
           <div className="text-center">
              <div className="text-2xl font-black text-red-500">{Math.round(player.baseHealth)}</div>
              <div className="text-[8px] uppercase font-bold text-gray-500">Integrity</div>
           </div>
           <div className="text-center">
              <div className="text-2xl font-black text-blue-400">{kills}</div>
              <div className="text-[8px] uppercase font-bold text-gray-500">Exterminations</div>
           </div>
        </div>
      </div>

      {!isActive ? (
        <div className="h-[400px] bg-white/5 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
          <ShieldAlert size={64} className="text-yellow-500 animate-bounce" />
          <div className="text-center z-10 px-8">
            <h3 className="text-2xl font-cinzel font-bold mb-2">The Horde Approaches</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">Skeletons are leaking from the Chaos rifts. Defend your library using your forged arsenal.</p>
            <button 
              onClick={startSiege}
              className="px-12 py-4 bg-red-600 rounded-2xl font-cinzel font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              ENGAGE DEFENSE
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[500px] bg-black/80 border border-white/10 rounded-[3rem] relative overflow-hidden cursor-crosshair">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-red-900/20 border-r border-red-500/20 flex items-center justify-center">
             <div className="rotate-[-90deg] whitespace-nowrap text-red-500/50 font-black tracking-[1em] text-xs uppercase">BASE CORE</div>
          </div>

          {enemies.map(e => (
            <div 
              key={e.id}
              onClick={() => attackEnemy(e.id)}
              className="absolute group transition-all duration-75"
              style={{ left: `${e.pos}%`, top: `${20 + (parseInt(e.id, 36) % 60)}%` }}
            >
              <div className="relative cursor-pointer hover:scale-125 transition-transform">
                <div className="text-4xl select-none">💀</div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                   <div className="h-full bg-green-500" style={{ width: `${(e.hp / e.maxHp) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Sword size={20} className="text-blue-400" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-gray-500">Current Weapon</div>
              <div className="font-bold text-sm text-white">{equippedWeapon?.name || 'Unarmed'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-6">
           <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Coins className="text-yellow-500" size={24} />
           </div>
           <div>
              <div className="text-[10px] font-black uppercase text-gray-500">Defense Bounty</div>
              <div className="text-sm font-medium">Earn +5 Glyphs and +0.5 Mats per kill</div>
           </div>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-6">
           <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Zap className="text-purple-500" size={24} />
           </div>
           <div>
              <div className="text-[10px] font-black uppercase text-gray-500">Difficulty Escalation</div>
              <div className="text-sm font-medium">Enemies gain HP and Speed as kills rise</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseGame;
