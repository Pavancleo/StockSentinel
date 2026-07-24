/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, ArrowUpRight, ArrowDownRight, Award, ChevronRight, Activity, Percent, ShieldCheck } from 'lucide-react';
import { PortfolioStock } from '../types';
import { motion } from 'motion/react';

const PORTFOLIO_ASSETS: PortfolioStock[] = [
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    shares: 150,
    averageBuyPrice: 1720.00,
    currentPrice: 1850.40,
    investedValue: 258000,
    currentValue: 277560,
    profitLoss: 19560,
    profitLossPercent: 7.58,
    allocationPercent: 28.5,
    healthScore: 92,
    recommendation: 'ACCUMULATE: Strong enterprise AI deal momentum and steady operating margins.'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    shares: 50,
    averageBuyPrice: 3820.00,
    currentPrice: 3920.80,
    investedValue: 191000,
    currentValue: 196040,
    profitLoss: 5040,
    profitLossPercent: 2.64,
    allocationPercent: 20.1,
    healthScore: 89,
    recommendation: 'HOLD: Tier-1 IT market leadership with consistent order book execution.'
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    shares: 100,
    averageBuyPrice: 2880.00,
    currentPrice: 2985.50,
    investedValue: 288000,
    currentValue: 298550,
    profitLoss: 10550,
    profitLossPercent: 3.66,
    allocationPercent: 30.7,
    healthScore: 94,
    recommendation: 'STRONG BUY: Green hydrogen expansion and telecom Jio ARPU growth.'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    shares: 120,
    averageBuyPrice: 1580.00,
    currentPrice: 1642.30,
    investedValue: 189600,
    currentValue: 197076,
    profitLoss: 7476,
    profitLossPercent: 3.94,
    allocationPercent: 20.2,
    healthScore: 88,
    recommendation: 'ACCUMULATE: Core credit growth and deposit accretion remain healthy.'
  }
];

export default function PortfolioTracker() {
  // Aggregate calculations
  const totalCost = PORTFOLIO_ASSETS.reduce((sum, s) => sum + s.investedValue, 0);
  const totalValue = PORTFOLIO_ASSETS.reduce((sum, s) => sum + s.currentValue, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = (totalPL / totalCost) * 100;
  const portfolioHealth = Math.floor(PORTFOLIO_ASSETS.reduce((sum, s) => sum + s.healthScore, 0) / PORTFOLIO_ASSETS.length);

  return (
    <div id="portfolio-tracker" className="space-y-6 font-sans">
      {/* Dynamic Key Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total portfolio value */}
        <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-5 rounded-2xl shadow-xl space-y-2 font-mono">
          <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 tracking-wider font-bold">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTFOLIO BALANCE</span>
          </div>
          <div className="text-xl font-bold text-slate-100">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[9px] text-slate-500 tracking-wide">BASE METRIC: INR INDEXED</div>
        </div>

        {/* Invested Cost */}
        <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-5 rounded-2xl shadow-xl space-y-2 font-mono">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">ACQUISITION COST</div>
          <div className="text-xl font-bold text-slate-100">₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[9px] text-slate-500 tracking-wide">SECURE CASH RESERVES DEPLOYED</div>
        </div>

        {/* Net return PL */}
        <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-5 rounded-2xl shadow-xl space-y-2 font-mono">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">UNREALIZED NET RETURNS</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>₹{totalPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="text-[9px] text-emerald-500 font-bold tracking-wide">+{totalPLPercent.toFixed(2)}% ALL-TIME YIELD</div>
        </div>

        {/* Portfolio health rating */}
        <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-5 rounded-2xl shadow-xl space-y-2 font-mono">
          <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 tracking-wider font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>PORTFOLIO HEALTH RATING</span>
          </div>
          <div className="text-xl font-bold text-purple-400">{portfolioHealth} / 100</div>
          <div className="w-full bg-brand-deep h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${portfolioHealth}%` }} />
          </div>
        </div>
      </div>

      {/* Main Asset table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table representation */}
        <div className="lg:col-span-8 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest border-b border-brand-border/40 pb-2.5">ACTIVE ASSETS INVENTORY</div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] text-slate-400">
              <thead>
                <tr className="border-b border-brand-border text-slate-500 text-[8px] uppercase tracking-wider">
                  <th className="py-2.5">ASSET</th>
                  <th className="text-right">UNITS</th>
                  <th className="text-right">BUY PRICE</th>
                  <th className="text-right">CURRENT PRICE</th>
                  <th className="text-right">NET YIELD</th>
                  <th className="text-right">ALLOCATION</th>
                </tr>
              </thead>
              <tbody>
                {PORTFOLIO_ASSETS.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-brand-border/40 hover:bg-brand-deep/20 transition-all">
                    <td className="py-3">
                      <div className="font-bold text-slate-100">{asset.symbol}</div>
                      <div className="text-[8px] text-slate-500 uppercase mt-0.5">{asset.name}</div>
                    </td>
                    <td className="text-right text-slate-300 font-medium">{asset.shares}</td>
                    <td className="text-right text-slate-400">${asset.averageBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="text-right text-cyan-400 font-bold">${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">
                      <div className={`font-bold ${asset.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ${asset.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[8px] font-bold ${asset.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        +{asset.profitLossPercent}%
                      </div>
                    </td>
                    <td className="text-right font-bold text-slate-300">{asset.allocationPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="lg:col-span-4 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-xl space-y-4">
          <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2 border-b border-brand-border/40 pb-2.5">
            <Award className="w-4 h-4 text-purple-400" />
            <span>AI BALANCING CONGRUENCE</span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
            {PORTFOLIO_ASSETS.map((asset) => (
              <div key={asset.symbol} className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-200">{asset.symbol} RECOMMENDED ACTION</span>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    asset.healthScore > 85 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    asset.healthScore > 70 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    HEALTH: {asset.healthScore}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  {asset.recommendation}
                </p>
              </div>
            ))}
          </div>

          {/* Unified reallocation summary */}
          <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-xl text-[10px] font-sans text-slate-300 leading-relaxed flex gap-2.5">
            <Activity className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="text-purple-400 font-mono text-[9px] block uppercase tracking-wider font-bold mb-0.5">GLOBAL PORTFOLIO ADVICE:</strong>
              Your current technology/crypto allocation exceeds 70.5% optimal baseline thresholds. We advise diversifying 5.5% into defensive assets to maintain protection margins.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
