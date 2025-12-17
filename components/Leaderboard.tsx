
import React from 'react';
import { PlayerState, Rarity } from '../types';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { RARITY_CONFIG } from '../constants';

const MOCK_LEADERS = [
  { username: 'Elder_Void', title: 'The Primordial Who Devours Realities', rarity: Rarity.COSMIC, glyphs: 85200000 },
  { username: 'Star_Walker', title: 'Celestial Herald of Eternity', rarity: Rarity.DIVINE, glyphs: 42000000 },
  { username: 'GhostInShell', title: 'Recursive Logic of [ERROR]', rarity: Rarity.CHAOS, glyphs: 12000000 },
  { username: 'LoreKeeper', title: 'Ancient Guardian of the Great Archive', rarity: Rarity.FABLED, glyphs: 5600000 },
];

const Leaderboard: React.FC<{ player: PlayerState }> = ({ player }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-float" />
        <h2 className="text-4xl font-cinzel font-bold">Hall of Legends</h2>
        <p className="text-gray-400">The most powerful scribes in the Omniversal Lexicon.</p>
      </div>

      <div className="space-y-3">
        {MOCK_LEADERS.map((leader, i) => (
          <div key={i} className={`flex items-center justify-between p-6 rounded-3xl border ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/50 scale-105' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center gap-6">
              <div className="w-8 flex justify-center text-2xl font-black">
                {i === 0 ? <Crown className="text-yellow-500" /> : i === 1 ? <Medal className="text-gray-300" /> : i === 2 ? <Medal className="text-amber-600" /> : <span className="text-gray-600">#{i + 1}</span>}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">{leader.username}</span>
                <span className="text-xs italic font-cinzel" style={{ color: RARITY_CONFIG[leader.rarity].color }}>{leader.title}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-xl text-yellow-500">{leader.glyphs.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Net Worth</div>
            </div>
          </div>
        ))}

        {/* Player Status */}
        <div className="mt-12 p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-8 flex justify-center text-gray-400 font-bold italic">YOU</div>
             <div className="flex flex-col">
                <span className="font-bold text-lg">{player.settings.username}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-black">Current Rank: Unranked</span>
             </div>
          </div>
          <div className="text-right">
              <div className="font-black text-xl text-blue-400">{player.glyphs.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Glyphs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
