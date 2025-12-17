
import React from 'react';
import { MarketTrend, Rarity } from '../types';
import { RARITY_CONFIG } from '../constants';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface StockMarketProps {
  trends: MarketTrend[];
}

const StockMarket: React.FC<StockMarketProps> = ({ trends }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-cinzel font-bold text-glow-sm">Omniversal Exchange</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Live Volatility Data</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 px-6 py-3 rounded-full border border-blue-500/20">
          <Info size={14} />
          <span>Market recalibrating in 30s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map(trend => {
          const config = RARITY_CONFIG[trend.rarity];
          const percent = Math.round((trend.multiplier - 1) * 100);
          
          return (
            <div key={trend.rarity} className="bg-black/20 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:border-white/20 transition-all group overflow-hidden relative backdrop-blur-md">
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-4 h-4 rounded-full shadow-lg ${config.bg} ${config.shadow} border border-white/20`} />
                <div>
                  <div className="font-cinzel font-bold text-lg tracking-wide" style={{ color: config.color }}>{trend.rarity}</div>
                  <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Index: {config.multiplier}x</div>
                </div>
              </div>

              <div className={`flex flex-col items-end relative z-10 ${trend.direction === 'up' ? 'text-green-400' : trend.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                <div className="flex items-center gap-1 font-black text-xl tabular-nums">
                  {trend.direction === 'up' ? <TrendingUp size={18} /> : trend.direction === 'down' ? <TrendingDown size={18} /> : <Minus size={18} />}
                  {trend.multiplier.toFixed(2)}x
                </div>
                <div className="text-[10px] font-bold uppercase tracking-tighter">{percent > 0 ? '+' : ''}{percent}% Volatility</div>
              </div>

              {/* Mini decoration */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 blur-[60px] opacity-10 pointer-events-none ${config.bg}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockMarket;
