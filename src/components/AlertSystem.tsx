/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldCheck, Zap, HelpCircle, X, Trash, RefreshCw } from 'lucide-react';
import { AlertNotification } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    type: 'PUMP_DUMP',
    title: 'POSSIBLE PUMP-AND-DUMP DETECTED',
    message: 'Abnormal social media posting frequency coupled with circular block buying orders detected in micro-cap SPAC pools.',
    symbol: 'SPAC',
    severity: 'CRITICAL',
    time: '2 mins ago',
    unread: true
  },
  {
    id: 'alt-2',
    type: 'PRICE_CRASH',
    title: 'BITCOIN LIQUIDATION CASCADE',
    message: 'Leveraged derivatives trading blocks wiped out $450M, dragging spot rates down 1.7% in under ten minutes.',
    symbol: 'BTC',
    severity: 'HIGH',
    time: '18 mins ago',
    unread: true
  },
  {
    id: 'alt-3',
    type: 'MANIPULATION',
    title: 'ORDER BOOK SPOOFING DETECTED',
    message: 'High-frequency algorithms placing and cancelling substantial block supports near current apple bids.',
    symbol: 'AAPL',
    severity: 'WARNING',
    time: '1 hour ago',
    unread: false
  },
  {
    id: 'alt-4',
    type: 'PORTFOLIO_RISK',
    title: 'HIGH POSITION CONCENTRATION',
    message: 'NVIDIA holdings exceed 38.6% of total investment values. Exposure margins have crossed the baseline limit.',
    symbol: 'NVDA',
    severity: 'WARNING',
    time: '2 hours ago',
    unread: false
  }
];

export default function AlertSystem() {
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL'>('ALL');

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, unread: !a.unread } : a)));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'UNREAD') return a.unread;
    if (filter === 'CRITICAL') return a.severity === 'CRITICAL' || a.severity === 'HIGH';
    return true;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'HIGH':
        return 'border-orange-500/40 bg-orange-500/10 text-orange-400';
      case 'WARNING':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      default:
        return 'border-blue-500/30 bg-blue-500/10 text-cyan-400';
    }
  };

  return (
    <div id="alert-console" className="space-y-6 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-card/50 backdrop-blur-md border border-brand-border px-6 py-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Bell className="w-4 h-4 text-red-400 animate-swing" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 tracking-wider uppercase">LIVE ANOMALY ALERTS ENGINE</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">SECURE HIGH-FREQUENCY MARKET PATTERN TRIGGERS</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            {['ALL', 'UNREAD', 'CRITICAL'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-red-500/10 border-red-500 text-red-200 font-bold'
                    : 'bg-brand-card/40 border-brand-border text-slate-400 hover:border-brand-border-hover hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={markAllRead}
            className="bg-brand-deep/60 hover:bg-brand-deep border border-brand-border hover:border-brand-border-hover text-slate-300 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer hover:-translate-y-0.5"
          >
            MARK ALL AS READ
          </button>
        </div>
      </div>

      {/* Alert Cards Container */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alt) => (
              <motion.div
                key={alt.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className={`border p-5 rounded-2xl backdrop-blur-md flex items-start gap-4 shadow-xl transition-all relative group ${getSeverityStyle(
                  alt.severity
                )}`}
              >
                {/* Active Unread Glow Ring */}
                {alt.unread && (
                  <span className="absolute top-5 left-5 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                )}

                {/* Left severity indicator icon */}
                <div className="shrink-0 mt-0.5 ml-1">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                {/* Core text details */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider">{alt.title}</h3>
                    <span className="text-[9px] font-mono opacity-60 shrink-0">{alt.time}</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-85 leading-relaxed">{alt.message}</p>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[9px] opacity-75">
                    <span>TICKER CONTEXT:</span>
                    <span className="bg-brand-deep border border-brand-border px-2 py-0.5 rounded-lg text-cyan-400 font-bold">
                      {alt.symbol}
                    </span>
                    <span className="ml-auto">SEVERITY LEVEL: {alt.severity}</span>
                  </div>
                </div>

                {/* Actions (Delete, toggle read) */}
                <div className="flex flex-col items-center gap-1.5 ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleRead(alt.id)}
                    className="p-1.5 hover:bg-brand-deep rounded-lg transition-colors"
                    title={alt.unread ? 'Mark as read' : 'Mark as unread'}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => deleteAlert(alt.id)}
                    className="p-1.5 hover:bg-brand-deep rounded-lg transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-[200px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
              <div className="text-center font-mono space-y-2 text-slate-500">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs uppercase tracking-wider">ALL CRITICAL THREATS ARE INACTIVE / CLEAR</div>
                <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">SYS SECURED AT LEVEL-1 INDEX</div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
