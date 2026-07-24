/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw, Cpu, TrendingDown, Eye, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { ThreatAnalysis } from '../types';
import { motion } from 'motion/react';

const SYMBOLS_LIST = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'BTC', 'ETH', 'COIN'];

export default function ThreatDetector() {
  const [symbol, setSymbol] = useState('NVDA');
  const [userNotes, setUserNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null);

  const fetchThreatAnalysis = async (ticker: string, notes?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/threat-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: ticker, userNotes: notes || '' })
      });
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Threat detection fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatAnalysis(symbol);
  }, [symbol]);

  const handleScan = () => {
    fetchThreatAnalysis(symbol, userNotes);
  };

  // Helper for threat severity badge colors
  const getSeverityStyle = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-500/15 border-red-500/30 text-red-400';
      case 'MEDIUM':
      case 'WARNING':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      default:
        return 'bg-blue-500/15 border-blue-500/30 text-cyan-400';
    }
  };

  return (
    <div id="threat-detector" className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* Control Configuration panel */}
      <div className="lg:col-span-4 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <h2 className="text-xs font-mono font-bold text-slate-200 tracking-wider">THREAT INTELLIGENCE RADAR</h2>
        </div>

        <div>
          <label className="block text-[9px] font-mono text-slate-400 mb-2 uppercase tracking-widest">SELECT AUDIT ASSET</label>
          <div className="flex flex-wrap gap-1.5">
            {SYMBOLS_LIST.map((sym) => (
              <button
                key={sym}
                onClick={() => setSymbol(sym)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  symbol === sym
                    ? 'bg-purple-500/10 border-purple-500 text-purple-200 shadow-md shadow-purple-500/5 font-bold'
                    : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover hover:text-slate-200'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-mono text-slate-400 mb-2 uppercase tracking-widest">AI CUSTOM AUDIT PROMPT (OPTIONAL)</label>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="e.g. Audit recent SEC Form 4 filings for directors, or look for volume breakouts in high-frequency trading books..."
            className="w-full bg-brand-deep/60 border border-brand-border hover:border-brand-border-hover focus:border-purple-500/50 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 outline-none h-24 resize-none transition-all"
          />
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-brand-card text-white font-mono font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>RUNNING AI SECURITY AUDIT...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>SCAN MARKET THREAT DATABASE</span>
            </>
          )}
        </button>

        <div className="p-3.5 bg-brand-deep/40 border border-brand-border rounded-xl text-[10px] font-mono text-slate-500 leading-relaxed">
          <span className="text-red-400 font-bold">DISCLAIMER:</span> StockSentinel Threat Detector monitors abnormal data structures, order cancel ratios, and high-frequency circular trading flows to assign relative risks.
        </div>
      </div>

      {/* Main Indicators Display */}
      <div className="lg:col-span-8 space-y-6">
        {analysis ? (
          <div className="space-y-6">
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-xl">
              {/* Risk Gauge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-brand-border pb-4 md:pb-0 md:pr-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Circular Arc SVG indicator */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="rgba(255, 255, 255, 0.02)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke={analysis.riskScore > 75 ? '#ef4444' : analysis.riskScore > 55 ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="8"
                      strokeDasharray="301.6"
                      strokeDashoffset={301.6 - (301.6 * analysis.riskScore) / 100}
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-2xl font-mono font-bold text-slate-100">{analysis.riskScore}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">RISK SCORE</div>
                  </div>
                </div>
              </div>

              {/* Status metrics details */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-slate-100">{analysis.symbol} : AUDIT PROFILE</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">{analysis.companyName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border tracking-wider ${
                      analysis.riskScore > 75 ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      analysis.riskScore > 55 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                      'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}>
                      {analysis.threatLevel} RISK
                    </span>
                    <div className="text-[9px] font-mono text-slate-500 mt-1.5 uppercase tracking-wide">CONFIDENCE: {analysis.confidence}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3.5">
                  <div className="bg-brand-deep/50 border border-brand-border p-3 rounded-xl text-center">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">SPOOFING</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{analysis.manipulationIndicators.spoofingRisk}%</div>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-cyan-400 h-full" style={{ width: `${analysis.manipulationIndicators.spoofingRisk}%` }} />
                    </div>
                  </div>
                  <div className="bg-brand-deep/50 border border-brand-border p-3 rounded-xl text-center">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">PUMP RISK</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{analysis.manipulationIndicators.pumpAndDumpRisk}%</div>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: `${analysis.manipulationIndicators.pumpAndDumpRisk}%` }} />
                    </div>
                  </div>
                  <div className="bg-brand-deep/50 border border-brand-border p-3 rounded-xl text-center">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">WASH TRADE</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{analysis.manipulationIndicators.washTradingRisk}%</div>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-400 h-full" style={{ width: `${analysis.manipulationIndicators.washTradingRisk}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explainable Summary Block */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-3.5 shadow-xl">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Cpu className="w-4 h-4 animate-pulse-glow" />
                <span>EXPLAINABLE AI THREAT AUDIT REPORT</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-brand-deep/30 border border-brand-border p-4 rounded-xl">
                {analysis.aiReasoning}
              </p>
            </div>

            {/* Danger Grid: Detected Anomalies & Inside trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detected Anomalies */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>DETECTED ANOMALIES</span>
                </div>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                  {analysis.detectedThreats.map((t, idx) => (
                    <div key={idx} className="bg-brand-deep/30 border border-brand-border p-3 rounded-xl space-y-1.5 hover:border-brand-border-hover transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-200 truncate">{t.type}</span>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${getSeverityStyle(t.severity)}`}>
                          {t.severity}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insider Trading Reports */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>SEC INSIDER TRANSACTIONS</span>
                </div>
                <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                  {analysis.insiderActivity.map((ins, idx) => (
                    <div key={idx} className="bg-brand-deep/30 border border-brand-border p-3 rounded-xl flex items-center justify-between font-mono text-[10px] hover:border-brand-border-hover transition-colors">
                      <div>
                        <div className={`font-bold ${ins.buyerSeller.toLowerCase().includes('sell') ? 'text-red-400' : 'text-emerald-400'}`}>
                          {ins.buyerSeller}
                        </div>
                        <div className="text-[8px] text-slate-500 mt-0.5">DATE: {ins.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-200 font-medium">{ins.shares.toLocaleString()} SHARES</div>
                        <div className="text-slate-400 text-[9px] mt-0.5">VALUE: {ins.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Whales blocks */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="text-purple-400 w-4 h-4" />
                <span>WHALE OTC BLOCK MONITOR</span>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left font-mono text-[10px] text-slate-400">
                  <thead>
                    <tr className="border-b border-brand-border text-slate-500 uppercase text-[8px] tracking-wider">
                      <th className="py-2.5">TIMESTAMP</th>
                      <th>ACTION</th>
                      <th className="text-right">VOLUME</th>
                      <th className="text-right">EXEC PRICE</th>
                      <th className="text-right font-bold">BLOCK VALUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.whaleTrades.map((w, idx) => (
                      <tr key={idx} className="border-b border-brand-border/40 hover:bg-brand-deep/20 transition-colors">
                        <td className="py-2.5 text-slate-500">{w.time}</td>
                        <td>
                          <span className={`font-bold ${w.action === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {w.action}
                          </span>
                        </td>
                        <td className="text-right text-slate-300 font-medium">{w.shares.toLocaleString()}</td>
                        <td className="text-right text-slate-300">${w.price.toFixed(2)}</td>
                        <td className="text-right text-cyan-400 font-bold">{w.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
            <div className="text-center font-mono space-y-3.5 text-slate-400">
              <Cpu className="w-8 h-8 animate-spin mx-auto text-purple-400" />
              <div className="tracking-widest uppercase text-xs">LOADING RISK CORE MATRIX...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
