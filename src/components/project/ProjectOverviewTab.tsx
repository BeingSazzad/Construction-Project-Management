import React from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, CheckSquare, ArrowRight, DollarSign, Calendar
} from 'lucide-react';

interface ProjectOverviewTabProps {
  project: Project;
  tasks: Task[];
  punchItems: PunchItem[];
  photos: SitePhoto[];
  documents: DocumentItem[];
  onTabChange: (tabId: string) => void;
  onOpenTask: (task: Task) => void;
  onOpenPunch: (item: PunchItem) => void;
  onOpenLatti: () => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks,
  punchItems,
  photos,
  onTabChange,
  onOpenTask
}) => {
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const taskAvatarStacks = [
    [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    ],
    [
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    ]
  ];

  const actualM = (project.budget.actual / 1000000).toFixed(2);
  const totalM = (project.budget.total / 1000000).toFixed(2);
  const remainingM = ((project.budget.total - project.budget.actual) / 1000000).toFixed(2);

  return (
    <div className="flex flex-col gap-4 pb-28 font-sans text-slate-100 max-w-[430px] mx-auto animate-fade-in">
      {/* 1. Hero Card */}
      <div className="rounded-3xl overflow-hidden relative shadow-sm border border-[#1A263E] bg-[#0D1424]">
        <div className="h-44 w-full relative">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-[#0D1424]/40 to-transparent" />
          
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-white bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#3875F6]" />
              <span>{project.cityState}</span>
            </span>
            <StatusBadge status={project.status} size="sm" />
          </div>
        </div>

        {/* Content Sheet */}
        <div className="p-4 pt-2 -mt-4 relative z-10 bg-[#0D1424] rounded-t-3xl border-t border-[#1E2C48]">
          {/* Quick Sub-Navigation Pills */}
          <div className="flex items-center justify-between gap-1 pb-3.5 border-b border-[#162238] mb-3.5 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'daily-logs', label: 'Daily Logs' },
              { id: 'plangrid', label: 'PlanGrid' },
              { id: 'messages', label: 'Chat' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  tab.id === 'overview'
                    ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white bg-[#090E1A] border border-[#141F33]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Progress & Budget Line */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold text-white leading-none">
                ${actualM}M
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Spent ({project.progress}%)
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 mx-2">
              <div className="w-full h-2 bg-[#141F33] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563EB] rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Spent ${actualM}M</span>
                <span>${totalM}M Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4-Metric Grid (Clean 12/14/16px typography) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Total Budget</span>
          <span className="text-sm sm:text-base font-bold text-white mt-1 block">
            ${totalM}M
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Remaining</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 mt-1 block">
            ${remainingM}M
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Open Tasks</span>
          <span className="text-sm sm:text-base font-bold text-white mt-1 block">
            {projectTasks.filter(t => t.status !== 'Completed').length} / {projectTasks.length}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block">Punch Items</span>
          <span className="text-sm sm:text-base font-bold text-amber-400 mt-1 block">
            {punchItems.length} Open
          </span>
        </div>
      </div>

      {/* 3. Today's Key Tasks */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Active Site Tasks
          </h3>
          <button 
            onClick={() => onTabChange('tasks')}
            className="text-xs font-semibold text-[#3875F6] hover:text-blue-400 flex items-center gap-1 cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projectTasks.slice(0, 3).map((t, idx) => {
            const stack = taskAvatarStacks[idx % taskAvatarStacks.length];
            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="p-3.5 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {t.location || 'Midtown Jobsite'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center -space-x-1.5 flex-shrink-0">
                  {stack.map((avatarUrl, aIdx) => (
                    <img
                      key={aIdx}
                      src={avatarUrl}
                      alt="Team"
                      className="w-6 h-6 rounded-full object-cover border-2 border-[#090E1A]"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
