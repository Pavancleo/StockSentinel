/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { TrendingUp, Award, ArrowUpRight, ArrowDownRight, Activity, Zap, Layers, BarChart2 } from 'lucide-react';
import { StockPrediction } from '../types';
import { motion } from 'motion/react';

const SYMBOLS = ['INFY', 'TCS', 'RELIANCE', 'HDFCBANK', 'TATAMOTORS', 'ICICIBANK', 'WIPRO', 'BHARTIARTL'];

export default function StockPredictor() {
  const [symbol, setSymbol] = useState('INFY');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockPrediction | null>(null);

  const fetchPrediction = async (ticker: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: ticker })
      });
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Prediction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(symbol);
  }, [symbol]);

  // Helper styles for recommendations
  const getRecColor = (rec: string) => {
    if (rec.includes('BUY')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (rec.includes('SELL')) return 'text-red-400 border-red-500/30 bg-red-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  // Custom Chart Tooltip styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-deep/95 border border-brand-border p-3.5 rounded-xl font-mono text-[10px] space-y-1 text-slate-300 backdrop-blur-md shadow-xl">
          <div className="text-slate-500 border-b border-brand-border pb-1 mb-1 font-bold">{label}</div>
          <div className="flex justify-between gap-4">
            <span>AI FORECAST:</span>
            <span className="text-cyan-400 font-bold">${payload[0].value.toFixed(2)}</span>
          </div>
          {payload[1] && payload[2] && (
            <>
              <div className="flex justify-between gap-4 text-emerald-400">
                <span>CONFIDENCE MAX:</span>
                <span>${payload[1].value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 text-red-400">
                <span>CONFIDENCE MIN:</span>
                <span>${payload[2].value.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="stock-predictor" className="space-y-6 font-sans">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel px-6 py-5 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-white tracking-wider uppercase">AI MULTI-HORIZON PROJECTIONS</h2>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">NEURAL FORECAST MODELS & TECHNICAL OSCILLATORS</p>
          </div>
        </div>

        {/* Ticker Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono py-1">
          {SYMBOLS.map((sym) => (
            <button
              key={sym}
              onClick={() => setSymbol(sym)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                symbol === sym
                  ? 'glass-pill-active text-white font-bold'
                  : 'glass-pill text-slate-300 hover:text-white'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Forecast Chart Card */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-300 pb-3 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>FORECAST CURVE (10-DAY STEPPING INTERVAL)</span>
              </span>
              <span className="text-purple-300 font-bold tracking-wider">CONFIDENCE INTERVAL: {data.confidence}%</span>
            </div>

            {/* Interactive Area Chart */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.predictions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.06}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" />
                  <XAxis dataKey="date" stroke="#475569" style={{ fontSize: '9px', fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={['auto', 'auto']} stroke="#475569" style={{ fontSize: '9px', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Support and Resistance Indicators */}
                  <ReferenceLine y={data.support} stroke="#ef4444" strokeDasharray="3 3" label={{ value: `SUPPORT $${data.support}`, position: 'insideBottomRight', fill: '#ef4444', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
                  <ReferenceLine y={data.resistance} stroke="#10b981" strokeDasharray="3 3" label={{ value: `RESISTANCE $${data.resistance}`, position: 'insideTopRight', fill: '#10b981', fontSize: 8, fontFamily: 'JetBrains Mono' }} />

                  {/* Predicted price line */}
                  <Area type="monotone" dataKey="predictedPrice" stroke="#0ea5e9" strokeWidth={1.8} fill="url(#predictedGrad)" />
                  {/* Upper and lower bound confidence intervals */}
                  <Area type="monotone" dataKey="upperBound" stroke="#a855f7" strokeWidth={0.8} strokeDasharray="2 2" fill="none" />
                  <Area type="monotone" dataKey="lowerBound" stroke="#a855f7" strokeWidth={0.8} strokeDasharray="2 2" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Support and Resistance Footnotes */}
            <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-400 bg-brand-deep/30 p-3.5 rounded-xl border border-brand-border/40">
              <div className="flex items-center justify-between">
                <span>SUPPORT BARRIER:</span>
                <span className="text-red-400 font-bold">${data.support}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RESISTANCE WALL:</span>
                <span className="text-emerald-400 font-bold">${data.resistance}</span>
              </div>
            </div>
          </div>

          {/* AI Recommendation Panel Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4 text-purple-400 animate-pulse-glow" />
                <span>AI STRATEGIC SIGNAL</span>
              </div>

              <div className="text-center space-y-2.5 p-4 bg-brand-deep/50 border border-brand-border rounded-xl">
                <div className={`text-base font-mono font-black py-2 rounded-lg border uppercase tracking-wider ${getRecColor(data.recommendation)}`}>
                  {data.recommendation.replace('_', ' ')}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2">
                  <span>CONFIDENCE RATIO:</span>
                  <span className="text-slate-100 font-bold">{data.confidence}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                  <span>EXPECTED RETURN:</span>
                  <span className={`font-bold flex items-center gap-0.5 ${data.growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.growthPercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {data.growthPercent}%
                  </span>
                </div>
              </div>

              {/* Target Price Milestones list */}
              <div className="space-y-2 font-mono text-[11px]">
                <div className="text-[9px] text-slate-500 uppercase pb-1.5 border-b border-brand-border tracking-wider font-bold">TARGET TIMELINES</div>
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/40 text-slate-300">
                  <span>TOMORROW</span>
                  <span className="text-slate-100 font-bold">${data.targets.tomorrow}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/40 text-slate-300">
                  <span>1 WEEK OUT</span>
                  <span className="text-slate-100 font-bold">${data.targets.oneWeek}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/40 text-slate-300">
                  <span>1 MONTH OUT</span>
                  <span className="text-slate-100 font-bold">${data.targets.oneMonth}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 text-slate-300">
                  <span>3 MONTHS OUT</span>
                  <span className="text-cyan-400 font-black">${data.targets.threeMonths}</span>
                </div>
              </div>
            </div>

            {/* Neural Oscillator gauges */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>NEURAL TECHNICAL GRID</span>
              </div>

              <div className="space-y-3.5 font-mono text-[10px]">
                {/* RSI Indicator Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>RELATIVE STRENGTH INDEX (RSI):</span>
                    <span className={`font-bold ${data.indicators.rsi > 70 ? 'text-red-400' : data.indicators.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>{data.indicators.rsi}</span>
                  </div>
                  <div className="w-full bg-brand-deep/50 h-2 rounded border border-brand-border overflow-hidden relative">
                    <div className="absolute left-[30%] right-[30%] h-full bg-brand-border/30" /> {/* RSI Normal Range Shade */}
                    <div
                      className="bg-cyan-400 h-full transition-all duration-1000"
                      style={{ width: `${data.indicators.rsi}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500">
                    <span>OVERSOLD (30)</span>
                    <span>OVERBOUGHT (70)</span>
                  </div>
                </div>

                {/* MACD Gauge */}
                <div className="flex items-center justify-between py-2 border-b border-brand-border/40 text-slate-300">
                  <span className="text-slate-400">MACD OSCILLATOR:</span>
                  <span className={`font-bold ${data.indicators.macd === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>{data.indicators.macd}</span>
                </div>

                {/* EMA/SMA Indicator */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">MOVING AVERAGES CONFLUENCE:</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded border text-[9px] ${data.indicators.movingAverage === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {data.indicators.movingAverage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ⭐ Unique Innovation - Bull vs Bear AI Debate */}
          {data.bullVsBear && (
            <div className="col-span-12 bg-gradient-to-br from-brand-card/70 to-brand-card/40 border border-brand-border/60 p-6 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden mt-2">
              {/* Background gradient lights */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-border/40 relative z-10">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-red-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>UNIQUE INNOVATION</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2 font-mono">
                    <span>BULL VS BEAR AI DEBATE</span>
                  </h3>
                </div>
                <div className="text-[10px] bg-brand-deep/80 border border-brand-border px-3 py-1.5 rounded-lg text-slate-400 font-mono tracking-wide">
                  MODEL: <span className="text-purple-400 font-bold">GEMINI 3.5 FLASH DEBATE ENGINE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Bull AI Column */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-500/10">
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/30">
                      <span className="text-emerald-400 text-sm">🟢</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-emerald-400 tracking-wider">BULL AI ARGUMENT</h4>
                      <p className="text-[9px] text-slate-500 font-mono">REASONS TO ENTER / BUY</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {data.bullVsBear.bullReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-300">
                        <span className="text-emerald-400 font-bold mt-0.5 font-mono">✔</span>
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bear AI Column */}
                <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-red-500/10">
                    <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/30">
                      <span className="text-red-400 text-sm">🔴</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-red-400 tracking-wider">BEAR AI ARGUMENT</h4>
                      <p className="text-[9px] text-slate-500 font-mono">REASONS TO WAIT / SHORT</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {data.bullVsBear.bearReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-300">
                        <span className="text-red-400 font-bold mt-0.5 font-mono">✖</span>
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final AI Verdict */}
              <div className="bg-brand-deep/40 border border-brand-border/60 p-5 rounded-xl space-y-3.5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-wide uppercase flex items-center gap-2">
                    <span>⚖️</span> FINAL AI VERDICT
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">SIGNAL: <strong className="text-emerald-400 font-black">{data.recommendation}</strong></span>
                    <span className="text-slate-500">CONFIDENCE: <strong className="text-cyan-400 font-black">{data.confidence}%</strong></span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans pl-6 border-l-2 border-cyan-500/40">
                  {data.bullVsBear.finalVerdict}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
          <div className="text-center font-mono space-y-3.5 text-slate-400">
            <Activity className="w-8 h-8 animate-pulse mx-auto text-cyan-400" />
            <div className="tracking-widest uppercase text-xs">COMPILING WAVE PATTERNS...</div>
          </div>
        </div>
      )}
    </div>
  );
}
