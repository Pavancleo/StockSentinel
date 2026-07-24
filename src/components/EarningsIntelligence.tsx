/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Cpu, ArrowUpRight, ArrowDownRight, Printer, RefreshCw, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import { EarningsIntelligence as EarningsType } from '../types';
import { motion } from 'motion/react';

const EARNINGS_TEMPLATES = {
  INFY: {
    label: 'Infosys Q2 FY26 Earnings Call',
    transcript: `Good evening everyone, and welcome to Infosys Fiscal Q2 2026 Earnings Briefing.
We achieved strong constant currency revenue growth of 3.8% quarter-on-quarter, with total revenues hitting ₹41,800 crore. Large deal TCV (Total Contract Value) stood at an impressive $2.4 billion, with 52% net new acquisitions driven by enterprise GenAI adoption and cloud modernization projects.
Operating margins expanded 40 basis points to 21.2% through operating leverage and automation gains under Project MaxSec.
In terms of FY26 guidance, we are raising our revenue growth guidance to 3.75%-4.5% in constant currency terms while maintaining operating margin guidance at 20%-22%. Attrition moderated further to 12.9%.`
  },
  TCS: {
    label: 'TCS Q2 Financial Review',
    transcript: `Welcome to Tata Consultancy Services Q2 FY26 Investor Call.
Consolidated revenues reached ₹64,250 crore, marking 6.2% year-over-year expansion. Order book TCV remained resilient at $8.6 billion across banking, financial services, healthcare, and retail verticals.
Operating margin came in at 24.5%, demonstrating cost discipline amidst variable global tech budgets.
Our talent pool headcount grew net positive by 5,700 employees as campus onboarding resumed. We remain confident in digital transformation momentum and AI infrastructure deals across India, Europe, and North America.`
  },
  RELIANCE: {
    label: 'Reliance Q2 Energy & Retail Report',
    transcript: `Thank you for joining Reliance Industries Q2 FY26 Performance Call.
Consolidated quarterly revenue reached ₹2,35,000 crore led by O2C, Digital Services (Jio), and Retail expansion. Jio Platforms reported subscriber base crossing 490 million with ARPU rising to ₹195.1 per month.
Capital expenditure stood at ₹32,000 crore as phase-1 commissioning commenced for the Jamnagar clean energy gigafactories.
Retail segment EBITDA expanded 18% YoY with over 18,800 operational stores across tier 1-4 Indian cities.`
  }
};

export default function EarningsIntelligence() {
  const [symbol, setSymbol] = useState('INFY');
  const [transcript, setTranscript] = useState(EARNINGS_TEMPLATES.INFY.transcript);
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

  const loadTemplate = (sym: 'INFY' | 'TCS' | 'RELIANCE') => {
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
              onClick={() => loadTemplate('INFY')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              INFOSYS Q2
            </button>
            <button
              onClick={() => loadTemplate('TCS')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              TCS Q2
            </button>
            <button
              onClick={() => loadTemplate('RELIANCE')}
              className="text-[10px] bg-brand-deep hover:bg-brand-deep/80 border border-brand-border hover:border-brand-border-hover py-2 rounded-lg text-slate-300 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              RELIANCE Q2
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
            placeholder="e.g. INFY, TCS, RELIANCE, HDFCBANK..."
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
