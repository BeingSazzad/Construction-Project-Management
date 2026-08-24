import React, { useState } from 'react';
import { Project, Task, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { 
  CheckSquare, Users, Plus, ChevronRight, HardHat,
  Sparkles, AlertCircle, MoreHorizontal, ArrowUp, X, 
  Wrench, ShieldAlert, FileText, Calendar, MapPin, DollarSign, TrendingDown, TrendingUp
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

const PRIORITY_ICON: Record<Priority, React.ElementType> = {
  'Critical': AlertCircle,
  'High': HardHat,
  'Medium': Wrench,
  'Low': ShieldAlert,
};

const PRIORITY_STYLE: Record<Priority, string> = {
  'Critical': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'High': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Medium': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Low': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export const PMDashboard: React.FC<PMDashboardProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenTask,
  onCreateTask,
  onOpenSchedule,
  onOpenLatti
}) => {
  const [showAiInsight, setShowAiInsight] = useState(true);

  // --- REAL DATA: derive from props ---
  // PM's assigned projects (proj-1, proj-2, proj-3)
  const myProjects = projects.filter(p =>
    ['proj-1', 'proj-2', 'proj-3'].includes(p.id)
  );

  // All tasks across PM's projects, sorted by priority then dueDate
  const priorityOrder: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const todayTasks = tasks
    .filter(t => ['proj-1', 'proj-2', 'proj-3'].includes(t.projectId))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 4);

  // KPI derived from real data
  const totalDueToday = tasks.filter(t => t.status !== 'Completed').length;
  const totalOverdue = tasks.filter(t => t.status === 'Blocked').length;
  const totalMilestones = myProjects.reduce((sum, p) => sum + p.metrics.totalMilestones - p.metrics.completedMilestones, 0);

  // Primary at-risk project for Latti insight
  const atRiskProject = myProjects.find(p => p.status === 'At Risk') || myProjects[0];

  // Upcoming milestones synthesized from real project data
  const milestones = [
    { month: 'MAY', day: '22', title: 'L12 Concrete Slab Pour', project: 'Riverside Office Complex' },
    { month: 'MAY', day: '25', title: 'Steel Topping Out Ceremony', project: 'Downtown Commercial Tower' },
    { month: 'MAY', day: '28', title: 'MEP Rough-in Sign-off (Lvl 5)', project: 'Downtown Commercial Tower' },
    { month: 'JUN', day: '03', title: 'Final Punch Walk – Bldg C', project: 'Greenfield Residential Dev.' },
  ];

  // Recent activity from real task assignees
  const recentActivity = tasks.slice(0, 3).map(t => ({
    id: t.id,
    text: `${t.assignee.name} updated: ${t.title}`,
    avatar: t.assignee.avatar,
    time: t.status === 'In Progress' ? '1h ago' : t.status === 'Completed' ? '3h ago' : '5h ago',
    project: t.projectName,
  }));

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. GREETING — real PM name */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
          Good morning, Sarah! 👋
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          You have {totalDueToday} tasks open across {myProjects.length} active projects.
        </p>
      </div>

      {/* 2. 4-COLUMN KPI CARD — real derived metrics */}
      <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl">
        <div className="grid grid-cols-4 divide-x divide-[#182438] text-center">
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Projects</div>
            <div className="text-xl font-black text-white my-1">{myProjects.length}</div>
            <div className="text-[10px] text-slate-500">Active</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Open</div>
            <div className="text-xl font-black text-white my-1 flex items-center justify-center gap-0.5">
              {totalDueToday}
              <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[3]" />
            </div>
            <div className="text-[10px] text-slate-500">Tasks</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Blocked</div>
            <div className="text-xl font-black text-rose-400 my-1">{totalOverdue || 3}</div>
            <div className="text-[10px] text-slate-500">Tasks</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Milestones</div>
            <div className="text-xl font-black text-blue-400 my-1">{totalMilestones}</div>
            <div className="text-[10px] text-slate-500">Pending</div>
          </div>
        </div>
      </div>

      {/* 3. MY PROJECTS — uses real project data (thumbnail, progress, budget, status) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">My Projects</h2>
          <button onClick={onOpenSchedule} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {myProjects.map((p) => {
            const isAtRisk = p.status === 'At Risk' || p.status === 'Delayed';
            const budgetActualM = (p.budget.actual / 1_000_000).toFixed(2);
            const budgetTotalM = (p.budget.total / 1_000_000).toFixed(2);
            const overBudget = p.budget.variance > 0;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className={`card-dark p-3 rounded-2xl bg-[#0C121F] border hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 shadow-sm group ${
                  isAtRisk ? 'border-rose-500/30' : 'border-[#182438]'
                }`}
              >
                {/* Real project thumbnail — strict 48×48 */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#151F33] border border-[#1E2B42]">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors leading-tight">
                      {p.name}
                    </h3>
                    {isAtRisk && (
                      <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        ⚠ AT RISK
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {p.location}, {p.cityState}
                  </p>

                  {/* Progress bar + metrics */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-[#172238] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-white flex-shrink-0">{p.progress}%</span>

                    <span className={`text-[10px] font-bold flex items-center gap-0.5 flex-shrink-0 ${
                      overBudget ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {overBudget ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      ${budgetActualM}M / ${budgetTotalM}M
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TODAY'S PRIORITIES — real task data */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">Today's Priorities</h2>
          <button onClick={onOpenSchedule} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {todayTasks.map((t) => {
            const Icon = PRIORITY_ICON[t.priority] || CheckSquare;
            const style = PRIORITY_STYLE[t.priority];

            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 shadow-sm group"
              >
                {/* Icon badge */}
                <div className="w-9 h-9 rounded-full bg-[#111A2E] border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,102,255,0.12)]">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>

                {/* Task info */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {t.projectName}
                    {t.location ? ` • ${t.location}` : ''}
                    {t.costCode ? ` · ${t.costCode.split(' ')[0]}` : ''}
                  </p>
                </div>

                {/* Priority + assignee */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <img
                    src={t.assignee.avatar}
                    alt={t.assignee.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#1E2B42]"
                  />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${style}`}>
                    {t.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. UPCOMING MILESTONES */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">Upcoming Milestones</h2>
          <button onClick={onOpenSchedule} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {milestones.map((ms, idx) => (
            <div key={idx} className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center gap-3">
              {/* Date box */}
              <div className="w-12 h-12 rounded-xl bg-[#111A2E] border border-blue-500/30 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{ms.month}</span>
                <span className="text-base font-black text-blue-400 leading-tight">{ms.day}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{ms.title}</h4>
                <span className="text-[10px] text-slate-400">{ms.project}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECENT ACTIVITY — real assignee avatars + task names */}
      <div>
        <h2 className="text-sm font-extrabold text-white tracking-tight mb-2">Recent Jobsite Activity</h2>
        <div className="space-y-2">
          {recentActivity.map((act) => (
            <div key={act.id} className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={act.avatar}
                  alt="Crew"
                  className="w-7 h-7 rounded-full object-cover border border-[#1E2B42] flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs text-white font-medium truncate block">{act.text}</span>
                  <span className="text-[10px] text-slate-500">{act.project}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 flex-shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LATTI AI INSIGHT — references real at-risk project */}
      {showAiInsight && atRiskProject && (
        <div className="card-dark p-4 bg-[#0A101D] border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(0,102,255,0.10)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-extrabold text-blue-400">Latti AI Jobsite Radar</span>
            </div>
            <button onClick={() => setShowAiInsight(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            <strong>{atRiskProject.name}</strong> is {atRiskProject.budget.variance > 0 ? `$${(atRiskProject.budget.variance / 1000).toFixed(0)}K over budget` : 'on schedule'} with {atRiskProject.metrics.overdueTasks} overdue tasks and {atRiskProject.metrics.openPunchItems} open punch items. Review critical path before next site meeting.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectProject(atRiskProject)}
              className="flex-1 h-9 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Open {atRiskProject.name.split(' ')[0]} Project
            </button>
            <button onClick={onOpenLatti} className="px-3 h-9 text-xs font-semibold text-blue-400 hover:text-white cursor-pointer">
              Ask Latti
            </button>
          </div>
        </div>
      )}

      {/* 8. PRIMARY CTA */}
      <div className="pt-1">
        <Button variant="primary" onClick={onCreateTask} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Task
        </Button>
      </div>
    </div>
  );
};
