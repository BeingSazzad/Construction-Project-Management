import React, { useState } from 'react';
import { Project, OpportunityDeal } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_OPPORTUNITY_DEALS, MOCK_SUBCONTRACTORS } from '../../data/mockData';
import { 
  Building2, ShieldCheck, Sparkles, TrendingUp, 
  ChevronRight, ArrowUpRight, DollarSign, Users, Briefcase, Plus
} from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenLatti: () => void;
  onOpenTasks: () => void;
  onOpenProjects: () => void;
  onOpenBudgets: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onSelectProject,
  onOpenLatti,
  onOpenProjects
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'pipeline' | 'subs'>('overview');

  const deals: OpportunityDeal[] = MOCK_OPPORTUNITY_DEALS;
  const subcontractors = MOCK_SUBCONTRACTORS;

  const totalPipelineVal = deals.reduce((sum, d) => sum + d.estimatedValue, 0);

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Greeting Header */}
      <div className="flex flex-col">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <span>Executive Overview</span>
          <span className="text-base">👔</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Avery & Marsh Construction Group Portfolio
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1 bg-[#0D1424] p-1 rounded-xl border border-[#1A263E]">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'overview'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveSection('pipeline')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'pipeline'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deals (${(totalPipelineVal / 1000000).toFixed(1)}M)
        </button>
        <button
          onClick={() => setActiveSection('subs')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'subs'
              ? 'bg-[#2563EB] text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Subcontractors
        </button>
      </div>

      {activeSection === 'overview' && (
        <>
          {/* Executive Portfolio */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Portfolio Metrics
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                94% Health
              </span>
            </div>

            {/* 4 KPIs */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#090E1A] p-2.5 rounded-2xl border border-[#141F33]">
                <div className="text-base font-bold text-white">{projects.length}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Projects</div>
              </div>
              <div className="bg-[#090E1A] p-2.5 rounded-2xl border border-[#141F33]">
                <div className="text-base font-bold text-blue-400">12</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Active</div>
              </div>
              <div className="bg-[#090E1A] p-2.5 rounded-2xl border border-amber-500/20">
                <div className="text-base font-bold text-amber-400">2</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">At Risk</div>
              </div>
              <div className="bg-[#090E1A] p-2.5 rounded-2xl border border-emerald-500/20">
                <div className="text-base font-bold text-emerald-400">2</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Done</div>
              </div>
            </div>

            {/* Financial Summary Line */}
            <div className="pt-3 border-t border-[#162033] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-xs text-slate-400 font-medium">Total Volume</span>
                <div className="font-bold text-white text-sm mt-0.5">$24.65M</div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Cost to Date</span>
                <div className="font-bold text-slate-200 text-sm mt-0.5">$18.45M</div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Net Margin</span>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">+$2.35M</div>
              </div>
            </div>
          </div>

          {/* Latti AI Risk Alert */}
          <div 
            onClick={onOpenLatti}
            className="p-3.5 rounded-2xl bg-[#0D1424] border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-blue-400">Latti AI Risk Radar</div>
                <p className="text-xs text-slate-300 truncate font-medium mt-0.5">
                  2 tasks in Riverside Complex are at risk
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white flex-shrink-0" />
          </div>

          {/* Active Construction Projects */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">Active Projects</h2>
              <button onClick={onOpenProjects} className="text-xs font-bold text-[#3875F6] hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {projects.slice(0, 4).map((p) => {
                const isAtRisk = p.status === 'At Risk' || p.status === 'Delayed';
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`p-3.5 rounded-2xl bg-[#090E1A] border hover:border-blue-500/40 transition-all cursor-pointer flex items-center gap-3 shadow-sm group ${
                      isAtRisk ? 'border-rose-500/30' : 'border-[#141F33]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[#121B2D]">
                      <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                          {p.name}
                        </h3>
                        <StatusBadge status={p.status} size="xs" />
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                        {p.location} · {p.progress}% Completed
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

      {activeSection === 'pipeline' && (
        <div className="flex flex-col gap-3">
          {deals.map((deal) => (
            <div key={deal.id} className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{deal.projectTitle}</span>
                <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {deal.stage}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{deal.clientName} · {deal.location}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#162033]">
                <span className="text-slate-400 font-medium">Est. Value</span>
                <span className="text-sm font-bold text-emerald-400">${(deal.estimatedValue / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'subs' && (
        <div className="flex flex-col gap-3">
          {subcontractors.map((sub) => (
            <div key={sub.id} className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{sub.companyName}</span>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">{sub.trade} · Contact: {sub.contactName}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {sub.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
