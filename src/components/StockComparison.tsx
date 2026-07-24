/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, AlertTriangle, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

const ASSETS = [
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1850.40, sector: 'IT Services' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.80, sector: 'IT Services' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2985.50, sector: 'Energy & Conglomerate' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1642.30, sector: 'Financial Services' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 985.60, sector: 'Automobile' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1224.75, sector: 'Financial Services' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 512.30, sector: 'IT Services' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1435.10, sector: 'Telecommunications' }
];

export default function StockComparison() {
  const [stockA, setStockA] = useState('INFY');
  const [stockB, setStockB] = useState('TCS');
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      // We will make two parallel calls to /api/predict to get authentic live technical indicators
      const [resA, resB] = await Promise.all([
        fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: stockA })
        }),
        fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: stockB })
        })
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      // Formulate smart comparison report card
      const rsiDiff = dataA.indicators.rsi - dataB.indicators.rsi;
      const momentumWinner = Math.abs(rsiDiff) < 5 
        ? 'TIE' 
        : (rsiDiff > 0 && dataA.indicators.rsi <= 70) || (rsiDiff < 0 && dataB.indicators.rsi < 30) ? 'A' : 'B';

      const confWinner = dataA.confidence >= dataB.confidence ? 'A' : 'B';
      const returnWinner = dataA.growthPercent >= dataB.growthPercent ? 'A' : 'B';

      setCompareData({
        a: dataA,
        b: dataB,
        momentumWinner,
        confWinner,
        returnWinner,
        summary: `Analytical duel between ${stockA} and ${stockB} reveals distinct technical structures. ${stockA} showcases a ${dataA.recommendation} stance with ${dataA.confidence}% model confidence, whereas ${stockB} carries a ${dataB.recommendation} signal with ${dataB.confidence}% model confidence.`
      });
    } catch (err) {
      console.error('Comparison data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [stockA, stockB]);

  const assetA = ASSETS.find(a => a.symbol === stockA);
  const assetB = ASSETS.find(a => a.symbol === stockB);

  return (
    <div id="stock-comparison" className="space-y-6 font-sans">
      {/* Selection Panel */}
      <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">DUAL ASSET COMPARISON ENGINE</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">SIDE-BY-SIDE TECHNICAL INTERFEROMETRY & RECOMMENDATIONS</p>
          </div>
        </div>

        {/* Pickers */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={stockA}
            onChange={(e) => {
              if (e.target.value !== stockB) setStockA(e.target.value);
            }}
            className="flex-1 md:flex-initial bg-brand-deep border border-brand-border text-slate-200 text-xs rounded-lg px-3.5 py-2 font-mono focus:outline-none focus:border-purple-500"
          >
            {ASSETS.map(a => (
              <option key={a.symbol} value={a.symbol} disabled={a.symbol === stockB}>
                {a.symbol} - {a.name}
              </option>
            ))}
          </select>

          <span className="text-slate-500 font-mono text-xs font-bold">VS</span>

          <select
            value={stockB}
            onChange={(e) => {
              if (e.target.value !== stockA) setStockB(e.target.value);
            }}
            className="flex-1 md:flex-initial bg-brand-deep border border-brand-border text-slate-200 text-xs rounded-lg px-3.5 py-2 font-mono focus:outline-none focus:border-purple-500"
          >
            {ASSETS.map(a => (
              <option key={a.symbol} value={a.symbol} disabled={a.symbol === stockA}>
                {a.symbol} - {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
          <div className="text-center font-mono space-y-3.5 text-slate-400">
            <ArrowLeftRight className="w-8 h-8 animate-spin mx-auto text-purple-400" />
            <div className="tracking-widest uppercase text-xs">CALCULATING CORRELATIONS & INDICATORS...</div>
          </div>
        </div>
      ) : compareData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset A Summary Card */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border/60 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-start pb-3 border-b border-brand-border/40">
                <div>
                  <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md uppercase text-cyan-400 font-mono">{assetA?.sector}</span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{assetA?.symbol}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{assetA?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">${compareData.a.currentPrice}</div>
                  <div className={`text-[10px] font-mono font-bold ${compareData.a.growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {compareData.a.growthPercent >= 0 ? '+' : ''}{compareData.a.growthPercent}% Est. Growth
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">RSI MOMENTUM:</span>
                  <span className="text-slate-200 font-bold">{compareData.a.indicators.rsi}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">MACD OSCILLATOR:</span>
                  <span className={`font-bold ${compareData.a.indicators.macd === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>{compareData.a.indicators.macd}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">MOVING AVERAGES:</span>
                  <span className={`font-bold ${compareData.a.indicators.movingAverage === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{compareData.a.indicators.movingAverage}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">SUPPORT BARRIER:</span>
                  <span className="text-red-400">${compareData.a.support}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">RESISTANCE WALL:</span>
                  <span className="text-emerald-400">${compareData.a.resistance}</span>
                </div>
              </div>
            </div>

            {/* Asset B Summary Card */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border/60 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-start pb-3 border-b border-brand-border/40">
                <div>
                  <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md uppercase text-purple-400 font-mono">{assetB?.sector}</span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{assetB?.symbol}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{assetB?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">${compareData.b.currentPrice}</div>
                  <div className={`text-[10px] font-mono font-bold ${compareData.b.growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {compareData.b.growthPercent >= 0 ? '+' : ''}{compareData.b.growthPercent}% Est. Growth
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">RSI MOMENTUM:</span>
                  <span className="text-slate-200 font-bold">{compareData.b.indicators.rsi}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">MACD OSCILLATOR:</span>
                  <span className={`font-bold ${compareData.b.indicators.macd === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>{compareData.b.indicators.macd}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">MOVING AVERAGES:</span>
                  <span className={`font-bold ${compareData.b.indicators.movingAverage === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{compareData.b.indicators.movingAverage}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/20">
                  <span className="text-slate-400">SUPPORT BARRIER:</span>
                  <span className="text-red-400">${compareData.b.support}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">RESISTANCE WALL:</span>
                  <span className="text-emerald-400">${compareData.b.resistance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Matrices Duel */}
          <div className="bg-gradient-to-br from-brand-card/70 to-brand-card/40 border border-brand-border p-6 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border/40">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">INTELLIGENT DECISION DUEL REPORT</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Feature Battle */}
              <div className="space-y-3">
                <div className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase">PERFORMANCE ADVANTAGE REPORT</div>
                
                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-deep/40 border border-brand-border/30">
                    <span className="text-slate-400">BETTER MOMENTUM</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {compareData.momentumWinner === 'A' ? stockA : compareData.momentumWinner === 'B' ? stockB : 'TIE'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-deep/40 border border-brand-border/30">
                    <span className="text-slate-400">HIGHER CONVERGENCE MOOD</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {compareData.a.indicators.macd === 'BULLISH' && compareData.b.indicators.macd !== 'BULLISH' ? stockA : compareData.b.indicators.macd === 'BULLISH' && compareData.a.indicators.macd !== 'BULLISH' ? stockB : 'TIE'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-deep/40 border border-brand-border/30">
                    <span className="text-slate-400">HIGHER EST. PROJECTION RETURN</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {compareData.returnWinner === 'A' ? stockA : stockB}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-deep/40 border border-brand-border/30">
                    <span className="text-slate-400">HIGHER PREDICTIVE CONFIDENCE</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {compareData.confWinner === 'A' ? stockA : stockB} ({Math.max(compareData.a.confidence, compareData.b.confidence)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Side-by-side Strategy signals */}
              <div className="space-y-4">
                <div className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase">AI STRATEGIC RECONCILIATION</div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-brand-deep/60 border border-brand-border/40 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">{stockA} STRATEGY</div>
                    <div className={`text-xs font-bold py-1 px-2.5 rounded border inline-block ${compareData.a.recommendation.includes('BUY') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {compareData.a.recommendation}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono pt-1">Confidence {compareData.a.confidence}%</div>
                  </div>

                  <div className="bg-brand-deep/60 border border-brand-border/40 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">{stockB} STRATEGY</div>
                    <div className={`text-xs font-bold py-1 px-2.5 rounded border inline-block ${compareData.b.recommendation.includes('BUY') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                      {compareData.b.recommendation}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono pt-1">Confidence {compareData.b.confidence}%</div>
                  </div>
                </div>

                <div className="bg-brand-deep/30 border border-brand-border/50 p-4 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-bold">ANALYSIS SYNTHESIS:</span> {compareData.summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
