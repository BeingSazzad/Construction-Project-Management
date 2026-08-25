import React, { useState } from 'react';
import { Project, OpportunityDeal, Subcontractor } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { MOCK_OPPORTUNITY_DEALS, MOCK_SUBCONTRACTORS } from '../../data/mockData';
import { 
  Plus, ChevronRight, Sparkles, MapPin, TrendingUp, DollarSign, 
  FolderKanban, Briefcase, Award, ShieldCheck, CheckCircle2, 
  ArrowUpRight, Users, Building2 
} from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onOpenLatti: () => void;
  onOpenReports: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onOpenLatti
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'deals' | 'network'>('overview');
  const opportunities = MOCK_OPPORTUNITY_DEALS;
  const subcontractors = MOCK_SUBCONTRACTORS;

  const totalPipelineVal = opportunities.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans">
      {/* Role Navigation Pills */}
      <div className="flex items-center gap-1.5 bg-[#080D18] p-1 rounded-xl border border-[#162033]">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'overview'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Company Overview
        </button>
        <button
          onClick={() => setActiveSection('deals')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'deals'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Opportunities ({opportunities.length})
        </button>
        <button
          onClick={() => setActiveSection('network')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'network'
              ? 'bg-[#0066FF] text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Trade Network
        </button>
      </div>

      {activeSection === 'overview' && (
        <>
          {/* 1. Company Overview Card */}
          <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B] shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Executive Portfolio</span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Portfolio Health 94%
              </span>
            </div>

            {/* 4 KPIs */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-[#080D18] p-2.5 rounded-xl border border-[#151F30] text-center">
                <div className="text-lg font-black text-white">{projects.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Projects</div>
              </div>
              <div className="bg-[#080D18] p-2.5 rounded-xl border border-[#151F30] text-center">
                <div className="text-lg font-black text-blue-400">12</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Active</div>
              </div>
              <div className="bg-[#080D18] p-2.5 rounded-xl border border-amber-500/30 text-center">
                <div className="text-lg font-black text-amber-400">2</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">At Risk</div>
              </div>
              <div className="bg-[#080D18] p-2.5 rounded-xl border border-emerald-500/30 text-center">
                <div className="text-lg font-black text-emerald-400">2</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Completed</div>
              </div>
            </div>

            {/* Financial Line */}
            <div className="pt-2.5 border-t border-[#182338] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-medium">Total Volume</span>
                <div className="font-extrabold text-white mt-0.5">$24.65M</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium">Cost to Date</span>
                <div className="font-extrabold text-slate-200 mt-0.5">$18.45M</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium">Net Margin</span>
                <div className="font-extrabold text-emerald-400 mt-0.5">+$2.35M <span className="text-[9px] font-normal text-emerald-500">(+9.5%)</span></div>
              </div>
            </div>
          </div>

          {/* 2. Latti AI Risk Alert */}
          <div 
            onClick={onOpenLatti}
            className="p-3 rounded-xl bg-[#0D1422] border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Latti AI Risk Radar</div>
                <p className="text-xs text-slate-200 truncate font-medium">
                  2 tasks in Riverside Complex are at risk of missing milestone
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 flex-shrink-0 ml-1" />
          </div>

          {/* 3. Pipeline Highlights Widget */}
          <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Bidding Pipeline</div>
                <div className="text-xs font-bold text-white">${(totalPipelineVal / 1000000).toFixed(1)}M in active negotiations</div>
              </div>
            </div>
            <button
              onClick={() => setActiveSection('deals')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Bids</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Recent Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Active Projects Portfolio
              </h2>
              <button 
                onClick={onCreateProject}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="card-dark p-3 hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 bg-[#0D1422] border-[#1A263B] group shadow-sm"
                >
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#1E293B] flex-shrink-0 group-hover:scale-105 transition-transform"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <StatusBadge status={project.status} size="xs" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                      <span>{project.cityState}</span>
                      <span className="font-bold text-slate-200">${(project.budget.total / 1000000).toFixed(2)}M</span>
                    </div>

                    <div className="w-full h-1.5 bg-[#172238] rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Opportunities & Bidding Pipeline View */}
      {activeSection === 'deals' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Pipeline Opportunity</div>
              <div className="text-base font-black text-emerald-400">${(totalPipelineVal / 1000000).toFixed(2)}M</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Probability Rate</div>
              <div className="text-xs font-bold text-blue-400">72% Weighted Average</div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {opportunities.map((deal) => (
              <div key={deal.id} className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{deal.projectTitle}</h4>
                    <span className="text-[10px] text-slate-400">{deal.clientName} • {deal.location}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    deal.stage === 'Won' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    deal.stage === 'Contract Negotiation' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {deal.stage}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#182338] text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">${(deal.estimatedValue / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Win Likelihood: <strong className="text-emerald-400 font-bold">{deal.winProbability}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Network View */}
      {activeSection === 'network' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Vetted Trade Network</div>
              <div className="text-xs font-bold text-white">{subcontractors.length} Verified Master Contractors</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              COI 100% Active
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {subcontractors.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={sub.avatar}
                    alt={sub.companyName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#1E293B]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{sub.companyName}</span>
                      <span title="COI Insurance Verified">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{sub.trade} • {sub.contactName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{sub.complianceRating}% Rating</div>
                  <div className="text-[10px] text-slate-400">{sub.workersOnSite} on site</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-1">
        <Button
          variant="primary"
          onClick={onCreateProject}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Project
        </Button>
      </div>
    </div>
  );
};
