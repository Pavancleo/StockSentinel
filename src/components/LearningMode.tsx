/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Award, ArrowUpRight, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface IndicatorInfo {
  id: string;
  name: string;
  tag: string;
  definition: string;
  howToRead: string;
  implications: string;
  example: string;
}

const INDICATORS: IndicatorInfo[] = [
  {
    id: 'rsi',
    name: 'Relative Strength Index (RSI)',
    tag: 'MOMENTUM OSCILLATOR',
    definition: 'RSI measures the speed and change of price movements on a scale from 0 to 100. It is traditionally used to identify overbought or oversold conditions in an asset.',
    howToRead: 'An RSI value over 70 suggests that an asset is becoming overbought or overvalued, which may signal a trend reversal or corrective price pullback. An RSI below 30 indicates an oversold or undervalued condition, which might suggest a buying opportunity.',
    implications: 'If the current RSI is around 35, it implies that the stock has healthy buying momentum with low downside risk, as it is close to the oversold boundary but starting to trend upwards.',
    example: 'Imagine a rubber band being stretched. When RSI exceeds 70, the band is stretched too tight to the upside and likely to snap back (price falls). When RSI drops below 30, it is stretched too far to the downside and likely to bounce back up.'
  },
  {
    id: 'macd',
    name: 'Moving Average Convergence Divergence (MACD)',
    tag: 'TREND-FOLLOWING MOMENTUM',
    definition: 'MACD is a trend-following momentum indicator that shows the relationship between two moving averages of an asset’s price—typically the 26-period and 12-period exponential moving averages (EMA).',
    howToRead: 'The MACD consists of a MACD line, a Signal line, and a histogram. A bullish crossover occurs when the MACD line crosses ABOVE the signal line, suggesting upward price momentum. A bearish crossover occurs when the MACD line crosses BELOW the signal line, indicating downward momentum.',
    implications: 'A BULLISH MACD indicates positive convergence, where buyer pressure is accelerating relative to recent averages, supporting a buying or holding posture.',
    example: 'Think of MACD as two runners. One runner represents short-term speed (12-day EMA), and the other represents long-term pace (26-day EMA). When the short-term runner overtakes the long-term runner to the upside, a powerful bullish momentum is confirmed.'
  },
  {
    id: 'ma',
    name: 'Moving Averages (50 & 200 Days)',
    tag: 'TREND FILTER',
    definition: 'Moving Averages smooth out price data to create a single flowing line, making it easier to identify the overall direction of the trend over a specific timeframe (e.g., 50 days or 200 days).',
    howToRead: 'When the short-term average (50-day) crosses ABOVE the long-term average (200-day), it forms a "Golden Cross"—a highly bullish signal. Conversely, when the 50-day crosses BELOW the 200-day, it forms a "Death Cross"—indicating long-term bearish momentum.',
    implications: 'If price is trading above both the 50-day and 200-day moving averages, it confirms that the stock is in a solid macro uptrend, and dips are generally considered buying opportunities.',
    example: 'Think of a moving average as the climate, while daily stock prices are the weather. The daily weather fluctuates wildly, but the moving average shows you whether the climate is warming up (bullish trend) or cooling down (bearish trend).'
  },
  {
    id: 'volume',
    name: 'Volume Trend Analysis',
    tag: 'LIQUIDITY & VALIDATION',
    definition: 'Volume measures the total number of shares or contracts traded during a specified period. Volume trend analysis helps traders confirm the strength of a price movement.',
    howToRead: 'A price increase accompanied by high or rising volume is considered a strong confirmation of the uptrend. A price increase on low volume suggests a lack of conviction among buyers and may lead to a quick reversal.',
    implications: 'Increasing volume on bullish green candle days signals institutional buying (accumulation), confirming that smart money is backing the upward momentum.',
    example: 'If a car is driving up a steep hill, it needs plenty of fuel (volume) to reach the top. If the car tries to climb the hill without fuel (low volume), it will eventually stall and roll back down.'
  }
];

export default function LearningMode() {
  const [activeInd, setActiveInd] = useState('rsi');

  const selected = INDICATORS.find(i => i.id === activeInd)!;

  return (
    <div id="learning-mode" className="space-y-6 font-sans">
      {/* Top Controller Bar */}
      <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border px-6 py-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">STOCK SENTINEL ACADEMY</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">LEARN TECHNICAL INDICATORS & INTERPRET MARKET VECTOR FORCES</p>
          </div>
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          {INDICATORS.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveInd(ind.id)}
              className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                activeInd === ind.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 font-bold'
                  : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover'
              }`}
            >
              {ind.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content card */}
        <div className="lg:col-span-8 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="border-b border-brand-border pb-4 space-y-1">
            <span className="text-[9px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">{selected.tag}</span>
            <h3 className="text-lg font-bold text-white tracking-wide pt-1">{selected.name}</h3>
          </div>

          <div className="space-y-5 font-mono text-xs">
            {/* Definition */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">DEFINITION:</span>
              <p className="text-slate-200 leading-relaxed font-sans text-sm bg-brand-deep/30 p-4 rounded-xl border border-brand-border/40">
                {selected.definition}
              </p>
            </div>

            {/* How to Read */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">HOW TO READ THE VALUES:</span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs bg-brand-deep/30 p-4 rounded-xl border border-brand-border/40">
                {selected.howToRead}
              </p>
            </div>

            {/* Example */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">REAL-WORLD ANALOGY / EXAMPLE:</span>
              <div className="flex items-start gap-3 bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-xl">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-slate-200 leading-relaxed font-sans text-xs italic">
                  {selected.example}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Implications summary card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider border-b border-brand-border pb-3">
              <Award className="w-4 h-4 text-purple-400" />
              <span>INVESTMENT IMPACT</span>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">DECISION IMPLICATION:</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed bg-brand-deep/50 p-3.5 rounded-lg border border-brand-border/40">
                  {selected.implications}
                </p>
              </div>

              <div className="bg-brand-deep/30 border border-brand-border/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>PRO TIP</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Never base your entire thesis on a single indicator. True institutional analysis combines **RSI momentum** with **MACD trends** and **volume validation** to build a comprehensive risk matrix.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
