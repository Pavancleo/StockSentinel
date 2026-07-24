/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Terminal, ArrowRight, Shield, TrendingUp, Users, Cpu, FileText, Bell, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandItem {
  id: string;
  category: string;
  command: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  onSelectTab: (tabId: string) => void;
  onScanStock: (symbol: string) => void;
}

export default function CommandPalette({ onSelectTab, onScanStock }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Register global key bindings (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const COMMAND_ITEMS: CommandItem[] = [
    {
      id: 'go-dash',
      category: 'NAVIGATION',
      command: 'GO TO MARKET DASHBOARD',
      shortcut: 'G + D',
      icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => {
        onSelectTab('dashboard');
        setOpen(false);
      }
    },
    {
      id: 'go-threats',
      category: 'NAVIGATION',
      command: 'GO TO MARKET THREAT SCANNERS',
      shortcut: 'G + T',
      icon: <Shield className="w-3.5 h-3.5 text-red-400" />,
      action: () => {
        onSelectTab('threats');
        setOpen(false);
      }
    },
    {
      id: 'go-predict',
      category: 'NAVIGATION',
      command: 'GO TO AI STOCK PREDICTOR',
      shortcut: 'G + P',
      icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => {
        onSelectTab('predictor');
        setOpen(false);
      }
    },
    {
      id: 'go-news',
      category: 'NAVIGATION',
      command: 'GO TO LIVE NEWS INTEL',
      shortcut: 'G + N',
      icon: <FileText className="w-3.5 h-3.5 text-emerald-400" />,
      action: () => {
        onSelectTab('news');
        setOpen(false);
      }
    },
    {
      id: 'go-sentiment',
      category: 'NAVIGATION',
      command: 'GO TO SOCIAL SENTIMENT DIALS',
      shortcut: 'G + S',
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => {
        onSelectTab('sentiment');
        setOpen(false);
      }
    },
    {
      id: 'go-earnings',
      category: 'NAVIGATION',
      command: 'GO TO EARNINGS INTELLIGENCE AUDITS',
      shortcut: 'G + E',
      icon: <FileText className="w-3.5 h-3.5 text-purple-400" />,
      action: () => {
        onSelectTab('earnings');
        setOpen(false);
      }
    },
    {
      id: 'go-portfolio',
      category: 'NAVIGATION',
      command: 'GO TO PORTFOLIO BALANCING',
      shortcut: 'G + O',
      icon: <Briefcase className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => {
        onSelectTab('portfolio');
        setOpen(false);
      }
    },
    {
      id: 'go-copilot',
      category: 'NAVIGATION',
      command: 'GO TO AI FINANCIAL COPILOT',
      shortcut: 'G + C',
      icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
      action: () => {
        onSelectTab('copilot');
        setOpen(false);
      }
    },
    // Stock instant queries
    {
      id: 'scan-infy',
      category: 'INSTANT SCAN',
      command: 'AUDIT INFOSYS LTD. (INFY) RISK PROFILE',
      icon: <Shield className="w-3.5 h-3.5 text-purple-400 animate-pulse" />,
      action: () => {
        onScanStock('INFY');
        onSelectTab('threats');
        setOpen(false);
      }
    },
    {
      id: 'scan-tcs',
      category: 'INSTANT SCAN',
      command: 'AUDIT TATA CONSULTANCY SERVICES (TCS) RISK PROFILE',
      icon: <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />,
      action: () => {
        onScanStock('TCS');
        onSelectTab('threats');
        setOpen(false);
      }
    },
    {
      id: 'scan-reliance',
      category: 'INSTANT SCAN',
      command: 'AUDIT RELIANCE INDUSTRIES (RELIANCE) THREAT DATA',
      icon: <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
      action: () => {
        onScanStock('RELIANCE');
        onSelectTab('threats');
        setOpen(false);
      }
    }
  ];

  const filteredItems = COMMAND_ITEMS.filter(
    (item) =>
      item.command.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Keyboard Shortcut Indicator Button in Nav */}
      <button
        onClick={() => setOpen(true)}
        className="glass-pill text-[10px] text-slate-300 px-3.5 py-2 rounded-full border border-white/15 hover:border-white/30 flex items-center gap-2 cursor-pointer transition-all font-mono"
      >
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span>COMMAND CENTER</span>
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded-full text-[8px] border border-white/20 text-slate-300 font-mono">
          Ctrl+K
        </kbd>
      </button>

      {/* Floating Modal Backdrop */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
            {/* Close Backdrop Trigger */}
            <div className="absolute inset-0" onClick={() => setOpen(false)} />

            {/* Main Palette Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="w-full max-w-xl glass-panel rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/20"
            >
              {/* Search input line */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 bg-white/5">
                <Search className="w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or jump parameter..."
                  className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-400 text-xs outline-none py-1 font-mono"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-mono glass-pill text-slate-400 px-2 py-0.5 rounded-full border border-white/15 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Items scroll area */}
              <div className="max-h-[320px] overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl glass-panel-interactive flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-cyan-400/40 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {item.command}
                          </div>
                          <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      {item.shortcut ? (
                        <kbd className="text-[8px] font-mono glass-pill text-slate-300 px-2 py-0.5 rounded-full group-hover:text-cyan-300 transition-colors">
                          {item.shortcut}
                        </kbd>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 font-mono text-[10px] space-y-1">
                    <div>NO COMMAND MATCHES FOR "{query.toUpperCase()}"</div>
                    <div className="text-slate-500">TRY TYPING "GO" OR "SCAN"</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
