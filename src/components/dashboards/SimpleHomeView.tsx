import React from 'react';
import { Project, User } from '../../types';
import { 
  FolderKanban, CheckCircle2, ShieldAlert, DollarSign,
  Sparkles, ChevronRight, FolderPlus, FileSpreadsheet,
  Users, FileText, ArrowUpRight, MessageSquare
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
  onOpenNewProject?: () => void;
  onOpenTeam?: () => void;
  onOpenReports?: () => void;
}

export const SimpleHomeView: React.FC<SimpleHomeViewProps> = ({
  projects,
  onSelectProject,
  onOpenLatti,
  onOpenMessages,
  onOpenProjects,
  onOpenBudgets,
  onOpenNewProject,
  onOpenTeam,
  onOpenReports
}) => {
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget?.total || 0), 0);
  const atRiskCount = projects.filter(p => p.status === 'At Risk' || p.status === 'Delayed').length;
  const activeCount = projects.filter(p => p.status === 'On Schedule' || p.status === 'At Risk').length;

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── 1. Company Portfolio KPI Strip ── */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0E1A33] via-[#070D1A] to-[#050811] border border-[#1E325A] shadow-lg relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-4 left-4 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/80">Avery & Marsh · Portfolio</p>
              <h2 className="text-xs font-bold text-slate-300 mt-0.5">Company Overview</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Sites', value: String(projects.length), icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-500/10', action: onOpenProjects },
              { label: 'Active', value: String(activeCount), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', action: onOpenProjects },
              { label: 'At Risk', value: String(atRiskCount), icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10', action: onOpenProjects },
              { label: 'Budget', value: `$${(totalBudget / 1000000).toFixed(0)}M`, icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10', action: onOpenBudgets },
            ].map(({ label, value, icon: Icon, color, bg, action }) => (
              <button
                key={label}
                onClick={action}
                className="p-2 rounded-2xl bg-[#060913]/60 border border-[#142036] hover:border-blue-500/40 flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 group"
              >
                <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-extrabold text-white leading-none">{value}</span>
                <span className="text-[10px] text-slate-400 font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Quick Actions ── */}
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
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Latti AI Intelligence Strip ── */}
      <button
        onClick={onOpenLatti}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#1a1060] via-[#0f0a38] to-[#050811] border border-purple-500/30 hover:border-purple-400/60 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-md shadow-purple-500/10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-bold text-white">Latti AI Radar</p>
            <p className="text-[11px] text-purple-300 font-medium mt-0.5 truncate">2 schedule risks · 1 budget alert</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-purple-300 group-hover:text-white transition-colors flex-shrink-0">
          <span className="text-[11px] font-bold">Ask AI</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* ── 4. Active Projects Feed ── */}
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
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{project.cityState}</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Budget:</span>
                      <span className="text-[11px] font-bold text-white">${((project.budget?.total || 0) / 1000000).toFixed(1)}M</span>
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
