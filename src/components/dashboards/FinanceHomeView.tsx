import React, { useState } from 'react';
import { Project, TradeCategory, FinancingDraw, LienWaiver } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  DollarSign, Landmark, FileCheck, CheckCircle2, 
  AlertTriangle, TrendingUp, TrendingDown, Layers, ChevronRight,
  PlusCircle, ShieldCheck, FileSpreadsheet, ArrowUpRight, Sparkles,
  Clock, ShieldAlert, FileText, ArrowRight, Building2
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
    : 94;
  const actionRequiredWaivers = lienWaivers.filter(l => l.status === 'Action Required' || l.status === 'Pending Signature');

  const materialRates = [
    { name: 'Portland Cement (Type I/II)', rate: '$455.00 / Bag', change: '+30%', isUp: true, trade: 'Div 03 Concrete' },
    { name: 'Red Clay Bricks', rate: '$46.00 / 100 Pack', change: '+15%', isUp: true, trade: 'Div 04 Masonry' },
    { name: 'Structural Steel (W-Beams)', rate: '$368.00 / Tonne', change: '-8%', isUp: false, trade: 'Div 05 Metals' },
    { name: 'Aggregates (15mm Mix)', rate: '$262.80 / Tonne', change: '+30%', isUp: true, trade: 'Div 03 Concrete' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── 1. Top Executive Capital Command Card ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-xl shadow-blue-950/20 flex flex-col gap-3.5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
              Capital Control Center
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Portfolio Liquidity &amp; Draws Oversight</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{complianceRate}% Compliant</span>
          </div>
        </div>

        {/* 4 Financial Metric Tiles */}
        <div className="grid grid-cols-4 gap-2">
          {/* Tile 1: Portfolio Capital */}
          <div className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#0D223A] border border-[#173A60] text-[#38BDF8] flex items-center justify-center mb-1.5 flex-shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white leading-none tracking-tight">
              ${(totalBudget / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 leading-tight truncate w-full">
              Total Budget
            </span>
          </div>

          {/* Tile 2: Disbursed to Date */}
          <div className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-[#0D281E] border border-[#154633] text-[#10B981] flex items-center justify-center mb-1.5 flex-shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-400 leading-none tracking-tight">
              ${(totalPaid / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 leading-tight truncate w-full">
              Disbursed
            </span>
          </div>

          {/* Tile 3: Pending Draws */}
          <div 
            onClick={onOpenDraws}
            className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-blue-500/50 flex flex-col items-center justify-center text-center shadow-inner cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#231438] border border-[#3D2062] text-[#A855F7] flex items-center justify-center mb-1.5 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold text-purple-400 leading-none tracking-tight">
              ${(pendingDrawsAmount / 1000).toFixed(0)}k
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 leading-tight truncate w-full">
              {pendingDraws.length} Draws
            </span>
          </div>

          {/* Tile 4: Lien Waivers */}
          <div 
            onClick={onOpenLienWaivers}
            className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-amber-500/50 flex flex-col items-center justify-center text-center shadow-inner cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2A1D0E] border border-[#483015] text-[#F59E0B] flex items-center justify-center mb-1.5 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold text-amber-400 leading-none tracking-tight">
              {actionRequiredWaivers.length}
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 leading-tight truncate w-full">
              Waiver Alerts
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Primary Financial Action Shortcuts ── */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-white px-0.5 tracking-tight">Finance Workflows &amp; Approvals</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Create Draw', sub: 'Lender Draw', icon: Landmark, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', action: onRequestDraw },
            { label: 'Log Waiver', sub: 'Lien Security', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', action: onRecordLienWaiver },
            { label: 'Pay App', sub: 'Disbursement', icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', action: onApprovePayApp },
            { label: 'CSI Budgets', sub: 'Master Ledger', icon: FileSpreadsheet, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', action: onOpenBudgets },
          ].map(({ label, sub, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              onClick={action}
              className="p-2.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:bg-[#0C152B] group text-center"
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${color} ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-tight">{label}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Pending Approvals & Risk Radar ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Pending Financial Approvals</h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {pendingDraws.length + actionRequiredWaivers.length} Action Needed
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Pending Draws */}
          {pendingDraws.map((d) => (
            <div
              key={d.id}
              onClick={onOpenDraws}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-blue-500/40 cursor-pointer flex items-center justify-between gap-3 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{d.milestoneTitle}</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    Draw #{d.drawNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium truncate">
                  {d.lenderName} · Requested <strong className="text-white">${(d.requestedAmount / 1000).toFixed(0)}K</strong>
                </p>
              </div>
              <StatusBadge status={d.status} size="xs" />
            </div>
          ))}

          {/* Action Required Waivers */}
          {actionRequiredWaivers.map((w) => (
            <div
              key={w.id}
              onClick={onOpenLienWaivers}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-amber-500/40 cursor-pointer flex items-center justify-between gap-3 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{w.subcontractorName}</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {w.trade}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {w.type} · Amount: <strong className="text-white">${(w.amount / 1000).toFixed(0)}K</strong>
                </p>
              </div>
              <StatusBadge status={w.status} size="xs" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Material Escalation & Commodity Index ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Material Escalation Radar</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Regional Spot Index</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {materialRates.map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-white truncate">{m.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{m.trade}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#131D31]">
                <span className="text-xs font-extrabold text-white">{m.rate}</span>
                <span className={`text-[10px] font-black flex items-center gap-0.5 ${m.isUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Active Project Financial Ledgers ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-bold text-white tracking-tight">Project Financial Ledgers</h3>
          <button 
            onClick={onOpenBudgets}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Budgets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.slice(0, 3).map((p) => {
            const budgetTotal = p.budget?.total || 1;
            const actualSpent = p.budget?.actual || 0;
            const pctSpent = Math.min(100, Math.round((actualSpent / budgetTotal) * 100));

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.location || 'Commercial Complex'}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">${(budgetTotal / 1000000).toFixed(2)}M</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#131D31] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                      style={{ width: `${pctSpent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 flex-shrink-0">{pctSpent}% Drawn</span>
                </div>

                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>Actual Spend: <strong className="text-slate-200">${(actualSpent / 1000000).toFixed(2)}M</strong></span>
                  <span>Remaining: <strong className="text-emerald-400">${((budgetTotal - actualSpent) / 1000000).toFixed(2)}M</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
