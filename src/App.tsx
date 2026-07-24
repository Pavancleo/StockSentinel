/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  FileText,
  Users,
  Briefcase,
  Bell,
  Sparkles,
  Cpu,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Clock,
  Terminal,
  Shield,
  HelpCircle,
  ArrowLeftRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StockPrice, MarketIndex } from './types';

// Custom Modular UI Components
import GlowGlobe from './components/GlowGlobe';
import CopilotChat from './components/CopilotChat';
import ThreatDetector from './components/ThreatDetector';
import StockPredictor from './components/StockPredictor';
import EarningsIntelligence from './components/EarningsIntelligence';
import NewsIntelligence from './components/NewsIntelligence';
import SocialSentiment from './components/SocialSentiment';
import PortfolioTracker from './components/PortfolioTracker';
import AlertSystem from './components/AlertSystem';
import CommandPalette from './components/CommandPalette';
import StockComparison from './components/StockComparison';
import LearningMode from './components/LearningMode';

// Subcomponents inside App.tsx for charts to keep code clean and modular
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'threats' | 'predictor' | 'news' | 'sentiment' | 'earnings' | 'portfolio' | 'copilot' | 'alerts' | 'comparison' | 'learning'>('dashboard');
  
  // Real-time Market feeds state
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const selectedStock = stocks.find((s) => s.symbol === selectedSymbol) || null;
  const [activeExternalSymbol, setActiveExternalSymbol] = useState<string>('NVDA');
  const [timeStr, setTimeStr] = useState('');

  // 1. Live system clock UTC
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Poll live simulated market data feed every 3 seconds
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/market-data');
        const data = await res.json();
        setStocks(data.stocks);
        setIndices(data.indices);
      } catch (err) {
        console.error('Failed to fetch real-time market data feed:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle external stock trigger via command palette
  const handleScanExternalStock = (symbol: string) => {
    setActiveExternalSymbol(symbol);
    setSelectedSymbol(symbol);
  };

  // Render index cards line
  const renderIndicesLine = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {indices.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <div
              key={idx.name}
              className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-3.5 rounded-xl flex flex-col justify-between font-mono text-[10px] space-y-1 hover:border-brand-border-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-slate-500 uppercase font-bold text-[8px] tracking-wider">{idx.name}</div>
              <div className="text-white font-bold text-xs">{idx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className={`flex items-center gap-0.5 font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{isUp ? '+' : ''}{idx.changePercent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render central landing page if not launched
  if (!isLaunched) {
    return (
      <div id="landing-page" className="relative min-h-screen bg-brand-deep text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
        {/* Animated matrix grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {/* Moving organic liquid background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[130px] animate-blob" />
          <div className="absolute bottom-[15%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[60%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-pink-500/8 blur-[110px] animate-blob animation-delay-4000" />
        </div>

        {/* Top bar header */}
        <header className="relative w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 border-b border-brand-border bg-brand-deep/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/5 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/5">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wider text-white">STOCKSENTINEL</span>
              <span className="text-[8px] font-mono block text-cyan-400 tracking-widest uppercase">MARKET AUDIT CORE</span>
            </div>
          </div>
          <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2 bg-brand-card px-3 py-1.5 rounded-full border border-brand-border">
            <Clock className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>{timeStr}</span>
          </div>
        </header>

        {/* Hero Section Container */}
        <main className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 z-10 w-full">
          {/* Left Text column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full text-purple-300 font-mono text-[9px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse-glow" />
              <span>AI Market Threat Detection Active</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-none text-white">
                AI-POWERED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">THREAT RADAR</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md">
                Continuous cognitive audits scanning circular trade spoofing, social pump-and-dump collusion, insider option anomalies, and earnings call transcript sentiments in real-time with zero human latency.
              </p>
            </div>

            {/* Quick launch controls */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setIsLaunched(true);
                  setActiveTab('dashboard');
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>LAUNCH PLATFORM GATEWAY</span>
                <ArrowUpRight className="w-4 h-4 text-purple-200" />
              </button>
              <button
                onClick={() => {
                  setIsLaunched(true);
                  setActiveTab('copilot');
                }}
                className="bg-brand-card hover:bg-[#111114] border border-brand-border hover:border-brand-border-hover text-slate-300 font-mono font-medium text-xs px-6 py-3.5 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                ASK AI COPILOT
              </button>
            </div>

            {/* Core Tech Indicators specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border font-mono">
              <div className="bg-brand-card/40 border border-brand-border p-3 rounded-lg">
                <div className="text-lg font-bold text-slate-100">98.4%</div>
                <div className="text-[8px] text-slate-500 uppercase mt-0.5">AUDIT CONFIDENCE</div>
              </div>
              <div className="bg-brand-card/40 border border-brand-border p-3 rounded-lg">
                <div className="text-lg font-bold text-slate-100">3-SEC</div>
                <div className="text-[8px] text-slate-500 uppercase mt-0.5">FEED TICK LATENCY</div>
              </div>
              <div className="bg-brand-card/40 border border-brand-border p-3 rounded-lg">
                <div className="text-lg font-bold text-cyan-400">ACTIVE</div>
                <div className="text-[8px] text-slate-500 uppercase mt-0.5">GEMINI SEARCH LAYER</div>
              </div>
            </div>
          </div>

          {/* Right 3D Earth Globe and Cyber Hologram Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
            <GlowGlobe />
          </div>
        </main>

        {/* Footer */}
        <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 z-10 text-[9px] font-mono text-slate-500">
          <div>STOCKSENTINEL © 2026. SECURE COGNITIVE CORE SYSTEM.</div>
          <div className="flex gap-4">
            <span className="text-cyan-500 hover:text-cyan-400 transition-colors">BLOOMBERG TERMINAL PAIRINGS</span>
            <span>•</span>
            <span className="text-purple-400">GEMINI CLOUD RUN PIPELINES</span>
          </div>
        </footer>
      </div>
    );
  }

  // Gainers & Losers analysis
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  // Core Dashboard shell rendering
  return (
    <div id="dashboard-shell" className="relative min-h-screen bg-brand-deep text-slate-200 flex flex-col font-sans selection:bg-cyan-500/20 overflow-hidden">
      {/* Moving organic liquid background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[130px] animate-blob" />
        <div className="absolute bottom-[15%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[60%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-pink-500/8 blur-[110px] animate-blob animation-delay-4000" />
      </div>

      {/* Platform Navigation Header */}
      <header className="relative bg-brand-deep/55 backdrop-blur-xl border-b border-brand-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setIsLaunched(false)}>
            <div className="w-9 h-9 rounded-xl bg-purple-500/5 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/5">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="font-display font-bold text-xs tracking-wider text-white">STOCKSENTINEL</span>
              <span className="text-[8px] font-mono block text-cyan-400 tracking-widest uppercase">MARKET AUDIT TERMINAL</span>
            </div>
          </div>

          {/* Active Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none font-mono text-[9px]">
            {[
              { id: 'dashboard', label: 'MARKET DASH', icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: 'threats', label: 'RISK RADAR', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> },
              { id: 'predictor', label: 'FORECASTS', icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> },
              { id: 'news', label: 'NEWS INTEL', icon: <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> },
              { id: 'sentiment', label: 'SOCIAL SENTIMENT', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'earnings', label: 'EARNINGS CALLS', icon: <FileText className="w-3.5 h-3.5 text-purple-400" /> },
              { id: 'portfolio', label: 'PORTFOLIO', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'comparison', label: 'STOCK COMPARE', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" /> },
              { id: 'learning', label: 'ACADEMY', icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" /> },
              { id: 'copilot', label: 'AI COPILOT', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
              { id: 'alerts', label: 'ALERTS', icon: <Bell className="w-3.5 h-3.5 text-red-400 animate-bounce" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border uppercase transition-all cursor-pointer shrink-0 tracking-wider ${
                  activeTab === tab.id
                    ? 'bg-purple-500/10 border-purple-500/35 text-purple-200 font-bold'
                    : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            <CommandPalette onSelectTab={setActiveTab} onScanStock={handleScanExternalStock} />
            <div className="font-mono text-[10px] text-slate-400 bg-brand-card px-3 py-2 rounded-lg border border-brand-border flex items-center gap-2 shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>{timeStr}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Indices scrolling line */}
              {renderIndicesLine()}

              {/* Central Index with Candlestick view and tickers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulated Tickers side selector list */}
                <div className="lg:col-span-4 bg-brand-card/50 backdrop-blur-md border border-brand-border p-5 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center pb-3 border-b border-brand-border font-mono text-[10px]">
                    <span className="text-slate-400 font-bold tracking-wider">ASSET CONTEXT SELECTOR</span>
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                      <span>3-SEC TICK INBOUND</span>
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                    {stocks.map((stk) => {
                      const isUp = stk.change >= 0;
                      return (
                        <button
                          key={stk.symbol}
                          onClick={() => setSelectedSymbol(stk.symbol)}
                          className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                            selectedSymbol === stk.symbol
                              ? 'bg-cyan-500/5 border-cyan-500/40 shadow-sm shadow-cyan-500/5'
                              : 'bg-brand-card/30 border-brand-border hover:border-brand-border-hover'
                          }`}
                        >
                          <div className="font-mono">
                            <div className="text-xs font-bold text-white">{stk.symbol}</div>
                            <div className="text-[8px] text-slate-500 uppercase tracking-wide">{stk.name}</div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="text-xs font-bold text-slate-200">${stk.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className={`text-[9px] font-bold flex items-center justify-end gap-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              <span>{isUp ? '+' : ''}{stk.changePercent}%</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Stock interactive Recharts graph */}
                <div className="lg:col-span-8 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-xl space-y-4">
                  {selectedStock ? (
                    <>
                      <div className="flex justify-between items-start border-b border-brand-border pb-4">
                        <div className="font-mono">
                          <h2 className="text-base font-black text-white flex items-center gap-1.5">
                            <span>{selectedStock.symbol}</span>
                            <span className="text-[9px] bg-brand-card border border-brand-border px-2 py-0.5 rounded-md uppercase text-slate-400 font-normal tracking-wide">{selectedStock.sector}</span>
                          </h2>
                          <p className="text-[10px] text-slate-400 uppercase mt-0.5 tracking-wider">{selectedStock.name}</p>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-base font-black text-white">${selectedStock.price}</div>
                          <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%)
                          </div>
                        </div>
                      </div>

                      {/* Recharts Area and Volume chart */}
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={selectedStock.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#475569" style={{ fontSize: '8px', fontFamily: 'JetBrains Mono' }} />
                            <YAxis domain={['auto', 'auto']} stroke="#475569" style={{ fontSize: '8px', fontFamily: 'JetBrains Mono' }} />
                            <Tooltip contentStyle={{ background: '#0c0c0e', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '9px', fontFamily: 'JetBrains Mono', color: '#f1f5f9' }} />
                            <Area type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={1.5} fill="url(#chartGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Volume Bars Recharts overlay */}
                      <div className="h-[50px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={selectedStock.history} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="time" hide />
                            <Bar dataKey="volume" fill="rgba(255, 255, 255, 0.06)" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Info grid metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[10px] text-slate-400 pt-3 border-t border-brand-border">
                        <div>
                          <span className="text-slate-500">DAILY HIGH:</span>
                          <span className="text-slate-200 font-bold block text-xs mt-0.5">${selectedStock.high}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">DAILY LOW:</span>
                          <span className="text-slate-200 font-bold block text-xs mt-0.5">${selectedStock.low}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">OPEN VALUE:</span>
                          <span className="text-slate-200 font-bold block text-xs mt-0.5">${selectedStock.open}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">MARKET CAP:</span>
                          <span className="text-cyan-400 font-bold block text-xs mt-0.5">{selectedStock.marketCap}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center font-mono text-slate-500">
                      <span>LOADING GRAPH ENGINES...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Gainers vs Losers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gainers */}
                <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>TOP SECTOR ACCUMULATORS (GAINERS)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topGainers.map((tg) => (
                      <div key={tg.symbol} className="bg-brand-card/30 border border-brand-border p-3.5 rounded-xl flex justify-between items-center font-mono hover:border-brand-border-hover transition-colors">
                        <div>
                          <div className="text-xs font-bold text-white">{tg.symbol}</div>
                          <div className="text-[8px] text-slate-500 uppercase tracking-wide">{tg.name.split(' ')[0]}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-200 font-bold">${tg.price}</div>
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 justify-end">
                            <ArrowUpRight className="w-3 h-3" />
                            +{tg.changePercent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Losers */}
                <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                  <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>TOP SECTOR LIQUIDATORS (LOSERS)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topLosers.map((tl) => (
                      <div key={tl.symbol} className="bg-brand-card/30 border border-brand-border p-3.5 rounded-xl flex justify-between items-center font-mono hover:border-brand-border-hover transition-colors">
                        <div>
                          <div className="text-xs font-bold text-white">{tl.symbol}</div>
                          <div className="text-[8px] text-slate-500 uppercase tracking-wide">{tl.name.split(' ')[0]}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-200 font-bold">${tl.price}</div>
                          <div className="text-[10px] text-red-400 font-bold flex items-center gap-0.5 justify-end">
                            <ArrowDownRight className="w-3 h-3" />
                            {tl.changePercent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'threats' && (
            <motion.div
              key="threats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ThreatDetector />
            </motion.div>
          )}

          {activeTab === 'predictor' && (
            <motion.div
              key="predictor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StockPredictor />
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NewsIntelligence />
            </motion.div>
          )}

          {activeTab === 'sentiment' && (
            <motion.div
              key="sentiment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SocialSentiment />
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EarningsIntelligence />
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PortfolioTracker />
            </motion.div>
          )}

          {activeTab === 'copilot' && (
            <motion.div
              key="copilot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CopilotChat />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertSystem />
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StockComparison />
            </motion.div>
          )}

          {activeTab === 'learning' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LearningMode />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
