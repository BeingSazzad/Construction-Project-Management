import React from 'react';
import { Project, Task, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckSquare, Users, Plus, ChevronRight, HardHat,
  Sparkles, AlertCircle, Calendar, MapPin, DollarSign,
  FolderKanban, Activity, ShieldAlert, ArrowUpRight, Clock
} from 'lucide-react';

interface PMDashboardProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (project: Project) => void;
  onOpenTask: (task: Task) => void;
  onCreateTask: () => void;
  onOpenSchedule: () => void;
  onOpenLatti: () => void;
}

export const PMDashboard: React.FC<PMDashboardProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenTask,
  onCreateTask,
  onOpenSchedule,
  onOpenLatti
}) => {
  const myProjects = projects.filter(p =>
    ['proj-1', 'proj-2', 'proj-3'].includes(p.id)
  );

  const priorityOrder: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const todayTasks = tasks
    .filter(t => ['proj-1', 'proj-2', 'proj-3'].includes(t.projectId))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 4);

  const totalDueToday = tasks.filter(t => t.status !== 'Completed').length;
  const totalOverdue = tasks.filter(t => t.status === 'Blocked').length;
  const totalMilestones = myProjects.reduce((sum, p) => sum + (p.metrics?.totalMilestones || 6) - (p.metrics?.completedMilestones || 2), 0);

  const milestones = [
    { month: 'AUG', day: '24', title: 'Rough Framing & MEP Inspection', project: 'Riverside Office Complex', type: 'Inspection' },
    { month: 'AUG', day: '28', title: 'Foundation Slab Sign-off', project: 'Highland Luxury Villa', type: 'Milestone' },
    { month: 'AUG', day: '31', title: 'HVAC Duct Pressure Test', project: 'Riverside Office Complex', type: 'Testing' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ── 1. Top PM Executive Command Card ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-xl shadow-blue-950/20 flex flex-col gap-3.5 relative">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
              Project Operations Hub
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Senior Project Manager Oversight</p>
          </div>
          <button 
            onClick={onOpenSchedule}
            className="text-xs font-semibold text-[#3875F6] hover:text-[#60A5FA] transition-colors cursor-pointer flex-shrink-0"
          >
            Full Schedule
          </button>
        </div>

        {/* 4 PM Metric Tiles Compact Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1: Active Projects */}
          <div 
            onClick={onOpenSchedule}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-blue-500/40 cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-white leading-none tracking-tight">
                {myProjects.length}
              </div>
              <div className="text-xs font-semibold text-slate-300 truncate mt-1">
                Active Projects
              </div>
            </div>
          </div>

          {/* Tile 2: Open Tasks */}
          <div 
            onClick={onCreateTask}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-purple-500/40 cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#C084FC] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-white leading-none tracking-tight">
                {totalDueToday}
              </div>
              <div className="text-xs font-semibold text-slate-300 truncate mt-1">
                Open Tasks
              </div>
            </div>
          </div>

          {/* Tile 3: Blocked / Overdue */}
          <div 
            onClick={onOpenSchedule}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-rose-500/40 cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-rose-400 leading-none tracking-tight">
                {totalOverdue || 2}
              </div>
              <div className="text-xs font-semibold text-slate-300 truncate mt-1">
                Blocked Issues
              </div>
            </div>
          </div>

          {/* Tile 4: Pending Milestones */}
          <div 
            onClick={onOpenSchedule}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-emerald-500/40 cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34D399] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-emerald-400 leading-none tracking-tight">
                {totalMilestones || 8}
              </div>
              <div className="text-xs font-semibold text-slate-300 truncate mt-1">
                Milestones
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Actions ── */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-white px-0.5 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'New Task', icon: Plus, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', action: onCreateTask },
            { label: 'Schedule', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', action: onOpenSchedule },
            { label: 'AI Insights', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', action: onOpenLatti },
            { label: 'Team', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', action: onOpenSchedule },
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

      {/* ── 3. Active PM Projects ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">Assigned Projects</h2>
          <button onClick={onOpenSchedule} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer transition-colors">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {myProjects.map((p) => {
            const isAtRisk = p.status === 'At Risk' || p.status === 'Delayed';

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group flex items-center gap-3 active:scale-[0.99]"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#1E2C48]"
                  />
                  {isAtRisk && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#070D1A] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    <StatusBadge status={p.status} size="xs" />
                  </div>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5 truncate">{p.cityState}</p>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-[#141F33] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-[#2563EB]'}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-blue-400 flex-shrink-0">{p.progress}% Done</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Today's Priority Tasks ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Today's Priority Tasks</h3>
          <button 
            onClick={onCreateTask}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {todayTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onOpenTask(t)}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {t.title}
                  </h4>
                  <StatusBadge status={t.priority} size="xs" />
                </div>
                <p className="text-xs text-slate-400 truncate mt-1 font-medium">
                  {t.projectName} · {t.assignee?.name}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Upcoming Milestones Preview ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Upcoming Schedule Milestones</h3>
          <button onClick={onOpenSchedule} className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer">
            Calendar
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase leading-none">{m.month}</span>
                <span className="text-sm font-black leading-none mt-0.5">{m.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">{m.project}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                {m.type}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
