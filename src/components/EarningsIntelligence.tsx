/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Cpu, ArrowUpRight, ArrowDownRight, Printer, RefreshCw, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import { EarningsIntelligence as EarningsType } from '../types';
import { motion } from 'motion/react';

const EARNINGS_TEMPLATES = {
  TSLA: {
    label: 'Tesla Q3 Earnings Draft',
    transcript: `Good afternoon everyone, and welcome to our Q3 2026 Earnings Call. 
This quarter we achieved a record delivery run rate of 495,000 electric vehicles. Consolidated revenues scaled 8.4% YoY to $26.8 billion, with Energy storage operations growing 140% as Megapack production hit record efficiencies.
Our auto segment gross margins improved to 19.2% driven by reduced structural battery pack pack manufacturing assembly costs. 
In terms of guidance, we are targeting 20% delivery growth in FY2027 and expect our Cybercab production pilot lines to commence in early Q1 2027. We expect elevated capital spending of $10.5 billion to support active supercomputing clusters.`
  },
  NVDA: {
    label: 'NVIDIA Q2 Performance Script',
    transcript: `Welcome to NVIDIA's Fiscal Q2 2026 Financial Briefing. 
We report staggering datacenter revenues of $26.3 billion, representing 152% growth YoY, driven by unstoppable demand for Hopper H200 and early scaling of Blackwell clusters. Total consolidated revenues rose to $30.0 billion.
Gross margins remain elite at 75.1%. Capital expenditures are climbing as we deploy more custom manufacturing nodes, though foundry allocation constraints persist. 
For Q3, we project revenue of $32.5 billion, plus or minus 2%, with continued solid margins. Next-generation Rubin systems remain on schedule for late 2026 deployment.`
  },
  AAPL: {
    label: 'Apple Q4 Services Report',
    transcript: `Thank you for joining Apple's Q4 Fiscal 2026 review. 
Consolidated net revenues hit $94.8 billion, a record for our September quarter, up 6% YoY. services sector revenue reached an all-time high of $25.8 billion, driven by over 1.1 billion active paid subscriptions across Apple Intelligence pipelines.
We sustained strong margins of 46.2% but note regulatory and antitrust headwind variables that could introduce minor commercial hurdles in European channels. 
Our guidance points to stable mid-single-digit product accelerations in the December quarter.`
  }
};

export default function EarningsIntelligence() {
  const [symbol, setSymbol] = useState('NVDA');
  const [transcript, setTranscript] = useState(EARNINGS_TEMPLATES.NVDA.transcript);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarningsType | null>(null);

  const triggerAnalysis = async (ticker: string, text: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: ticker, transcriptText: text })
      });
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Earnings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    triggerAnalysis(symbol, transcript);
  };

  const loadTemplate = (sym: 'TSLA' | 'NVDA' | 'AAPL') => {
    setSymbol(sym);
    setTranscript(EARNINGS_TEMPLATES[sym].transcript);
  };

  // Automated layout-driven PDF/print generation
  const handleExportPDF = () => {
    if (!data) return;
    
    // Create print stylesheet temporarily or run direct print layout
    const printContents = document.getElementById('print-report-section')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>STOCKSENTINEL - EARNINGS REPORT [${data.symbol}]</title>
              <style>
                body { font-family: 'Courier New', Courier, monospace; background: #fff; color: #000; padding: 40px; }
                h1, h2, h3 { border-bottom: 2px solid #000; padding-bottom: 8px; text-transform: uppercase; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
                .card { border: 1px solid #000; padding: 15px; margin-bottom: 15px; }
                .quote { font-style: italic; background: #f0f0f0; padding: 10px; margin: 10px 0; border-left: 4px solid #000; }
                .header-meta { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 30px; }
              </style>
            </head>
            <body>
              <div class="header-meta">
                <div>STOCKSENTINEL : AI INTEL NETWORK</div>
                <div>REPORT DATE: ${new Date().toLocaleDateString()}</div>
              </div>
              <h1>EARNINGS REPORT SUMMARY: ${data.symbol} (${data.quarter})</h1>
              <div class="card">
                <h3>Executive Summary</h3>
                <p>${data.summary}</p>
              </div>
              <div class="grid">
                <div class="card">
                  <h3>CEO Tone Analysis (Rating: ${data.ceoTone.score}/100)</h3>
                  <div>Vibe: ${data.ceoTone.vibe}</div>
                  <div class="quote">"${data.ceoTone.quote}"</div>
                </div>
                <div class="card">
                  <h3>CFO Tone Analysis (Rating: ${data.cfoTone.score}/100)</h3>
                  <div>Vibe: ${data.cfoTone.vibe}</div>
                  <div class="quote">"${data.cfoTone.quote}"</div>
                </div>
              </div>
              <div class="grid">
                <div class="card">
                  <h3>Bullish Anchors</h3>
                  <ul>${data.bullishSignals.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div class="card">
                  <h3>Bearish Drag / Risks</h3>
                  <ul>${data.bearishSignals.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
              </div>
              <div class="card">
                <h3>Comparative Financial Indicators</h3>
                <p>Previous Quarter Revenue: ${data.comparison.previousRevenue} | Current Revenue: ${data.comparison.currentRevenue} (${data.comparison.revenueGrowthPercent}% Growth)</p>
                <p>Previous EPS: ${data.comparison.previousEPS} | Current EPS: ${data.comparison.currentEPS} (${data.comparison.epsGrowthPercent}% Growth)</p>
              </div>
              <div class="card">
                <h3>Forward Guidance Target</h3>
                <p>Target Revenue: ${data.guidance.revenue}</p>
                <p>Target EPS: ${data.guidance.eps}</p>
                <p>Forward Outlook: ${data.guidance.outlook}</p>
              </div>
            </body>
          </html>
        `);
        win.document.close();
        win.focus();
        win.print();
      }
    }
  };

  return (
    <div id="earnings-intel" className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-sans">
      {/* Transcript Input Control Card */}
      <div className="xl:col-span-5 bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-5 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="text-xs font-mono font-bold text-slate-200 tracking-wider">TRANSCRIPT FEEDER</h2>
        </div>

        {/* Load Preset Templates */}
        <div className="space-y-2">
          <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">LOAD PRE-CONFIGURED CALL TEMPLATES</label>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <button
              onClick={() => loadTemplate('NVDA')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              NVIDIA Q2
            </button>
            <button
              onClick={() => loadTemplate('TSLA')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              TESLA Q3
            </button>
            <button
              onClick={() => loadTemplate('AAPL')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              APPLE Q4
            </button>
          </div>
        </div>

        {/* Ticker Symbol Input */}
        <div>
          <label className="block text-[9px] font-mono text-slate-500 uppercase mb-2 tracking-widest font-bold">ASSET TICKER</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. MSFT, GOOG, NVDA..."
            className="w-full bg-brand-deep border border-brand-border focus:border-purple-500/50 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none transition-all"
          />
        </div>

        {/* Transcript Text Box */}
        <div>
          <label className="block text-[9px] font-mono text-slate-500 uppercase mb-2 tracking-widest font-bold">CALL TRANSCRIPT TEXT</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste earnings call text transcript here..."
            className="w-full bg-brand-deep/60 border border-brand-border hover:border-brand-border-hover focus:border-purple-500/50 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 outline-none h-60 resize-none font-sans leading-relaxed transition-all scrollbar-thin"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !transcript.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-brand-card text-white font-mono font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/20 hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI COMPILING AUDITS...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>COMPILE AI TRANSCRIPT ANALYSIS</span>
            </>
          )}
        </button>
      </div>

      {/* Main Analysis Display Panel */}
      <div className="xl:col-span-7 space-y-6">
        {data ? (
          <div id="print-report-section" className="space-y-6">
            {/* Header Metadata Info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-brand-card/50 backdrop-blur-md border border-brand-border px-6 py-5 rounded-2xl shadow-xl">
              <div>
                <h3 className="text-sm font-mono font-bold text-slate-200 flex items-center gap-1.5">
                  <span>{data.symbol} : AI EARNINGS AUDIT</span>
                  <span className="text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-1.5 py-0.5 rounded uppercase">{data.quarter}</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5">GENERATED SECURELY BY STOCKSENTINEL</p>
              </div>

              {/* Print PDF Button */}
              <button
                onClick={handleExportPDF}
                className="bg-brand-deep/60 hover:bg-brand-deep border border-brand-border hover:border-brand-border-hover font-mono text-[10px] text-slate-300 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>GENERATE PRINT-READY PDF</span>
              </button>
            </div>

            {/* Core Executive Summary */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-3 shadow-xl">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">EXECUTIVE BRIEF</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed bg-brand-deep/30 border border-brand-border/40 p-4 rounded-xl">
                {data.summary}
              </p>
            </div>

            {/* CEO and CFO Vocal Tone Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CEO Tone */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                  <span className="text-xs font-mono font-bold text-slate-200">CEO VOCAL SENTIMENT</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{data.ceoTone.score}% CONFIDENCE</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">VOCAL VIBE:</div>
                  <div className="text-xs font-mono font-bold text-slate-200">{data.ceoTone.vibe}</div>
                </div>
                <blockquote className="text-[10px] text-slate-400 italic bg-brand-deep/40 border-l-2 border-purple-500 pl-3 py-1 font-sans">
                  "{data.ceoTone.quote}"
                </blockquote>
              </div>

              {/* CFO Tone */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                  <span className="text-xs font-mono font-bold text-slate-200">CFO BALANCE SENTIMENT</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">{data.cfoTone.score}% CONFIDENCE</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">VOCAL VIBE:</div>
                  <div className="text-xs font-mono font-bold text-slate-200">{data.cfoTone.vibe}</div>
                </div>
                <blockquote className="text-[10px] text-slate-400 italic bg-brand-deep/40 border-l-2 border-cyan-500 pl-3 py-1 font-sans">
                  "{data.cfoTone.quote}"
                </blockquote>
              </div>
            </div>

            {/* Financial indicators comparison YoY */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">YoY QUARTERLY PERFORMANCE METRICS</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Revenue Card */}
                <div className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-2 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">REVENUE FLOW</div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>PREVIOUS QUARTER:</span>
                    <span>{data.comparison.previousRevenue}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-200">
                    <span>CURRENT QUARTER:</span>
                    <span className="font-bold text-slate-100">{data.comparison.currentRevenue}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5 border-t border-brand-border/40 text-emerald-400 font-bold">
                    <span>REVENUE ACCELERATION:</span>
                    <span className="flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{data.comparison.revenueGrowthPercent}%
                    </span>
                  </div>
                </div>

                {/* EPS Card */}
                <div className="bg-brand-deep/30 border border-brand-border p-4 rounded-xl space-y-2 font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">EARNINGS PER SHARE (EPS)</div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>PREVIOUS QUARTER:</span>
                    <span>{data.comparison.previousEPS}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-200">
                    <span>CURRENT QUARTER:</span>
                    <span className="font-bold text-slate-100">{data.comparison.currentEPS}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5 border-t border-brand-border/40 text-emerald-400 font-bold">
                    <span>EPS ACCELERATION:</span>
                    <span className="flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{data.comparison.epsGrowthPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bullish vs Bearish Sentiment Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bullish Signals */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>BULLISH KEY TAKEAWAYS</span>
                </div>
                <ul className="space-y-2 font-sans text-xs text-slate-300 pl-4 list-disc marker:text-emerald-500">
                  {data.bullishSignals.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Bearish Signals */}
              <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>BEARISH / RISK VARIABLES</span>
                </div>
                <ul className="space-y-2 font-sans text-xs text-slate-300 pl-4 list-disc marker:text-red-500">
                  {data.bearishSignals.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Guidance Card */}
            <div className="bg-brand-card/50 backdrop-blur-md border border-brand-border p-6 rounded-2xl space-y-4 shadow-xl font-mono">
              <div className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">FORWARD QUARTERLY GUIDANCE</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-brand-deep/30 p-3 rounded-xl border border-brand-border">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">TARGET REVENUE</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{data.guidance.revenue}</div>
                </div>
                <div className="bg-brand-deep/30 p-3 rounded-xl border border-brand-border">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">TARGET EPS</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{data.guidance.eps}</div>
                </div>
                <div className="bg-brand-deep/30 p-3 rounded-xl border border-brand-border">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">GENERAL OUTLOOK</div>
                  <div className={`text-xs font-black mt-1 ${
                    data.guidance.outlook === 'BULLISH' ? 'text-emerald-400' :
                    data.guidance.outlook === 'BEARISH' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {data.guidance.outlook}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl">
            <div className="text-center font-mono space-y-3.5 text-slate-400">
              <FileText className="w-8 h-8 animate-pulse mx-auto text-purple-400" />
              <div className="tracking-widest uppercase text-xs">LOAD TRANSCRIPT OR FILL IN FIELD ABOVE TO DECODE...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
