import React, { useState } from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, CheckSquare, AlertCircle, 
  DollarSign, Camera, FileText,
  Check, Calendar, Clock,
  Briefcase, ChevronRight, Activity
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
  onAddTasksFromTemplate?: (tasks: Partial<Task>[]) => void;
  onUpdateStatus?: (newStatus: any) => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks = [],
  punchItems = [],
  photos = [],
  documents = [],
  onTabChange,
  onOpenTask,
  onOpenPunch,
  onUpdateStatus,
}) => {
  const getInitialStage = (): 'Planning' | 'Pre-Con' | 'In Progress' | 'Completed' => {
    if (project.status === 'Planning') return 'Planning';
    if (project.status === 'Pre-Construction') return 'Pre-Con';
    if (project.status === 'Completed' || project.status === 'Warranty') return 'Completed';
    return 'In Progress';
  };

  const [currentStage, setCurrentStage] = useState<'Planning' | 'Pre-Con' | 'In Progress' | 'Completed'>(
    getInitialStage()
  );

  const stages = ['Planning', 'Pre-Con', 'In Progress', 'Completed'] as const;

  const handleStageChange = (stage: 'Planning' | 'Pre-Con' | 'In Progress' | 'Completed') => {
    setCurrentStage(stage);
    if (onUpdateStatus) {
      const mapped: Record<string, string> = {
        'Planning': 'Planning',
        'Pre-Con': 'Pre-Construction',
        'In Progress': 'In Progress',
        'Completed': 'Completed'
      };
      onUpdateStatus(mapped[stage] || stage);
    }
  };

  // Calculated Financial Metrics
  const spentM = (project.budget.actual / 1000000).toFixed(2);
  const totalM = (project.budget.total / 1000000).toFixed(2);
  const remainingM = Math.max(0, (project.budget.total - project.budget.actual) / 1000000).toFixed(2);

  // Task & Quality Metrics
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const openPunchCount = punchItems.filter(p => p.status === 'Open' || p.status === 'In Progress').length;
  const highPriorityPunch = punchItems.filter(p => p.priority === 'High' || p.priority === 'Critical');

  const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);

  const handleSelectStatus = (newStatus: any) => {
    setIsStatusPickerOpen(false);
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
    }
    if (newStatus === 'Planning') setCurrentStage('Planning');
    else if (newStatus === 'Pre-Construction') setCurrentStage('Pre-Con');
    else if (newStatus === 'Completed' || newStatus === 'Warranty') setCurrentStage('Completed');
    else setCurrentStage('In Progress');
  };

  return (
    <div className="w-full flex flex-col gap-4 pt-1 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HERO BANNER ─── */}
      <div className="h-44 w-full relative rounded-2xl overflow-hidden border border-[#142036] shadow-md group">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/60 to-transparent" />
        
        {/* Floating Header Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <span className="text-xs font-semibold text-white bg-[#060913]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#3875F6]" />
            <span>{project.cityState}</span>
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsStatusPickerOpen(!isStatusPickerOpen);
              }}
              className="cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
              title="Click to update project status"
            >
              <StatusBadge status={project.status} size="xs" />
            </button>

            {/* Quick Status Dropdown Menu */}
            {isStatusPickerOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 w-44 bg-[#0A111F]/95 backdrop-blur-xl border border-[#1E2E4A] rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-fade-in"
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#142036]">
                  Change Project Status
                </div>
                {(['Planning', 'Pre-Construction', 'In Progress', 'On Hold', 'Completed', 'Warranty'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleSelectStatus(st)}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      project.status === st
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-[#101B2E] hover:text-white'
                    }`}
                  >
                    <span>{st}</span>
                    {project.status === st && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h2 className="text-base font-bold text-white tracking-tight truncate drop-shadow-sm">
            {project.name}
          </h2>
          <div className="flex items-center justify-between text-xs text-slate-300 mt-1 font-medium">
            <span>PM: {project.projectManager.name}</span>
            <span className="text-blue-400 font-bold">{project.progress}% Complete</span>
          </div>
        </div>
      </div>

      {/* ─── 2. CONNECTED PROJECT LIFECYCLE STEPPER ─── */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Stage</span>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            {currentStage}
          </span>
        </div>

        {/* Connected Step Pipeline */}
        <div className="relative flex items-center justify-between pt-2 pb-1 px-2">
          <div className="absolute top-[22px] left-6 right-6 h-0.5 bg-[#142036] z-0" />
          <div 
            className="absolute top-[22px] left-6 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 z-0" 
            style={{ 
              width: `${(stages.indexOf(currentStage) / (stages.length - 1)) * 88}%` 
            }}
          />

          {stages.map((stage, idx) => {
            const currentIdx = stages.indexOf(currentStage);
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;

            return (
              <button
                key={stage}
                onClick={() => handleStageChange(stage)}
                className="flex flex-col items-center gap-1.5 z-10 cursor-pointer group select-none active:scale-95 transition-transform"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-[#0A111F]'
                    : isActive
                    ? 'bg-[#0A111F] border-2 border-blue-500 text-blue-400 ring-4 ring-blue-500/20 shadow-md'
                    : 'bg-[#070D1A] border border-[#142036] text-slate-500 ring-4 ring-[#0A111F]'
                }`}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                <span className={`text-[10px] font-bold leading-tight ${
                  isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. KEY VITALS CARDS ─── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Progress & Tasks */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <CheckSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-white">{project.progress}%</span>
              <span className="text-xs text-slate-400 font-medium">{completedTasksCount}/{tasks.length} tasks</span>
            </div>
            <div className="w-full bg-[#050811] h-2 rounded-full overflow-hidden mt-1.5 border border-[#142036]">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Budget Vitals */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Financial Vitals</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-emerald-400">${spentM}M</span>
              <span className="text-xs text-slate-400 font-medium">of ${totalM}M</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              ${remainingM}M budget remaining
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. QUICK ACCESS NAVIGATION GRID ─── */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h3>
          <span className="text-[10px] text-slate-500 font-medium">Tap to open module</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onTabChange('tasks')}
            className="p-3 rounded-2xl bg-[#070D1A] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Tasks</span>
            <span className="text-[10px] text-slate-400 font-medium">{tasks.length}</span>
          </button>

          <button
            onClick={() => onTabChange('punch')}
            className="p-3 rounded-2xl bg-[#070D1A] hover:bg-[#0E1A33] border border-[#142036] hover:border-rose-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Punch</span>
            <span className="text-[10px] text-rose-400 font-bold">{openPunchCount} open</span>
          </button>

          <button
            onClick={() => onTabChange('photos')}
            className="p-3 rounded-2xl bg-[#070D1A] hover:bg-[#0E1A33] border border-[#142036] hover:border-sky-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Photos</span>
            <span className="text-[10px] text-slate-400 font-medium">{photos.length}</span>
          </button>

          <button
            onClick={() => onTabChange('documents')}
            className="p-3 rounded-2xl bg-[#070D1A] hover:bg-[#0E1A33] border border-[#142036] hover:border-purple-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Docs</span>
            <span className="text-[10px] text-slate-400 font-medium">{documents.length}</span>
          </button>
        </div>
      </div>

      {/* ─── 5. HIGH PRIORITY ITEMS & RECENT ACTIVITY ─── */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Priority Punch Items</h3>
          </div>
          <button
            onClick={() => onTabChange('punch')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {punchItems.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">No open punch items for this project.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {punchItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenPunch(item)}
                className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/30 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                    {item.location} · Assigned to {item.assignedTo.name}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.priority === 'High' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
