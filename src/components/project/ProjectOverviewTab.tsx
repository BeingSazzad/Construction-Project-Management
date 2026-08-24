import React from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Clock, Sparkles, ChevronRight, CheckCircle2, 
  MapPin, CheckSquare, HardHat, FileText, Users, DollarSign, Camera, Check 
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

  // Stacked team avatars for task items (matching reference)
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
    <div className="flex flex-col gap-4 pb-24 font-sans text-slate-200">
      {/* 1. HERO PANORAMIC HEADER (Matching Right Screen in Reference) */}
      <div className="rounded-3xl overflow-hidden relative shadow-lg border border-[#1A263B] bg-[#0E1524]">
        {/* Architectural Image */}
        <div className="h-44 w-full relative">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1524] via-[#0E1524]/40 to-transparent" />
          
          <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {project.cityState}
            </span>
            <StatusBadge status={project.status} size="xs" />
          </div>
        </div>

        {/* Floating Sheet Overlay Content */}
        <div className="p-4 pt-2 -mt-6 relative z-10 bg-[#0E1524] rounded-t-3xl border-t border-[#1F2E47]">
          {/* Quick Sub-Navigation Pills (Overview, Tasks, Files, Teams) */}
          <div className="flex items-center justify-between gap-1.5 pb-3 border-b border-[#182338] mb-3">
            <button
              onClick={() => onTabChange('overview')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#0066FF] text-white cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => onTabChange('tasks')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Tasks
            </button>
            <button
              onClick={() => onTabChange('documents')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Files
            </button>
            <button
              onClick={() => onTabChange('subcontractors')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Teams
            </button>
          </div>

          {/* Progress & Budget Line (Matching Reference: $1.8M Progress • Budget $1.2M - $2.5M) */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <div className="text-2xl font-black text-white leading-none">
                ${(project.budget.actual / 1000000).toFixed(1)}M
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Progress ({project.progress}%)
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1 mx-2">
              <div className="w-full h-2.5 bg-[#172238] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Budget ${(project.budget.actual / 1000000).toFixed(1)}M</span>
                <span>${(project.budget.total / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S TASKS (Matching Reference Card Style) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Today's Tasks
          </h3>
          <button 
            onClick={() => onTabChange('tasks')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projectTasks.slice(0, 3).map((t, idx) => {
            const stack = taskAvatarStacks[idx % taskAvatarStacks.length];
            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="card-dark p-3.5 rounded-2xl bg-[#0E1524] border-[#1A263B] hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#151F33] text-blue-400 border border-[#223352] flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                      {t.location || 'Midtown Tower Delivery Area'}
                    </p>
                  </div>
                </div>

                {/* Right Stacked Avatars */}
                <div className="flex items-center -space-x-2 flex-shrink-0 pl-2">
                  {stack.map((avatarUrl, aIdx) => (
                    <img
                      key={aIdx}
                      src={avatarUrl}
                      alt="Team Member"
                      className="w-6 h-6 rounded-full object-cover border-2 border-[#0E1524] ring-1 ring-white/10"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SITE PHOTOS GALLERY (Matching Reference) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Site Photos
          </h3>
          <button 
            onClick={() => onTabChange('photos')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {photos.slice(0, 3).map((ph) => (
            <div
              key={ph.id}
              onClick={() => onTabChange('photos')}
              className="h-24 rounded-2xl overflow-hidden border border-[#1A263B] relative group cursor-pointer shadow-sm"
            >
              <img
                src={ph.url}
                alt={ph.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                <span className="text-[9px] font-bold text-white truncate">{ph.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
