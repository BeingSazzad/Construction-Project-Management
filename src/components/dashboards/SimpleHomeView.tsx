import React from 'react';
import { Project } from '../../types';
import { 
  FolderKanban, CheckCircle2, ShieldAlert, Check, 
  Sparkles, AlertTriangle, Info, ChevronRight, ArrowRight,
  MapPin
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
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Company Overview Card */}
      <div className="p-3.5 rounded-2xl bg-[#0B101D] border border-[#141C2E] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 tracking-tight">Company Overview</h2>
          <button 
            onClick={onOpenProjects}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Apex Construction
          </button>
        </div>

        {/* 4 Overview Mini Cards */}
        <div className="grid grid-cols-4 gap-1.5">
          <div 
            onClick={onOpenProjects}
            className="p-2 rounded-xl bg-[#0E1526] border border-[#162035] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-0.5">
              <FolderKanban className="w-3 h-3" />
            </div>
            <span className="text-sm font-bold text-white leading-tight">24</span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Projects</span>
          </div>

          <div 
            onClick={onOpenProjects}
            className="p-2 rounded-xl bg-[#0E1526] border border-[#162035] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-0.5">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span className="text-sm font-bold text-white leading-tight">12</span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Active</span>
          </div>

          <div 
            onClick={onOpenLatti}
            className="p-2 rounded-xl bg-[#0E1526] border border-[#162035] flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/40 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-0.5">
              <ShieldAlert className="w-3 h-3" />
            </div>
            <span className="text-sm font-bold text-white leading-tight">8</span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">At Risk</span>
          </div>

          <div 
            onClick={onOpenProjects}
            className="p-2 rounded-xl bg-[#0E1526] border border-[#162035] flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/40 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-0.5">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="text-sm font-bold text-white leading-tight">4</span>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Done</span>
          </div>
        </div>
      </div>

      {/* 2. Budget Summary Card */}
      <div className="p-3.5 rounded-2xl bg-[#0B101D] border border-[#141C2E] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 tracking-tight">Budget Summary</h2>
          <button 
            onClick={onOpenBudgets}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>All Projects</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 3 KPI Numbers */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <div>
            <div className="text-lg font-bold text-blue-400 tracking-tight leading-none">$24.6M</div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Total Budget</span>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-400 tracking-tight leading-none">$18.4M</div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Total Cost</span>
          </div>
          <div>
            <div className="text-lg font-bold text-rose-400 tracking-tight leading-none">-$2.3M</div>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Variance</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="w-full h-1.5 bg-[#121B2D] rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[10px] text-slate-400 text-right font-medium">
            75% utilized
          </span>
        </div>
      </div>

      {/* 3. Latti AI Insights */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <h2 className="text-xs font-bold text-slate-200 tracking-tight">AI Insights</h2>
          </div>
          <button 
            onClick={onOpenLatti}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Ask Latti</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Insight Card 1 */}
        <div 
          onClick={() => onSelectProject(projects[1] || projects[0])}
          className="p-3 rounded-2xl bg-[#0B101D] border border-[#141C2E] hover:border-amber-500/40 transition-all flex items-start gap-2.5 cursor-pointer shadow-sm group"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-400 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white">Downtown Tower Budget Risk</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              $210K overrun detected in steel framing codes.
            </p>
            <span className="text-[10px] font-semibold text-amber-400 inline-flex items-center gap-1 mt-1">
              <span>View Project</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors mt-1" />
        </div>

        {/* Insight Card 2 */}
        <div 
          onClick={onOpenTasks}
          className="p-3 rounded-2xl bg-[#0B101D] border border-[#141C2E] hover:border-blue-500/40 transition-all flex items-start gap-2.5 cursor-pointer shadow-sm group"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-white">Riverside Milestone Alert</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              2 inspection tasks require sign-off before Friday.
            </p>
            <span className="text-[10px] font-semibold text-blue-400 inline-flex items-center gap-1 mt-1">
              <span>View Tasks</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors mt-1" />
        </div>
      </div>

      {/* 4. Recent Projects Section */}
      <div className="flex flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 tracking-tight">Recent Projects</h2>
          <button 
            onClick={onOpenProjects}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="p-3 rounded-2xl bg-[#0B101D] border border-[#141C2E] hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={proj.thumbnail}
                  alt={proj.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#162035] flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
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
                <span className="text-[10px] font-semibold text-slate-300">{proj.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
