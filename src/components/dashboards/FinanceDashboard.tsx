import React, { useState } from 'react';
import { Project, TradeCategory } from '../../types';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_FINANCING_DRAWS, MOCK_LIEN_WAIVERS } from '../../data/mockData';
import { 
  Sparkles, ChevronRight, TrendingUp, DollarSign, 
  PieChart, BarChart2, Landmark, FileCheck, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck 
} from 'lucide-react';

interface FinanceDashboardProps {
  projects: Project[];
  categories: TradeCategory[];
  onSelectProject: (project: Project) => void;
  onOpenBudgetDetails: () => void;
  onOpenReports: () => void;
  onOpenLatti: () => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  projects,
  onSelectProject,
  onOpenReports,
  onOpenLatti
}) => {
  const [financeTab, setFinanceTab] = useState<'overview' | 'draws' | 'lien'>('overview');
  const draws = MOCK_FINANCING_DRAWS;
  const lienWaivers = MOCK_LIEN_WAIVERS;

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. GREETING HEADER */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
          <span>Good morning, Michael!</span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Director of Project Finance & Capital Allocation
        </p>
      </div>

      {/* Finance Navigation Pills */}
      <div className="flex items-center gap-1.5 bg-[#080D18] p-1 rounded-xl border border-[#162033]">
        <button
          onClick={() => setFinanceTab('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            financeTab === 'overview'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Financial Overview
        </button>
        <button
          onClick={() => setFinanceTab('draws')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            financeTab === 'draws'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lender Draws ({draws.length})
        </button>
        <button
          onClick={() => setFinanceTab('lien')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            financeTab === 'lien'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lien Waivers ({lienWaivers.length})
        </button>
      </div>

      {financeTab === 'overview' && (
        <>
          {/* 2. 2x2 FINANCIAL KPI GRID */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
              <div className="text-[11px] text-slate-400 font-medium">Budget</div>
              <div className="text-xl font-black text-white mt-1">$46.80M</div>
            </div>

            <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
              <div className="text-[11px] text-slate-400 font-medium">Actual</div>
              <div className="text-xl font-black text-blue-400 mt-1">$18.69M</div>
            </div>

            <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
              <div className="text-[11px] text-slate-400 font-medium">Committed</div>
              <div className="text-xl font-black text-white mt-1">$12.45M</div>
            </div>

            <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
              <div className="text-[11px] text-slate-400 font-medium">Paid</div>
              <div className="text-xl font-black text-white mt-1">$8.32M</div>
            </div>
          </div>

          {/* 3. BUDGET VS ACTUAL TREND CURVES */}
          <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Budget vs Actual Cash Flow
              </h2>
              <span className="text-[11px] text-slate-400">YTD Growth</span>
            </div>

            {/* SVG Curved Trend Chart */}
            <div className="relative h-28 w-full flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                <line x1="0" y1="20" x2="300" y2="20" stroke="#182438" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#182438" strokeDasharray="3 3" />
                
                <path
                  d="M 10,80 Q 80,65 150,45 T 290,15"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 10,90 Q 80,80 150,65 T 290,45"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute top-0 right-0 bg-[#0066FF] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                $46.80M
              </div>
              <div className="absolute top-10 right-0 bg-[#00F0FF] text-[#070A12] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                $18.69M
              </div>
            </div>
          </div>

          {/* 4. BUDGET HEALTH DONUT CARD */}
          <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm flex flex-col gap-3">
            <h2 className="text-sm font-extrabold text-white tracking-tight">
              Budget Health & Variance
            </h2>

            <div className="flex items-center justify-between gap-4">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#182438]"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray="60, 100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-rose-400"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-base font-black text-white leading-none">24</div>
                  <div className="text-[8px] text-slate-400 font-medium">Projects</div>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    On Budget
                  </span>
                  <span className="font-bold text-white">14</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Needs attention
                  </span>
                  <span className="font-bold text-white">6</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Over Budget
                  </span>
                  <span className="font-bold text-white">4</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. LATTI AI FINANCIAL INSIGHT CARD */}
          <div className="card-dark p-4 bg-[#0A101D] border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(0,102,255,0.12)] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-extrabold text-blue-400">Latti AI Financial Recommendation</span>
            </div>

            <p className="text-xs text-slate-200 font-medium">
              Draw #5 inspection for Riverside Complex is scheduled. Submit unconditional lien waivers for Apex Concrete to expedite $640K lender disbursement.
            </p>

            <button
              onClick={onOpenLatti}
              className="w-full h-9 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
            >
              Ask Latti Finance Agent
            </button>
          </div>
        </>
      )}

      {/* Lender Draws Tab */}
      {financeTab === 'draws' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-[#0C121F] border border-[#182438] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Primary Lending Facility</div>
              <div className="text-xs font-bold text-white">JPMorgan Chase Commercial Construction Facility ($18.5M Line)</div>
            </div>
            <Landmark className="w-5 h-5 text-blue-400" />
          </div>

          <div className="flex flex-col gap-2.5">
            {draws.map((draw) => (
              <div key={draw.id} className="p-4 rounded-xl bg-[#0C121F] border border-[#182438] flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">Draw #{draw.drawNumber}</span>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {draw.milestoneTitle}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Requested: {draw.requestDate} {draw.fundingDate ? `• Funded: ${draw.fundingDate}` : ''}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    draw.status === 'Approved & Funded' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    draw.status === 'In Lender Review' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {draw.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#182438] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Draw Amount</span>
                    <div className="text-sm font-black text-white mt-0.5">${(draw.requestedAmount).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Bank Inspector Sign-off</span>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      {draw.inspectionPassed ? '✓ Passed (Zero Citations)' : 'Pending Inspection'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lien Waivers Tab */}
      {financeTab === 'lien' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-[#0C121F] border border-[#182438] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Lien Waivers Compliance</div>
              <div className="text-xs font-bold text-white">4 Subcontractor Waivers on File</div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="flex flex-col gap-2.5">
            {lienWaivers.map((lien) => (
              <div key={lien.id} className="p-3.5 rounded-xl bg-[#0C121F] border border-[#182438] flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{lien.subcontractorName}</span>
                    <span className="text-[10px] text-slate-400">({lien.trade})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {lien.type} • Ref: {lien.invoiceRef}
                  </span>
                  <span className="text-xs font-extrabold text-blue-400 mt-1">${lien.amount.toLocaleString()}</span>
                </div>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  lien.status === 'Signed & Active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  lien.status === 'Pending Signature' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {lien.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
