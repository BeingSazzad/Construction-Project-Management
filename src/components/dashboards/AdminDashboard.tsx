import React, { useState } from 'react';
import { Project, OpportunityDeal, User } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectCard } from '../common/ProjectCard';
import { MOCK_OPPORTUNITY_DEALS, MOCK_SUBCONTRACTORS } from '../../data/mockData';
import { 
  Building2, ShieldCheck, Sparkles, TrendingUp, 
  ChevronRight, ArrowUpRight, DollarSign, Users, Briefcase, Plus,
  Bell, Bot
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser?: User;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenLatti: () => void;
  onOpenNotifications?: () => void;
  onOpenTasks: () => void;
  onOpenProjects: () => void;
  onOpenBudgets: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  projects,
  onSelectProject,
  onOpenLatti,
  onOpenNotifications,
  onOpenTasks,
  onOpenProjects,
  onOpenBudgets
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'pipeline'>('overview');

  const deals = MOCK_OPPORTUNITY_DEALS;
  const totalPipelineVal = deals.reduce((acc, d) => acc + d.estimatedValue, 0);

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* Modern Frameless 2-Tab Switcher (No heavy container box) */}
      <div className="flex items-center gap-2 py-0.5">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeSection === 'overview'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-[#0B111E] text-slate-400 hover:text-white border border-[#142036]'
          }`}
        >
          Company Overview
        </button>
        <button
          onClick={() => setActiveSection('pipeline')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            activeSection === 'pipeline'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-[#0B111E] text-slate-400 hover:text-white border border-[#142036]'
          }`}
        >
          Deal Pipeline
        </button>
      </div>

      {activeSection === 'overview' && (
        <>
          {/* Executive Overview Header */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Portfolio Metrics
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                94% Health
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33]">
                <div className="text-xs font-medium text-slate-400">Total Portfolio</div>
                <div className="text-base font-bold text-white mt-1">$46.80M</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33]">
                <div className="text-xs font-medium text-slate-400">Capital Committed</div>
                <div className="text-base font-bold text-blue-400 mt-1">$38.50M</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33]">
                <div className="text-xs font-medium text-slate-400">Active Projects</div>
                <div className="text-base font-bold text-white mt-1">6 Projects</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33]">
                <div className="text-xs font-medium text-slate-400">Average Progress</div>
                <div className="text-base font-bold text-emerald-400 mt-1">64.2%</div>
              </div>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">Active Projects</h2>
              <button
                onClick={onOpenProjects}
                className="text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={() => onSelectProject(p)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {activeSection === 'pipeline' && (
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">Active Opportunities</h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              ${(totalPipelineVal / 1000000).toFixed(1)}M Total
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {deals.map((deal) => (
              <div key={deal.id} className="p-3.5 rounded-2xl bg-[#090E1A] border border-[#141F33] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{deal.projectTitle}</span>
                  <span className="text-xs font-bold text-blue-400">${(deal.estimatedValue / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1 border-t border-[#141F33]">
                  <span>{deal.clientName}</span>
                  <span className="text-amber-400 font-semibold">{deal.stage} ({deal.winProbability}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
