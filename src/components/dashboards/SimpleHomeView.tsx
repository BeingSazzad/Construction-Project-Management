import React from 'react';
import { Project, Task } from '../../types';
import { 
  FolderKanban, CheckCircle2, ShieldAlert, Check, 
  Sparkles, AlertTriangle, Info, ChevronRight, ArrowRight,
  TrendingUp, Building2, MapPin
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface SimpleHomeViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenLatti: () => void;
  onOpenTasks: () => void;
  onOpenProjects: () => void;
  onOpenBudgets: () => void;
}

export const SimpleHomeView: React.FC<SimpleHomeViewProps> = ({
  projects,
  onSelectProject,
  onOpenLatti,
  onOpenTasks,
  onOpenProjects,
  onOpenBudgets
}) => {
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Company Overview Card (Matching Exact Screenshot) */}
      <div className="p-4 rounded-3xl bg-[#0B1120] border border-[#162238] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Company Overview</h2>
          <button 
            onClick={onOpenProjects}
            className="text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
          >
            Apex Construction
          </button>
        </div>

        {/* 4 Overview Mini Cards */}
        <div className="grid grid-cols-4 gap-2">
          {/* Card 1: Projects */}
          <div 
            onClick={onOpenProjects}
            className="p-2.5 rounded-2xl bg-[#101A2E] border border-[#1A2A47] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 flex items-center justify-center text-[#0066FF] mb-1">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-black text-white leading-none">24</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Projects</span>
          </div>

          {/* Card 2: Active */}
          <div 
            onClick={onOpenProjects}
            className="p-2.5 rounded-2xl bg-[#101A2E] border border-[#1A2A47] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 flex items-center justify-center text-[#0066FF] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-black text-white leading-none">12</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Active</span>
          </div>

          {/* Card 3: At Risk */}
          <div 
            onClick={onOpenLatti}
            className="p-2.5 rounded-2xl bg-[#101A2E] border border-[#1A2A47] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 flex items-center justify-center text-[#0066FF] mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-black text-white leading-none">8</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">At Risk</span>
          </div>

          {/* Card 4: Done */}
          <div 
            onClick={onOpenProjects}
            className="p-2.5 rounded-2xl bg-[#101A2E] border border-[#1A2A47] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-500/15 flex items-center justify-center text-[#0066FF] mb-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-base font-black text-white leading-none">4</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Done</span>
          </div>
        </div>
      </div>

      {/* 2. Budget Summary Card (Matching Exact Screenshot) */}
      <div className="p-4 rounded-3xl bg-[#0B1120] border border-[#162238] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Budget Summary</h2>
          <button 
            onClick={onOpenBudgets}
            className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>All Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Large KPI Numbers */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-lg sm:text-xl font-black text-[#0066FF] leading-none">$24.6M</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">Total Budget</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-[#F59E0B] leading-none">$18.4M</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">Total Cost</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-[#F43F5E] leading-none">-$2.3M</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">Variance</span>
          </div>
        </div>

        {/* 75% Utilized Progress Bar */}
        <div className="mt-1 flex flex-col gap-1.5">
          <div className="w-full h-2 bg-[#121E36] rounded-full overflow-hidden">
            <div className="h-full bg-[#0066FF] rounded-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium text-right">
            75% of total budget utilized
          </span>
        </div>
      </div>

      {/* 3. Latti AI Insights (Matching Exact Screenshot) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-[#0066FF] flex items-center justify-center text-white">
              <Sparkles className="w-3 h-3" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">Latti AI Insights</h2>
          </div>
          <button 
            onClick={onOpenLatti}
            className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Ask Latti</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Insight Card 1: Budget Risk Detected */}
        <div 
          onClick={() => onSelectProject(projects[1] || projects[0])}
          className="p-3.5 rounded-2xl bg-[#0B1120] border border-[#1C2638] hover:border-amber-500/40 transition-all flex items-start gap-3 cursor-pointer shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-white">Budget Risk Detected</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Downtown Tower is $210K over budget. Review cost codes to identify overruns.
            </p>
            <span className="text-[11px] font-bold text-amber-400 hover:underline inline-flex items-center gap-1 mt-1.5">
              <span>View Project</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="w-6 h-6 rounded-full bg-[#121B2D] flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-white transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Insight Card 2: Schedule Alert */}
        <div 
          onClick={onOpenTasks}
          className="p-3.5 rounded-2xl bg-[#0B1120] border border-[#1C2638] hover:border-blue-500/40 transition-all flex items-start gap-3 cursor-pointer shadow-sm group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 mt-0.5">
            <Info className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-white">Schedule Alert</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              2 tasks in Riverside are at risk of missing this week's milestone.
            </p>
            <span className="text-[11px] font-bold text-blue-400 hover:underline inline-flex items-center gap-1 mt-1.5">
              <span>View Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="w-6 h-6 rounded-full bg-[#121B2D] flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-white transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 4. Recent Projects Section (Matching Exact Screenshot) */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Projects</h2>
          <button 
            onClick={onOpenProjects}
            className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="p-3.5 rounded-2xl bg-[#0B1120] border border-[#162238] hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={proj.thumbnail}
                  alt={proj.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#1A2840] flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{proj.cityState}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                <StatusBadge status={proj.status} size="xs" />
                <span className="text-[10px] font-bold text-slate-300">{proj.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
