import React, { useState } from 'react';
import { Project, Task, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
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
  const totalMilestones = myProjects.reduce((sum, p) => sum + p.metrics.totalMilestones - p.metrics.completedMilestones, 0);

  const atRiskProject = myProjects.find(p => p.status === 'At Risk') || myProjects[0];

  const milestones = [
    { month: 'MAY', day: '22', title: 'L12 Concrete Slab Pour', project: 'Riverside Office Complex' },
    { month: 'MAY', day: '25', title: 'Steel Topping Out Ceremony', project: 'Downtown Commercial Tower' },
    { month: 'MAY', day: '28', title: 'MEP Rough-in Sign-off (Lvl 5)', project: 'Downtown Commercial Tower' },
    { month: 'JUN', day: '03', title: 'Final Punch Walk – Bldg C', project: 'Greenfield Residential Dev.' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* 2. 4-Column KPI Card */}
      <div className="p-3.5 bg-[#0D1424] border border-[#1A263E] rounded-2xl shadow-sm">
        <div className="grid grid-cols-4 divide-x divide-[#162033] text-center">
          <div className="px-1">
            <div className="text-xs font-semibold text-slate-400">Projects</div>
            <div className="text-lg font-bold text-white my-1">{myProjects.length}</div>
            <div className="text-xs text-slate-500 font-medium">Active</div>
          </div>
          <div className="px-1">
            <div className="text-xs font-semibold text-slate-400">Open</div>
            <div className="text-lg font-bold text-white my-1 flex items-center justify-center gap-0.5">
              {totalDueToday}
            </div>
            <div className="text-xs text-slate-500 font-medium">Tasks</div>
          </div>
          <div className="px-1">
            <div className="text-xs font-semibold text-slate-400">Blocked</div>
            <div className="text-lg font-bold text-rose-400 my-1">{totalOverdue || 3}</div>
            <div className="text-xs text-slate-500 font-medium">Tasks</div>
          </div>
          <div className="px-1">
            <div className="text-xs font-semibold text-slate-400">Milestones</div>
            <div className="text-lg font-bold text-blue-400 my-1">{totalMilestones}</div>
            <div className="text-xs text-slate-500 font-medium">Pending</div>
          </div>
        </div>
      </div>

      {/* 3. My Projects */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">My Projects</h2>
          <button onClick={onOpenSchedule} className="text-xs text-[#3875F6] hover:underline font-semibold cursor-pointer">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {myProjects.map((p) => {
            const isAtRisk = p.status === 'At Risk' || p.status === 'Delayed';
            const budgetActualM = (p.budget.actual / 1_000_000).toFixed(2);
            const budgetTotalM = (p.budget.total / 1_000_000).toFixed(2);

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className={`p-3.5 rounded-2xl bg-[#0D1424] border hover:border-blue-500/40 transition-all cursor-pointer flex items-center gap-3 shadow-sm group ${
                  isAtRisk ? 'border-rose-500/30' : 'border-[#1A263E]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#090E1A] border border-[#162033]">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors leading-tight">
                      {p.name}
                    </h3>
                    <StatusBadge status={p.status} size="xs" />
                  </div>

                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    {p.cityState}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-[#141F33] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-[#2563EB]'}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-200 flex-shrink-0">{p.progress}%</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Priority Tasks */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Today's Priority Tasks</h3>
          <button onClick={onCreateTask} className="text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {todayTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onOpenTask(t)}
              className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                    {t.title}
                  </h4>
                  <StatusBadge status={t.priority} size="xs" />
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                  {t.projectName} · {t.assignee.name}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
