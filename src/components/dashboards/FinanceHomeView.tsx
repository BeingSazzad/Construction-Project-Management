import React, { useState } from 'react';
import { Project, TradeCategory, FinancingDraw, LienWaiver } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  DollarSign, Landmark, FileCheck, CheckCircle2, 
  AlertTriangle, TrendingUp, TrendingDown, Layers, ChevronRight,
  PlusCircle, ShieldCheck, FileSpreadsheet, ArrowUpRight, Sparkles,
  Clock, ShieldAlert
} from 'lucide-react';

interface FinanceHomeViewProps {
  projects: Project[];
  categories: TradeCategory[];
  draws: FinancingDraw[];
  lienWaivers: LienWaiver[];
  onSelectProject: (project: Project) => void;
  onOpenDraws: () => void;
  onOpenLienWaivers: () => void;
  onOpenBudgets: () => void;
  onOpenOpportunities?: () => void;
  onRequestDraw: () => void;
  onRecordLienWaiver: () => void;
  onApprovePayApp: () => void;
  onOpenLatti: () => void;
}

export const FinanceHomeView: React.FC<FinanceHomeViewProps> = ({
  projects,
  draws,
  lienWaivers,
  onSelectProject,
  onOpenDraws,
  onOpenLienWaivers,
  onOpenBudgets,
  onOpenOpportunities,
  onRequestDraw,
  onRecordLienWaiver,
  onApprovePayApp,
  onOpenLatti
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'draws' | 'lien'>('all');

  // Aggregated Financial Metrics
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget?.total || 0), 0);
  const totalActual = projects.reduce((acc, p) => acc + (p.budget?.actual || 0), 0);
  const totalCommitted = projects.reduce((acc, p) => acc + (p.budget?.committed || 0), 0);
  const totalPaid = projects.reduce((acc, p) => acc + (p.budget?.paid || 0), 0);

  // Draws & Compliance Counts
  const pendingDraws = draws.filter(d => d.status === 'In Lender Review' || d.status === 'Inspection Scheduled');
  const pendingDrawsAmount = pendingDraws.reduce((acc, d) => acc + d.requestedAmount, 0);

  const signedWaivers = lienWaivers.filter(l => l.status === 'Signed & Active').length;
  const complianceRate = lienWaivers.length > 0 
    ? Math.round((signedWaivers / lienWaivers.length) * 100) 
    : 100;
  const actionRequiredWaivers = lienWaivers.filter(l => l.status === 'Action Required' || l.status === 'Pending Signature');

  const materialRates = [
    { name: 'Portland Cement (Type I/II)', rate: '$455.00 / Bag', change: '+30%', isUp: true },
    { name: 'Red Clay Bricks', rate: '$46.00 / 100 Pack', change: '+15%', isUp: true },
    { name: 'Structural Steel (Div 05)', rate: '$368.00 / Tonne', change: '-8%', isUp: false },
    { name: 'Aggregates (15mm Mix)', rate: '$262.80 / Tonne', change: '+30%', isUp: true },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── 1. Financial Command KPI Banner ── */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0E1A33] via-[#070D1A] to-[#050811] border border-[#1E325A] shadow-lg relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-4 w-28 h-28 bg-emerald-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Capital Control Center</p>
              <h2 className="text-sm font-extrabold text-white mt-0.5">Project Finance Oversight</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{complianceRate}% Compliant</span>
            </div>
          </div>

          {/* 4 Financial KPIs */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-[#060913]/70 border border-[#142036]">
              <p className="text-[10px] font-semibold text-slate-400">Total Portfolio Capital</p>
              <p className="text-base font-extrabold text-white mt-0.5">${(totalBudget / 1000000).toFixed(2)}M</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Committed: ${(totalCommitted / 1000000).toFixed(2)}M</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#060913]/70 border border-[#142036]">
              <p className="text-[10px] font-semibold text-slate-400">Disbursed to Date</p>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">${(totalPaid / 1000000).toFixed(2)}M</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Spent: ${(totalActual / 1000000).toFixed(2)}M</p>
            </div>

            <div 
              onClick={onOpenDraws}
              className="p-3 rounded-2xl bg-[#060913]/70 border border-[#142036] hover:border-blue-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-400">Lender Draws Pending</p>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
              </div>
              <p className="text-base font-extrabold text-blue-400 mt-0.5">${(pendingDrawsAmount / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-blue-400/80 font-medium mt-0.5">{pendingDraws.length} Draws in Review</p>
            </div>

            <div 
              onClick={onOpenLienWaivers}
              className="p-3 rounded-2xl bg-[#060913]/70 border border-[#142036] hover:border-blue-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-400">Lien Waiver Status</p>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-base font-extrabold text-amber-400 mt-0.5">{actionRequiredWaivers.length} Action Needed</p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">{signedWaivers} Signed Waivers</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Primary Financial Action Shortcuts ── */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-0.5">Finance Actions & Approvals</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onRequestDraw}
            className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Request Draw</span>
            <span className="text-[9px] text-slate-400">Lender Draw</span>
          </button>

          <button
            onClick={onRecordLienWaiver}
            className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-emerald-500/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Log Waiver</span>
            <span className="text-[9px] text-slate-400">Sub Compliance</span>
          </button>

          <button
            onClick={onApprovePayApp}
            className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-purple-500/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white leading-tight">Pay Application</span>
            <span className="text-[9px] text-slate-400">Disbursement</span>
          </button>
        </div>
      </div>

      {/* ── 3. Pending Approvals Tray ── */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white">Pending Financial Approvals</h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {pendingDraws.length + actionRequiredWaivers.length} Requiring Action
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {pendingDraws.map((d) => (
            <div
              key={d.id}
              onClick={onOpenDraws}
              className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 cursor-pointer flex items-center justify-between gap-3 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{d.milestoneTitle}</span>
                  <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    Draw #{d.drawNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {d.lenderName} · Requested ${(d.requestedAmount / 1000).toFixed(0)}K
                </p>
              </div>
              <StatusBadge status={d.status} size="xs" />
            </div>
          ))}

          {actionRequiredWaivers.map((l) => (
            <div
              key={l.id}
              onClick={onOpenLienWaivers}
              className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-amber-500/40 cursor-pointer flex items-center justify-between gap-3 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{l.subcontractorName}</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {l.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {l.trade} · Inv #{l.invoiceRef} · ${(l.amount / 1000).toFixed(0)}K
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Action Required
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Project Capital Status & Financial Ledger ── */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white">Project Financial Ledger</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Budget vs Actual vs Disbursed</p>
          </div>
          <button
            onClick={onOpenBudgets}
            className="text-xs font-semibold text-[#3875F6] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Master Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.map((p) => {
            const totalM = (p.budget.total / 1000000).toFixed(2);
            const actualM = (p.budget.actual / 1000000).toFixed(2);
            const paidM = (p.budget.paid / 1000000).toFixed(2);
            const pctSpent = Math.min(100, Math.round((p.budget.actual / p.budget.total) * 100));

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="p-3.5 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#3875F6] transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      Code: {p.code} · {p.cityState}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
                </div>

                {/* Progress bar & Breakdown */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Capital Utilized</span>
                    <span className="font-bold text-white">${actualM}M of ${totalM}M ({pctSpent}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#142036] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pctSpent > 90 ? 'bg-amber-400' : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${pctSpent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Disbursed: <strong className="text-emerald-400">${paidM}M</strong></span>
                    <span>Remaining: <strong className="text-slate-200">${((p.budget.remaining || 0)/1000000).toFixed(2)}M</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Material Market Escalation Index ── */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white">Commodity & Material Index</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Live price escalation tracking</p>
          </div>
          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Escalation Alert
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {materialRates.map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-[#090E1A] border border-[#141F33] flex flex-col gap-1">
              <span className="text-[10px] font-bold text-white truncate">{m.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">{m.rate}</span>
              <div className={`mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 border self-start ${
                m.isUp 
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              }`}>
                {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Latti AI Financial Copilot Banner ── */}
      <div 
        onClick={onOpenLatti}
        className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 hover:border-blue-500/60 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
              Latti AI Finance Assistant
            </h4>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Ask: "Analyze cash flow variance for Riverside Office Complex"
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white flex-shrink-0" />
      </div>

    </div>
  );
};
