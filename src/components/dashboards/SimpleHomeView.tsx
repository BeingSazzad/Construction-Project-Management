import React from 'react';
import { Project, User } from '../../types';
import { 
  FolderKanban, Activity, Calendar, CheckSquare, 
  AlertTriangle, ChevronRight, FolderPlus, FileSpreadsheet,
  Users, FileText, ArrowUpRight, TrendingUp, Sparkles
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface SimpleHomeViewProps {
  currentUser?: User;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenLatti: () => void;
  onOpenNotifications?: () => void;
  onOpenMessages?: () => void;
  onOpenTasks: () => void;
  onOpenProjects: () => void;
  onOpenBudgets: () => void;
  onOpenOpportunities?: () => void;
  onOpenNewProject?: () => void;
  onOpenTeam?: () => void;
  onOpenReports?: () => void;
}

export const SimpleHomeView: React.FC<SimpleHomeViewProps> = ({
  projects,
  onSelectProject,
  onOpenLatti,
  onOpenProjects,
  onOpenBudgets,
  onOpenOpportunities,
  onOpenNewProject,
  onOpenTeam,
  onOpenReports
}) => {
  const activeCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Pre-Construction' || p.status === 'On Schedule').length;
  const atRiskProjects = projects.filter(p => p.status === 'On Hold' || p.status === 'At Risk' || p.status === 'Delayed');

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── 1. Top 4 KPI Metrics Suite (Matching Reference Web Platform) ── */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Active Projects */}
        <div 
          onClick={onOpenProjects}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-cyan-500/40 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400">
              {projects.length} total
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white leading-none tracking-tight block">
              {activeCount}
            </span>
            <span className="text-[12px] text-slate-400 font-medium mt-1 block group-hover:text-slate-200 transition-colors">
              Active Projects
            </span>
          </div>
        </div>

        {/* Card 2: Tasks In Progress */}
        <div 
          onClick={onOpenProjects}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-purple-500/40 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white leading-none tracking-tight block">
              4
            </span>
            <span className="text-[12px] text-slate-400 font-medium mt-1 block group-hover:text-slate-200 transition-colors">
              Tasks In Progress
            </span>
          </div>
        </div>

        {/* Card 3: Tasks Due Today */}
        <div 
          onClick={onOpenProjects}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-amber-500/40 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white leading-none tracking-tight block">
              2
            </span>
            <span className="text-[12px] text-slate-400 font-medium mt-1 block group-hover:text-slate-200 transition-colors">
              Tasks Due Today
            </span>
          </div>
        </div>

        {/* Card 4: Completed Today */}
        <div 
          onClick={onOpenProjects}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-emerald-500/40 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white leading-none tracking-tight block">
              6
            </span>
            <span className="text-[12px] text-slate-400 font-medium mt-1 block group-hover:text-slate-200 transition-colors">
              Completed Today
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Risk Alerts Section (Reference Web Specs) ── */}
      {atRiskProjects.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Risk Alerts</h3>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {atRiskProjects.length} Flagged
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mt-0.5">
            {atRiskProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] hover:border-amber-500/40 flex items-center justify-between text-xs cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white truncate">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">Status: <strong className="text-amber-400">{p.status}</strong> · Variance alert</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Quick Actions Grid ── */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-0.5">Quick Actions</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: 'New Project', icon: FolderPlus, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
              action: () => onOpenNewProject ? onOpenNewProject() : onOpenProjects()
            },
            { label: 'Budgets', icon: FileSpreadsheet, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', action: onOpenBudgets },
            {
              label: 'Team', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
              action: () => onOpenTeam ? onOpenTeam() : onOpenProjects()
            },
            {
              label: 'Reports', icon: FileText, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20',
              action: () => onOpenReports ? onOpenReports() : onOpenProjects()
            },
          ].map(({ label, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              onClick={action}
              className="p-2.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:bg-[#0C152B] group"
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${color} ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Latti AI Assistant Banner ── */}
      <button
        onClick={onOpenLatti}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#141F3B] via-[#0E172E] to-[#070D1A] border border-blue-500/30 hover:border-blue-400/60 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-md shadow-blue-500/10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-bold text-white">Latti AI Assistant</p>
            <p className="text-[12px] text-slate-300 font-medium mt-0.5 truncate">Ask questions, query project budgets, or check timelines</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-blue-400 group-hover:text-white transition-colors flex-shrink-0">
          <span className="text-[12px] font-bold">Ask Latti</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* ── 5. Opportunities Pipeline Card ── */}
      {onOpenOpportunities && (
        <button
          onClick={onOpenOpportunities}
          className="w-full p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Opportunities Pipeline</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">6 Active</span>
              </div>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5 truncate">$3.77M Pipeline Value · 25% Avg Prob</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0">
            <span className="text-[12px] font-bold">Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      )}

      {/* ── 6. Active Projects Feed ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">Active Projects</h2>
          <button
            onClick={onOpenProjects}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.slice(0, 3).map((project) => {
            const isRisk = project.status === 'At Risk' || project.status === 'Delayed';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group flex items-center gap-3 active:scale-[0.99]"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80'; }}
                    className="w-14 h-14 rounded-xl object-cover border border-[#1E2C48]"
                  />
                  {isRisk && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#070D1A] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{project.name}</h3>
                    <StatusBadge status={project.status} size="xs" />
                  </div>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5 truncate">{project.cityState}</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Budget:</span>
                      <span className="text-[12px] font-bold text-white">${((project.budget?.total || 0) / 1000000).toFixed(1)}M</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-400">{project.progress}% Done</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
