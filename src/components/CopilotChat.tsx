/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Cpu, Link as LinkIcon, User, RefreshCw, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function CopilotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to StockSentinel Indian Market AI Copilot

I am your **AI Financial Copilot** for the Indian Stock Market (NSE / BSE). I have live **Google Search Grounding** enabled, allowing me to crawl real-time market data, company filings, NIFTY 50 / SENSEX movements, and RBI policy updates.

How can I assist your market intelligence today? Try asking:
* "What is Infosys (INFY) current stock price and Q2 earnings forecast on NSE?"
* "Analyze Reliance Industries (RELIANCE) green hydrogen giga-factory impact."
* "What is the NIFTY 50 and Bank Nifty outlook following RBI's repo rate decision?"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      if (!res.ok) {
        throw new Error(`API response status error: ${res.status}`);
      }
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          sources: data.sources,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `### StockSentinel Copilot Reset\n\nIntelligence cache cleared. How can I assist you with market analysis, technical indicators, or social sentiments?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const QUICK_PROMPTS = [
    { label: 'Infosys INFY', text: "What is Infosys's (INFY) current stock price and latest deal wins?" },
    { label: 'TCS Earnings', text: "Analyze TCS Q2 financial results and operating margin outlook." },
    { label: 'Reliance Strategy', text: "What is Reliance Industries' (RELIANCE) clean energy expansion timeline?" },
    { label: 'RBI Repo Policy', text: "Summarize the latest RBI Monetary Policy Committee decisions and NIFTY impact." }
  ];

  return (
    <div id="copilot-panel" className="flex flex-col h-[520px] bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-brand-deep/80 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-200 tracking-wider">AI FINANCIAL COPILOT</div>
            <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>GOOGLE SEARCH GROUNDING ACTIVE</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleClear}
          title="Clear Conversation"
          className="p-1.5 hover:bg-brand-deep rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-md bg-purple-900/30 border border-purple-800 flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100'
                  : 'bg-brand-deep/50 border border-brand-border text-slate-300'
              }`}>
                {/* Formatted Message Content Renderer */}
                <div className="whitespace-pre-wrap font-sans space-y-1.5">
                  {msg.content.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h3 key={idx} className="font-bold text-slate-100 text-sm mt-2.5 mb-1 tracking-wide">{line.replace('###', '').trim()}</h3>;
                    }
                    if (line.startsWith('*') || line.startsWith('-')) {
                      return <li key={idx} className="ml-3 list-disc text-slate-300 leading-relaxed">{line.substring(1).trim()}</li>;
                    }
                    // Handle simple bold parsing **text**
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    if (parts.length > 1) {
                      return (
                        <p key={idx}>
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-cyan-400 font-bold">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={idx} className="text-slate-300">{line}</p>;
                  })}
                </div>

                {/* Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-brand-border/40">
                    <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 mb-1.5 font-bold tracking-wider">
                      <LinkIcon className="w-3 h-3" />
                      <span>GROUNDED RESEARCH SOURCES:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.slice(0, 3).map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono bg-brand-deep/80 border border-brand-border hover:border-cyan-500/50 hover:bg-brand-deep px-2.5 py-1 rounded-lg text-cyan-400 transition-all flex items-center gap-1 truncate max-w-[180px]"
                        >
                          <span>{src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[9px] text-slate-500 font-mono text-right mt-1.5">{msg.time}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-md bg-brand-deep border border-brand-border flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-7 h-7 rounded-md bg-purple-900/30 border border-purple-800 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="bg-brand-deep/50 border border-brand-border rounded-xl p-3 max-w-[70%]">
                <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>CRITICAL RESEARCH RETRIEVAL IN PROGRESS...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Quick Prompt Chips */}
      {messages.length === 1 && (
        <div className="px-4 py-2.5 border-t border-brand-border/40 bg-brand-deep/10 flex flex-wrap gap-1.5 shrink-0">
          {QUICK_PROMPTS.map((qp, qidx) => (
            <button
              key={qidx}
              onClick={() => handleSend(qp.text)}
              className="text-[10px] font-mono bg-brand-deep hover:bg-purple-950/20 border border-brand-border hover:border-purple-500/40 rounded-lg px-3 py-1.5 text-slate-300 hover:text-purple-300 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3.5 bg-brand-deep/80 border-t border-brand-border flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot: INFY price, NIFTY target, TCS earnings, RBI policy..."
          className="flex-1 bg-brand-card/80 border border-brand-border hover:border-brand-border-hover focus:border-purple-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-brand-card text-white p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer hover:-translate-y-0.5"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
