import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, DollarSign, ShieldAlert, CheckCircle2, Sliders, BarChart3, Building, ArrowLeft } from 'lucide-react';

interface DealAnalyzerModalProps {
  isOpen?: boolean;
  isFullScreenPage?: boolean;
  onClose: () => void;
}

export const DealAnalyzerModal: React.FC<DealAnalyzerModalProps> = ({
  isOpen = true,
  isFullScreenPage = false,
  onClose
}) => {
  const [address, setAddress] = useState('742 Evergreen Terrace, Austin TX');
  const [purchasePrice, setPurchasePrice] = useState<number>(450000);
  const [constructionCost, setConstructionCost] = useState<number>(680000);
  const [softCosts, setSoftCosts] = useState<number>(65000);
  const [targetARV, setTargetARV] = useState<number>(1450000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [scenario, setScenario] = useState<'base' | 'conservative' | 'aggressive'>('base');

  if (!isOpen && !isFullScreenPage) return null;

  // Multiplier for scenarios
  const arvMultiplier = scenario === 'conservative' ? 0.90 : scenario === 'aggressive' ? 1.15 : 1.0;
  const effectiveARV = Math.round(targetARV * arvMultiplier);
  const totalCost = purchasePrice + constructionCost + softCosts;
  const financingCost = Math.round((totalCost * 0.75) * (interestRate / 100) * 1.0); // 1-year loan
  const totalInvestment = totalCost + financingCost;
  const netProfit = effectiveARV - totalInvestment;
  const marginPct = totalInvestment > 0 ? ((netProfit / effectiveARV) * 100).toFixed(1) : '0';
  const roiPct = totalInvestment > 0 ? ((netProfit / (totalInvestment * 0.25)) * 100).toFixed(1) : '0'; // Cash-on-cash ROI based on 25% equity

  // Calculate Deal Score (1 to 100)
  const calcDealScore = () => {
    let score = 50;
    if (netProfit > 250000) score += 25;
    else if (netProfit > 100000) score += 15;
    else if (netProfit < 0) score -= 30;

    if (parseFloat(marginPct) > 18) score += 15;
    else if (parseFloat(marginPct) > 12) score += 10;

    if (parseFloat(roiPct) > 35) score += 10;
    return Math.min(99, Math.max(15, score));
  };

  const dealScore = calcDealScore();

  const content = (
    <>
      {/* 3 Scenarios Toggle */}
      <div className="flex items-center gap-1.5 p-1 bg-[#050811] rounded-2xl border border-[#142036] my-3">
        {[
          { id: 'base', label: 'Base Case' },
          { id: 'conservative', label: 'Conservative (-10%)' },
          { id: 'aggressive', label: 'Aggressive (+15%)' }
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenario(s.id as any)}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
              scenario === s.id
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Primary KPI Card: Deal Score & Projected Net Profit */}
      <div className="p-4 bg-gradient-to-b from-[#0C162E] to-[#070D1A] rounded-2xl border border-blue-500/30 flex items-center justify-between shadow-lg mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 block">Latti Deal Score™</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{dealScore}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              dealScore >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {dealScore >= 80 ? 'Strong Buy' : 'Moderate'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Projected Net Profit</span>
          <span className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 block">
            +${netProfit.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {marginPct}% Margin • {roiPct}% ROI
          </span>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="flex flex-col gap-2.5 text-xs">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Property / Site Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Purchase / Land ($)</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Hard Construction ($)</label>
            <input
              type="number"
              value={constructionCost}
              onChange={(e) => setConstructionCost(Number(e.target.value))}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Soft / Permits ($)</label>
            <input
              type="number"
              value={softCosts}
              onChange={(e) => setSoftCosts(Number(e.target.value))}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Expected ARV / Exit ($)</label>
            <input
              type="number"
              value={targetARV}
              onChange={(e) => setTargetARV(Number(e.target.value))}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-4">
        <button
          onClick={onClose}
          className="px-4 h-10 rounded-xl border border-[#142036] bg-[#050811] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
        >
          Close
        </button>

        <button
          onClick={() => {
            alert(`Deal Saved for ${address}! Deal Score: ${dealScore}/100.`);
            onClose();
          }}
          className="px-5 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
        >
          <span>Save to Opportunities</span>
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  if (isFullScreenPage) {
    return (
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budgets</span>
          </button>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Latti AI
          </span>
        </div>

        <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
          <div className="pb-3 border-b border-[#142036] mb-1">
            <h2 className="text-base font-bold text-white tracking-tight">
              Latti Deal Analyzer™
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Feasibility, Profitability & Deal Score
            </p>
          </div>

          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[480px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-start justify-between pb-3.5 border-b border-[#142036]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Latti Deal Analyzer™
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Feasibility, Profitability & Deal Score
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {content}
      </div>
    </div>
  );
};
