
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Title, Rarity, PlayerState, MarketTrend, Weapon } from './types';
import { RARITY_CONFIG } from './constants';
import Forge from './components/Forge';
import Inventory from './components/Inventory';
import Market from './components/Market';
import GambleBooth from './components/GambleBooth';
import FusionAltar from './components/FusionAltar';
import StockMarket from './components/StockMarket';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import WeaponForge from './components/WeaponForge';
import DefenseGame from './components/DefenseGame';
import { audio } from './audioService';
import { Coins, Package, ShoppingCart, Dice5, Zap, ShieldCheck, BarChart3, Trophy, Settings as SettingsIcon, Globe, Sparkles, Diamond, Sword, ShieldAlert } from 'lucide-react';

const SAVE_KEY = 'TITLE_FORGE_SAVE_V5';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forge' | 'inventory' | 'market' | 'gamble' | 'fusion' | 'stocks' | 'leaderboard' | 'settings' | 'arsenal' | 'defense'>('forge');
  
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      glyphs: 2500,
      astralShards: 0,
      cosmicEssence: 0,
      inventory: [],
      arsenal: [],
      equippedId: null,
      equippedWeaponId: null,
      baseHealth: 100,
      maxBaseHealth: 100,
      charms: { luck: 0, purity: 0, synergy: 0 },
      materials: 0,
      settings: {
        soundVolume: 0.5,
        uiAnimations: true,
        username: 'Seeker_' + Math.floor(Math.random() * 9999)
      },
      currentWorld: 1,
      unlockedWorlds: [1]
    };
  });

  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>(() => 
    Object.values(Rarity).map(r => ({ rarity: r, multiplier: 1, direction: 'stable' }))
  );

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    audio.setVolume(player.settings.soundVolume);
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTrends(prev => prev.map(trend => {
        const change = (Math.random() - 0.5) * 0.4;
        const newVal = Math.max(0.5, Math.min(2.5, trend.multiplier + change));
        return {
          rarity: trend.rarity,
          multiplier: newVal,
          direction: newVal > trend.multiplier ? 'up' : newVal < trend.multiplier ? 'down' : 'stable'
        };
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addTitle = (title: Title) => setPlayer(prev => ({ ...prev, inventory: [title, ...prev.inventory] }));
  const addWeapon = (weapon: Weapon) => setPlayer(prev => ({ ...prev, arsenal: [weapon, ...prev.arsenal] }));

  const sellTitle = (id: string) => {
    const title = player.inventory.find(t => t.id === id);
    if (!title) return;
    const trend = marketTrends.find(tr => tr.rarity === title.rarity);
    const marketValue = Math.floor(title.value * (trend?.multiplier || 1));
    setPlayer(prev => {
      const newState = { ...prev, inventory: prev.inventory.filter(t => t.id !== id), equippedId: prev.equippedId === id ? null : prev.equippedId };
      if (title.world === 1) newState.glyphs += marketValue;
      else if (title.world === 2) newState.astralShards += marketValue;
      else if (title.world === 3) newState.cosmicEssence += marketValue;
      return newState;
    });
    audio.playSuccess();
  };

  const equipTitle = (id: string) => {
    setPlayer(prev => ({ ...prev, equippedId: id }));
    audio.playTick();
  };

  const switchWorld = (w: number) => {
    if (player.unlockedWorlds.includes(w)) {
      setPlayer(prev => ({ ...prev, currentWorld: w }));
      audio.playReveal();
    } else {
      const costs = { 2: 50000, 3: 50000 };
      if (w === 2 && player.glyphs >= costs[2]) {
        setPlayer(prev => ({ ...prev, glyphs: prev.glyphs - costs[2], unlockedWorlds: [...prev.unlockedWorlds, 2], currentWorld: 2 }));
        audio.playUpgrade();
      } else if (w === 3 && player.astralShards >= costs[3]) {
        setPlayer(prev => ({ ...prev, astralShards: prev.astralShards - costs[3], unlockedWorlds: [...prev.unlockedWorlds, 3], currentWorld: 3 }));
        audio.playUpgrade();
      }
    }
  };

  const worldDetails = [
    { id: 1, name: "The Grand Library", color: "from-blue-500", currency: <Coins className="text-yellow-400 w-3.5 h-3.5"/>, val: player.glyphs, label: "Glyphs" },
    { id: 2, name: "The Astral Sea", color: "from-indigo-500", currency: <Diamond className="text-cyan-400 w-3.5 h-3.5"/>, val: player.astralShards, label: "Shards" },
    { id: 3, name: "The Cosmic Core", color: "from-fuchsia-500", currency: <Zap className="text-purple-400 w-3.5 h-3.5"/>, val: player.cosmicEssence, label: "Essence" },
  ];

  return (
    <div className="min-h-screen cosmic-gradient text-white flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-blue-500/30 overflow-hidden">
      <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center glass-morphism sticky top-0 z-[60]">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-cinzel tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-slate-100 to-purple-400 font-bold leading-none">
              TITLE FORGE
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${worldDetails[player.currentWorld-1].color} to-white animate-pulse`}></span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-extrabold">{worldDetails[player.currentWorld-1].name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <div className="flex flex-col">
               <div className="w-24 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(player.baseHealth / player.maxBaseHealth) * 100}%` }} />
               </div>
               <span className="text-[8px] uppercase font-black tracking-widest text-gray-500">Base Health</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 px-4 py-2 bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-md">
            {worldDetails.map(w => (
              <div key={w.id} className={`flex flex-col items-center transition-opacity duration-300 ${player.currentWorld === w.id ? 'opacity-100' : 'opacity-30'}`}>
                <div className="flex items-center gap-1.5">
                  {w.currency}
                  <span className="font-extrabold text-white text-xs tabular-nums">{w.val.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {[1, 2, 3].map(w => (
              <button 
                key={w}
                onClick={() => switchWorld(w)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${player.currentWorld === w ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                title={`Go to World ${w}`}
              >
                {w}
              </button>
            ))}
          </div>

          <button onClick={() => setActiveTab('settings')} className={`p-2.5 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-48 max-w-7xl mx-auto w-full p-4 md:p-10 relative z-10">
        <div className="animate-in fade-in zoom-in-95 duration-700">
          {activeTab === 'forge' && <Forge player={player} setPlayer={setPlayer} addTitle={addTitle} />}
          {activeTab === 'arsenal' && <WeaponForge player={player} setPlayer={setPlayer} addWeapon={addWeapon} />}
          {activeTab === 'inventory' && <Inventory player={player} sellTitle={sellTitle} equipTitle={equipTitle} trends={marketTrends} />}
          {activeTab === 'market' && <Market player={player} setPlayer={setPlayer} />}
          {activeTab === 'gamble' && <GambleBooth player={player} setPlayer={setPlayer} addTitle={addTitle} />}
          {activeTab === 'fusion' && <FusionAltar player={player} setPlayer={setPlayer} addTitle={addTitle} />}
          {activeTab === 'stocks' && <StockMarket trends={marketTrends} />}
          {activeTab === 'leaderboard' && <Leaderboard player={player} />}
          {activeTab === 'settings' && <Settings player={player} setPlayer={setPlayer} />}
          {activeTab === 'defense' && <DefenseGame player={player} setPlayer={setPlayer} />}
        </div>
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 border border-white/20 backdrop-blur-3xl rounded-[2.5rem] z-50 shadow-2xl flex items-center gap-2 border-t border-white/20">
        <NavButton icon={<Zap />} active={activeTab === 'forge'} onClick={() => setActiveTab('forge')} label="Forge" />
        <NavButton icon={<Sword />} active={activeTab === 'arsenal'} onClick={() => setActiveTab('arsenal')} label="Arsenal" />
        <NavButton icon={<Package />} active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} label="Lexicon" />
        <NavButton icon={<BarChart3 />} active={activeTab === 'stocks'} onClick={() => setActiveTab('stocks')} label="Market" />
        <NavButton icon={<ShieldAlert />} active={activeTab === 'defense'} onClick={() => setActiveTab('defense')} label="Defense" />
        <div className="w-px h-8 bg-white/10 mx-1" />
        <NavButton icon={<ShieldCheck />} active={activeTab === 'fusion'} onClick={() => setActiveTab('fusion')} label="Fusion" />
        <NavButton icon={<Dice5 />} active={activeTab === 'gamble'} onClick={() => setActiveTab('gamble')} label="Gamble" />
        <NavButton icon={<ShoppingCart />} active={activeTab === 'market'} onClick={() => setActiveTab('market')} label="Charms" />
        <NavButton icon={<Trophy />} active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} label="Top" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void, label: string }> = ({ icon, active, onClick, label }) => (
  <button
    onClick={() => { onClick(); audio.playTick(); }}
    className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 min-w-[56px] ${active ? 'bg-white/10 text-blue-400 scale-110' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    <span className="text-[7px] uppercase font-black tracking-[0.2em] hidden sm:block">{label}</span>
  </button>
);

export default App;
