/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  history: { time: string; price: number; volume: number }[];
  marketCap: string;
  sector: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface ThreatAnalysis {
  symbol: string;
  companyName: string;
  riskScore: number; // 0 to 100
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NEGLIGIBLE';
  confidence: number; // 0 to 100
  detectedThreats: {
    type: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  insiderActivity: {
    buyerSeller: string;
    shares: number;
    value: string;
    date: string;
  }[];
  manipulationIndicators: {
    spoofingRisk: number;
    pumpAndDumpRisk: number;
    washTradingRisk: number;
  };
  whaleTrades: {
    time: string;
    shares: number;
    price: number;
    value: string;
    action: 'BUY' | 'SELL';
  }[];
  aiReasoning: string;
}

export interface StockPrediction {
  symbol: string;
  recommendation: 'BUY' | 'STRONG_BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  currentPrice: number;
  targets: {
    tomorrow: number;
    oneWeek: number;
    oneMonth: number;
    threeMonths: number;
  };
  growthPercent: number;
  support: number;
  resistance: number;
  predictions: {
    date: string;
    actualPrice?: number;
    predictedPrice: number;
    upperBound: number;
    lowerBound: number;
  }[];
  indicators: {
    rsi: number;
    macd: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    movingAverage: 'BUY' | 'SELL';
  };
  bullVsBear?: {
    bullReasons: string[];
    bearReasons: string[];
    finalVerdict: string;
  };
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  time: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number; // 1 to 100
  companiesMentioned: string[];
  sector: string;
  aiRecommendation: string;
}

export interface SocialSentiment {
  symbol: string;
  overallSentiment: number; // -100 to +100
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  sources: {
    reddit: { sentiment: number; postsCount: number };
    twitter: { sentiment: number; tweetsCount: number };
    forums: { sentiment: number; postsCount: number };
  };
  trendingKeywords: { text: string; value: number }[];
  moodGauge: 'EUPHORIC' | 'BULLISH' | 'STABLE' | 'FEARFUL' | 'PANIC';
}

export interface EarningsIntelligence {
  symbol: string;
  quarter: string;
  summary: string;
  ceoTone: { score: number; vibe: string; quote: string };
  cfoTone: { score: number; vibe: string; quote: string };
  guidance: {
    revenue: string;
    eps: string;
    outlook: 'BULLISH' | 'CONSERVATIVE' | 'BEARISH';
  };
  riskFactors: string[];
  bullishSignals: string[];
  bearishSignals: string[];
  comparison: {
    previousRevenue: string;
    currentRevenue: string;
    revenueGrowthPercent: number;
    previousEPS: string;
    currentEPS: string;
    epsGrowthPercent: number;
  };
}

export interface AlertNotification {
  id: string;
  type: 'PRICE_CRASH' | 'PUMP_DUMP' | 'MANIPULATION' | 'BEARISH_NEWS' | 'PORTFOLIO_RISK';
  title: string;
  message: string;
  symbol: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  time: string;
  unread: boolean;
}

export interface PortfolioStock {
  symbol: string;
  name: string;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  allocationPercent: number;
  healthScore: number;
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  sources?: { title: string; url: string }[];
}
