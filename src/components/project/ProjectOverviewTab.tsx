import React from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Clock, Sparkles, ChevronRight, CheckCircle2, 
  MapPin, CheckSquare, HardHat, FileText, Users, DollarSign, Camera, Check,
  ArrowRight, ShieldCheck, TrendingUp
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
  onOpenTask,
  onOpenLatti
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

  return (
    <div className="flex flex-col gap-3.5 pb-28 font-sans text-slate-100 max-w-[430px] mx-auto animate-fade-in">
      {/* 1. Hero Card (Compact Architectural Header) */}
      <div className="rounded-3xl overflow-hidden relative shadow-md border border-[#162238] bg-[#0B1120]">
        <div className="h-40 w-full relative">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent" />
          
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{project.cityState}</span>
            </span>
            <StatusBadge status={project.status} size="xs" />
          </div>
        </div>

        {/* Content Sheet */}
        <div className="p-3.5 pt-1 -mt-4 relative z-10 bg-[#0B1120] rounded-t-3xl border-t border-[#1C2C47]">
          {/* Quick Sub-Navigation Pills */}
          <div className="flex items-center justify-between gap-1 pb-3 border-b border-[#162238] mb-3">
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
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tab.id === 'overview'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#070A12] border border-[#162238]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Progress & Budget Line */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-black text-white leading-none">
                ${(project.budget.actual / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Actual Spent ({project.progress}%)
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1 mx-2">
              <div className="w-full h-2 bg-[#121E36] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-[#00D2B4] rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Budget ${(project.budget.actual / 1000000).toFixed(1)}M</span>
                <span>${(project.budget.total / 1000000).toFixed(1)}M Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact 4-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget</span>
          <span className="text-sm font-black text-white mt-1 block">
            ${(project.budget.total / 1000000).toFixed(2)}M
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Remaining</span>
          <span className="text-sm font-black text-[#00D2B4] mt-1 block">
            ${((project.budget.total - project.budget.actual) / 1000000).toFixed(2)}M
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Tasks</span>
          <span className="text-sm font-black text-white mt-1 block">
            {projectTasks.filter(t => t.status !== 'Completed').length} / {projectTasks.length}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Punch Items</span>
          <span className="text-sm font-black text-amber-400 mt-1 block">
            {punchItems.length} Items
          </span>
        </div>
      </div>

      {/* 3. Today's Key Tasks (Compact Property List Style) */}
      <div className="p-3.5 rounded-3xl bg-[#0B1120] border border-[#162238] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Active Site Tasks
          </h3>
          <button 
            onClick={() => onTabChange('tasks')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {projectTasks.slice(0, 3).map((t, idx) => {
            const stack = taskAvatarStacks[idx % taskAvatarStacks.length];
            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="p-3 rounded-2xl bg-[#101A2E] border border-[#1A2A47] hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-[#0066FF] border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {t.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {t.location || 'Midtown Site Area'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center -space-x-1.5 flex-shrink-0">
                  {stack.map((avatarUrl, aIdx) => (
                    <img
                      key={aIdx}
                      src={avatarUrl}
                      alt="Team"
                      className="w-5 h-5 rounded-full object-cover border border-[#101A2E]"
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
