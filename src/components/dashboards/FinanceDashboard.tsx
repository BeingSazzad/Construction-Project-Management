import React, { useState } from 'react';
import { Project, TradeCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_FINANCING_DRAWS, MOCK_LIEN_WAIVERS } from '../../data/mockData';
import { 
  Sparkles, ChevronRight, DollarSign, 
  Landmark, FileCheck, CheckCircle2, 
  Clock, AlertTriangle
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* 1. Greeting Header */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <span>Good morning, Michael!</span>
          <span className="text-base">👋</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Director of Project Finance & Capital Allocation
        </p>
      </div>

      {/* Finance Navigation Pills */}
      <div className="flex items-center gap-1 bg-[#0D1424] p-1 rounded-xl border border-[#1A263E]">
        <button
          onClick={() => setFinanceTab('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            financeTab === 'overview'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setFinanceTab('draws')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            financeTab === 'draws'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Draws ({draws.length})
        </button>
        <button
          onClick={() => setFinanceTab('lien')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            financeTab === 'lien'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lien Waivers ({lienWaivers.length})
        </button>
      </div>

      {financeTab === 'overview' && (
        <>
          {/* 2. Financial KPI Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
              <div className="text-xs font-semibold text-slate-400">Total Budget</div>
              <div className="text-lg font-bold text-white mt-1">$46.80M</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
              <div className="text-xs font-semibold text-slate-400">Actual Spent</div>
              <div className="text-lg font-bold text-blue-400 mt-1">$18.69M</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
              <div className="text-xs font-semibold text-slate-400">Committed</div>
              <div className="text-lg font-bold text-white mt-1">$12.45M</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
              <div className="text-xs font-semibold text-slate-400">Paid to Date</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">$8.32M</div>
            </div>
          </div>

          {/* 3. Projects Capital Status */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">Project Financial Status</h2>
              <button onClick={onOpenReports} className="text-xs font-semibold text-[#3875F6] hover:underline cursor-pointer">
                Reports
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {projects.map((p) => {
                const totalM = (p.budget.total / 1000000).toFixed(2);
                const actualM = (p.budget.actual / 1000000).toFixed(2);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        Spent ${actualM}M of ${totalM}M
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {financeTab === 'draws' && (
        <div className="flex flex-col gap-3">
          {draws.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{d.milestoneTitle}</span>
                <StatusBadge status={d.status} size="xs" />
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#162033]">
                <span className="text-slate-400 font-medium">Draw #{d.drawNumber} · {d.lenderName}</span>
                <span className="text-sm font-bold text-blue-400">${(d.requestedAmount / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {financeTab === 'lien' && (
        <div className="flex flex-col gap-3">
          {lienWaivers.map((l) => (
            <div key={l.id} className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{l.subcontractorName}</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {l.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#162033]">
                <span className="text-slate-400 font-medium">{l.trade}</span>
                <span className="text-sm font-bold text-white">${(l.amount / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
