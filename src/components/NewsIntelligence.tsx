/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Newspaper, HelpCircle, Eye, AlertCircle, TrendingUp, RefreshCw, Radio } from 'lucide-react';
import { NewsArticle } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function NewsIntelligence() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'>('ALL');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredArticles = selectedFilter === 'ALL'
    ? articles
    : articles.filter(a => a.sentiment === selectedFilter);

  const getSentimentStyles = (sent: string) => {
    switch (sent.toUpperCase()) {
      case 'POSITIVE':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'NEGATIVE':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800/20';
    }
  };

  return (
    <div id="news-intelligence" className="space-y-6 font-sans">
      {/* Top filter and header control card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-card/50 backdrop-blur-md border border-brand-border px-6 py-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">LIVE FINANCIAL NEWS INTELLIGENCE</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">AUTOMATED CRITICAL SENTIMENT & IMPACT SCORING</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 font-mono">
          {['ALL', 'POSITIVE', 'NEGATIVE', 'NEUTRAL'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f as any)}
              className={`text-[9px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                selectedFilter === f
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/5'
                  : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-2 bg-brand-deep hover:bg-brand-deep/80 border border-brand-border rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* News Stream List */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((art) => (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-5 shadow-xl hover:border-brand-border-hover transition-all"
              >
                {/* Meta Details Column (Impact meter & Sentiments) */}
                <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start items-center md:items-stretch gap-3 border-b md:border-b-0 md:border-r border-brand-border/40 pb-3 md:pb-0 md:pr-4 font-mono text-[10px]">
                  <div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getSentimentStyles(art.sentiment)}`}>
                      {art.sentiment}
                    </span>
                    <div className="text-slate-500 text-[8px] mt-2 uppercase tracking-wide font-bold">SOURCE: {art.source}</div>
                    <div className="text-slate-500 text-[8px] mt-0.5">{art.time}</div>
                  </div>

                  <div className="space-y-1.5 md:mt-4">
                    <div className="flex justify-between text-slate-400 uppercase text-[9px] tracking-wide font-bold">
                      <span>IMPACT HEAT:</span>
                      <span className="font-bold text-slate-100">{art.impactScore}</span>
                    </div>
                    <div className="w-full sm:w-28 md:w-full bg-brand-deep h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          art.impactScore > 80 ? 'bg-red-500' :
                          art.impactScore > 65 ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${art.impactScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Article Content Column */}
                <div className="md:col-span-9 space-y-3.5">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-sans font-bold text-slate-100 hover:text-cyan-400 transition-colors leading-snug">
                      {art.headline}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  {/* Mentioned Companies Tag */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase mr-1.5 tracking-wider font-bold">TICKERS:</span>
                    {art.companiesMentioned.map((c) => (
                      <span key={c} className="text-[9px] font-mono bg-brand-deep border border-brand-border text-cyan-400 px-2.5 py-0.5 rounded-lg">
                        {c}
                      </span>
                    ))}
                    <span className="text-[9px] font-mono text-slate-500 uppercase ml-auto tracking-wider">SECTOR: {art.sector}</span>
                  </div>

                  {/* AI Copilot recommendation overlay */}
                  <div className="bg-brand-deep/50 border border-brand-border/40 p-3 rounded-xl flex items-start gap-2.5 text-[10px] font-sans text-slate-300">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-purple-400 font-mono text-[9px] block uppercase tracking-wider font-bold">SENTINEL COGNITIVE RECOMMENDATION:</strong>
                      <span className="leading-relaxed">{art.aiRecommendation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="h-[200px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
            <div className="text-center font-mono space-y-2 text-slate-400">
              <Newspaper className="w-6 h-6 animate-pulse mx-auto text-slate-500" />
              <div className="text-xs uppercase tracking-wider">NO ARTICLES FOUND WITH FILTER: {selectedFilter}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
