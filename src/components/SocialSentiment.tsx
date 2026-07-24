/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users, BarChart, TrendingUp, MessageSquare, Twitter, Globe, Heart, ShieldAlert } from 'lucide-react';
import { SocialSentiment as SentimentType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const ASSETS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'BTC', 'ETH', 'COIN'];

export default function SocialSentiment() {
  const [symbol, setSymbol] = useState('NVDA');
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentType | null>(null);

  const fetchSentiment = async (ticker: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sentiment/${ticker}`);
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const data = await res.json();
      setSentiment(data);
    } catch (err) {
      console.error('Sentiment fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment(symbol);
  }, [symbol]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'EUPHORIC': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'BULLISH': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'FEARFUL': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'PANIC': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-slate-300 border-slate-700 bg-slate-800/20';
    }
  };

  return (
    <div id="social-sentiment" className="space-y-6 font-sans">
      {/* Selector and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-card/50 backdrop-blur-md border border-brand-border px-6 py-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">SOCIAL SENTIMENT & MOOD ENGINE</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">MULTI-CHANNEL FORUM AGGREGATION & WORD MOMENTUM</p>
          </div>
        </div>

        {/* Tickers */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono">
          {ASSETS.map((a) => (
            <button
              key={a}
              onClick={() => setSymbol(a)}
              className={`text-xs px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                symbol === a
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 font-bold shadow-md shadow-cyan-500/5'
                  : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover hover:text-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {sentiment ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sentiment Proportions Pie and mood dial */}
          <div className="lg:col-span-4 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold text-left border-b border-brand-border/40 pb-2.5">GLOBAL SOCIAL MOOD</div>
              
              {/* Mood Badge dial */}
              <div className="py-2">
                <div className={`text-xs font-mono font-black py-3 px-4 rounded-xl border uppercase tracking-wider ${getMoodColor(sentiment.moodGauge)}`}>
                  {sentiment.moodGauge}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-2 tracking-wide">SENTIMENT SCORE VALUE: {sentiment.overallSentiment}</div>
              </div>

              {/* Progress split bar */}
              <div className="space-y-1.5 font-mono text-[9px] text-left">
                <div className="flex justify-between text-slate-400 tracking-wide">
                  <span>POSITIVE VS NEGATIVE PROPORTION</span>
                </div>
                <div className="w-full flex h-4 rounded-lg overflow-hidden border border-brand-border bg-brand-deep">
                  <div className="bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[8px]" style={{ width: `${sentiment.breakdown.positive}%` }}>
                    {sentiment.breakdown.positive}%
                  </div>
                  <div className="bg-slate-700 text-slate-400 flex items-center justify-center text-[8px]" style={{ width: `${sentiment.breakdown.neutral}%` }}>
                    {sentiment.breakdown.neutral}%
                  </div>
                  <div className="bg-red-500 text-slate-950 font-bold flex items-center justify-center text-[8px]" style={{ width: `${sentiment.breakdown.negative}%` }}>
                    {sentiment.breakdown.negative}%
                  </div>
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 tracking-wider">
                  <span>BULLISH</span>
                  <span>NEUTRAL</span>
                  <span>BEARISH</span>
                </div>
              </div>
            </div>

            {/* Overall Gauge info */}
            <div className="bg-brand-deep/60 border border-brand-border p-3.5 rounded-xl text-[10px] font-mono text-slate-400 leading-relaxed mt-4">
              <span className="text-cyan-400 font-bold tracking-wider">COGNITIVE INDEX:</span> Evaluates over 7,000 algorithmic nodes hourly to establish standard aggregate mood thresholds.
            </div>
          </div>

          {/* Social Channels Split Indicators Card */}
          <div className="lg:col-span-8 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-5 shadow-xl">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold border-b border-brand-border/40 pb-2.5">CHANNEL-SPECIFIC SENTIMENT INDICES</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Reddit */}
              <div className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-orange-500 text-xs font-mono font-bold tracking-wide">
                  <MessageSquare className="w-4 h-4" />
                  <span>REDDIT r/WSB</span>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">FEED VOLUME:</div>
                  <div className="text-xs font-bold text-slate-200">{sentiment.sources.reddit.postsCount.toLocaleString()} POSTS</div>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">NET SENTIMENT:</div>
                  <div className={`text-xs font-bold ${sentiment.sources.reddit.sentiment > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sentiment.sources.reddit.sentiment > 0 ? '+' : ''}{sentiment.sources.reddit.sentiment}%
                  </div>
                </div>
              </div>

              {/* Twitter */}
              <div className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-wide">
                  <Twitter className="w-4 h-4" />
                  <span>TWITTER / X</span>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">FEED VOLUME:</div>
                  <div className="text-xs font-bold text-slate-200">{sentiment.sources.twitter.tweetsCount.toLocaleString()} TWEETS</div>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">NET SENTIMENT:</div>
                  <div className={`text-xs font-bold ${sentiment.sources.twitter.sentiment > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sentiment.sources.twitter.sentiment > 0 ? '+' : ''}{sentiment.sources.twitter.sentiment}%
                  </div>
                </div>
              </div>

              {/* Forums */}
              <div className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-wide">
                  <Globe className="w-4 h-4" />
                  <span>FINANCE FORUMS</span>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">FEED VOLUME:</div>
                  <div className="text-xs font-bold text-slate-200">{sentiment.sources.forums.postsCount.toLocaleString()} POSTS</div>
                </div>
                <div className="space-y-1 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">NET SENTIMENT:</div>
                  <div className={`text-xs font-bold ${sentiment.sources.forums.sentiment > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sentiment.sources.forums.sentiment > 0 ? '+' : ''}{sentiment.sources.forums.sentiment}%
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Momentum Density tags */}
            <div className="space-y-3 pt-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">TRENDING KEYWORD WEIGHTS</div>
              <div className="flex flex-wrap gap-2">
                {sentiment.trendingKeywords.map((kw, kIdx) => (
                  <div
                    key={kIdx}
                    className="bg-brand-deep/60 hover:bg-brand-deep border border-brand-border hover:border-cyan-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 font-mono text-[10px] text-slate-300 transition-all cursor-default"
                  >
                    <span>{kw.text}</span>
                    <span className="bg-purple-950/60 text-purple-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-purple-500/20">
                      {kw.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
          <div className="text-center font-mono space-y-2 text-slate-400 animate-pulse">
            <Users className="w-6 h-6 mx-auto animate-bounce text-cyan-400" />
            <div className="text-xs uppercase tracking-wider">SCANNING FORUM DENSITIES...</div>
          </div>
        </div>
      )}
    </div>
  );
}
