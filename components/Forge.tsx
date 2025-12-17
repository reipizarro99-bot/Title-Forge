
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Title, Rarity, Word, PlayerState, MutationType, Mutation } from '../types';
import { RARITY_CONFIG, WORD_TEMPLATES, MUTATION_CONFIG, SYNERGY_PAIRS } from '../constants';
import { generateTitleHistory } from '../geminiService';
import { audio } from '../audioService';
import { Star, Hammer, Sparkles, TrendingUp, AlertCircle, Loader2, Diamond, Zap, Info } from 'lucide-react';

interface ForgeProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  addTitle: (title: Title) => void;
}

const Forge: React.FC<ForgeProps> = ({ player, setPlayer, addTitle }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentWords, setCurrentWords] = useState<[string, string, string]>(['???', '???', '???']);
  const [rollResult, setRollResult] = useState<Title | null>(null);
  const [showCrack, setShowCrack] = useState(false);
  const rollInterval = useRef<any>(null);

  const checkSynergy = (w1: string, w3: string) => {
    for (const [key, values] of Object.entries(SYNERGY_PAIRS)) {
      if (w1.includes(key) && values.some(v => w3.includes(v))) return true;
    }
    return false;
  };

  const getRarityByWeight = (luckMod: number) => {
    const rarities = Object.keys(RARITY_CONFIG) as Rarity[];
    const worldDifficultyMod = player.currentWorld === 1 ? 1 : player.currentWorld === 2 ? 0.8 : 0.6;
    const totalWeight = rarities.reduce((sum, r) => sum + (RARITY_CONFIG[r].weight * (r !== Rarity.COMMON ? (1 + luckMod) * worldDifficultyMod : 1)), 0);
    let random = Math.random() * totalWeight;
    for (const r of rarities) {
      const weight = RARITY_CONFIG[r].weight * (r !== Rarity.COMMON ? (1 + luckMod) * worldDifficultyMod : 1);
      if (random < weight) return r;
      random -= weight;
    }
    return Rarity.COMMON;
  };

  const getMutationByChance = (luck: number): Mutation | undefined => {
    const chance = 0.05 + (luck * 0.1);
    if (Math.random() < chance) {
      const mutationTypes = Object.values(MutationType).filter(t => t !== MutationType.NONE);
      return MUTATION_CONFIG[mutationTypes[Math.floor(Math.random() * mutationTypes.length)]] || undefined;
    }
    return undefined;
  };

  const generateWord = (column: 0 | 1 | 2, luck: number): Word => {
    const rarity = getRarityByWeight(luck);
    const pool = WORD_TEMPLATES[rarity][column === 0 ? 'first' : column === 1 ? 'middle' : 'end'];
    const text = pool[Math.floor(Math.random() * pool.length)];
    return { text, rarity, column };
  };

  const startForge = async () => {
    const key = player.currentWorld === 1 ? 'glyphs' : player.currentWorld === 2 ? 'astralShards' : 'cosmicEssence';
    if (player[key] < 100 || isRolling) return;
    setPlayer(prev => ({ ...prev, [key]: prev[key] - 100 }));
    setIsRolling(true);
    setRollResult(null);
    setShowCrack(false);
    audio.playTick();

    let counter = 0;
    rollInterval.current = setInterval(() => {
      setCurrentWords([
        WORD_TEMPLATES[Rarity.COMMON].first[Math.floor(Math.random() * 10)],
        WORD_TEMPLATES[Rarity.COMMON].middle[Math.floor(Math.random() * 10)],
        WORD_TEMPLATES[Rarity.COMMON].end[Math.floor(Math.random() * 10)],
      ]);
      audio.playTick();
      if (++counter >= 25) {
        clearInterval(rollInterval.current);
        finishRoll();
      }
    }, 80);
  };

  const finishRoll = async () => {
    const w1 = generateWord(0, player.charms.luck);
    const w2 = generateWord(1, player.charms.luck);
    const w3 = generateWord(2, player.charms.luck);
    const rarities = [w1.rarity, w2.rarity, w3.rarity];
    const isPurity = rarities.every(r => r === rarities[0]);
    const isSynergy = checkSynergy(w1.text, w3.text);
    const highestRarity = rarities.reduce((h, c) => Object.keys(RARITY_CONFIG).indexOf(c) > Object.keys(RARITY_CONFIG).indexOf(h) ? c : h, Rarity.COMMON);
    const mutation = getMutationByChance(player.charms.luck);
    
    const worldValMult = Math.pow(10, player.currentWorld - 1);
    const baseVal = RARITY_CONFIG[highestRarity].multiplier * 100 * worldValMult;
    const purityMult = isPurity ? 5 : 1;
    const synergyMult = isSynergy ? 3 : 1;
    const mutMult = mutation?.valueMultiplier || 1;
    const value = baseVal * purityMult * synergyMult * mutMult;

    const newTitle: Title = {
      id: Math.random().toString(36).substr(2, 9),
      words: [w1, w2, w3],
      rarity: highestRarity,
      isPurity,
      isSynergy,
      value,
      seed: Math.random().toString(16).substr(2, 8),
      timestamp: Date.now(),
      world: player.currentWorld,
      mutation
    };

    if (Object.keys(RARITY_CONFIG).indexOf(highestRarity) >= Object.keys(RARITY_CONFIG).indexOf(Rarity.ROYALTY)) {
      setShowCrack(true);
      setTimeout(() => setShowCrack(false), 2000);
      audio.playSacrifice();
    }

    setCurrentWords([w1.text, w2.text, w3.text]);
    setRollResult(newTitle);
    addTitle(newTitle);
    setIsRolling(false);
    audio.playReveal();

    if (Object.keys(RARITY_CONFIG).indexOf(highestRarity) >= Object.keys(RARITY_CONFIG).indexOf(Rarity.EPIC)) {
      audio.playSuccess();
      const hist = await generateTitleHistory(`${w1.text} ${w2.text} ${w3.text}`, highestRarity);
      newTitle.history = hist;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12 max-w-4xl mx-auto relative">
      <div className={`crack-overlay ${showCrack ? 'active' : ''}`} />
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-cinzel font-bold text-white tracking-tight">World {player.currentWorld} Forge</h2>
        <p className="text-gray-400 font-medium tracking-[0.4em] uppercase text-[10px]">Tapping into the Primordial Stream</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
        {[0, 1, 2].map(i => (
          <div key={i} className={`bg-white/[0.03] border border-white/10 rounded-[2.5rem] h-48 flex items-center justify-center relative overflow-hidden group shadow-2xl transition-all duration-500 ${rollResult?.mutation?.effectClass || ''}`}>
            <span className={`text-2xl md:text-4xl font-cinzel font-bold tracking-wider transition-all duration-300 ${isRolling ? 'blur-md opacity-30 scale-95' : ''}`} style={{ color: rollResult ? RARITY_CONFIG[rollResult.words[i].rarity].color : '#fff' }}>
              {currentWords[i]}
            </span>
          </div>
        ))}
      </div>

      {rollResult && !isRolling && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4">
           <div className="flex flex-wrap justify-center gap-2">
              {rollResult.isPurity && <Badge label="PURITY (5x)" color="text-green-400" />}
              {rollResult.isSynergy && <Badge label="SYNERGY (3x)" color="text-blue-400" />}
              {rollResult.mutation && <Badge label={`MUTATION: ${rollResult.mutation.type} (${rollResult.mutation.valueMultiplier}x)`} color="text-fuchsia-400" />}
           </div>
           <div className="text-center px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase font-black tracking-widest text-gray-400">
             Total Worth: <span className="text-white">{(rollResult.value).toLocaleString()}</span>
           </div>
        </div>
      )}

      <button
        onClick={startForge}
        disabled={isRolling}
        className="group relative px-20 py-6 rounded-[3rem] font-cinzel font-bold text-xl tracking-[0.2em] overflow-hidden transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${player.currentWorld === 1 ? 'from-blue-600 to-purple-600' : player.currentWorld === 2 ? 'from-indigo-600 to-rose-600' : 'from-fuchsia-900 to-black'} transition-all`} />
        <span className="relative flex items-center gap-4 text-white uppercase italic">
          {isRolling ? <Loader2 size={20} className="animate-spin" /> : <Hammer />}
          FORGE (100)
        </span>
      </button>
    </div>
  );
};

const Badge = ({ label, color }: any) => (
  <div className={`px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[8px] font-black uppercase tracking-widest ${color}`}>
    {label}
  </div>
);

export default Forge;
