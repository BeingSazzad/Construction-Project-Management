import React, { useState } from 'react';
import { Task, SitePhoto, Project, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Sun, Users, ShieldCheck, Camera, FileText, 
  ChevronRight, AlertCircle, MapPin, CheckSquare, Plus,
  Video, Truck, Package, Radio, Sparkles, Clock, HardHat,
  CalendarDays, MessageSquare, CheckCircle2, Circle, Eye,
  ArrowUpRight, AlertTriangle, Layers, Filter
} from 'lucide-react';

interface FieldDashboardProps {
  projects?: Project[];
  tasks: Task[];
  photos: SitePhoto[];
  onOpenTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onTriggerPhotoUpload: () => void;
  onViewDrawings: () => void;
  onSelectProject?: (project: Project) => void;
  onOpenSchedule?: () => void;
  onOpenMessages?: () => void;
  onOpenDailyLog?: () => void;
}

export const FieldDashboard: React.FC<FieldDashboardProps> = ({
  projects = [],
  tasks,
  photos,
  onOpenTask,
  onUpdateTaskStatus,
  onTriggerPhotoUpload,
  onViewDrawings,
  onSelectProject,
  onOpenSchedule,
  onOpenMessages,
  onOpenDailyLog
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'dueToday' | 'inProgress' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showLiveCam, setShowLiveCam] = useState<boolean>(true);

  // Active Project (first assigned or selected)
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Derive Field Staff Tasks
  const displayTasks = tasks.filter(t => {
    if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false;
    if (taskFilter === 'dueToday') return t.status !== 'Completed';
    if (taskFilter === 'inProgress') return t.status === 'In Progress';
    if (taskFilter === 'completed') return t.status === 'Completed';
    return true;
  });

  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Not Started' || t.status === 'Blocked').length;

  const scheduleTimeline = [
    { time: '08:00 AM', title: 'Concrete Pour - L12 Deck', project: activeProject?.name || 'Riverside Office Complex', type: 'Active', badge: 'Critical' },
    { time: '11:30 AM', title: 'City Inspector Cylinder Test Pull', project: activeProject?.name || 'Riverside Office Complex', type: 'Inspection', badge: 'Inspection' },
    { time: '01:00 PM', title: 'Rebar Installation Verification', project: 'Downtown Commercial Tower', type: 'Upcoming', badge: 'Milestone' },
    { time: '04:30 PM', title: 'Daily Site Log & Safety Closeout', project: activeProject?.name || 'Riverside Office Complex', type: 'Log', badge: 'Daily Log' },
  ];

  // Cycle 1-Click Task status
  const handleCycleStatus = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    let nextStatus: TaskStatus = 'In Progress';
    if (task.status === 'Not Started') nextStatus = 'In Progress';
    else if (task.status === 'In Progress') nextStatus = 'Completed';
    else if (task.status === 'Completed') nextStatus = 'Not Started';
    else nextStatus = 'In Progress';

    onUpdateTaskStatus(task.id, nextStatus);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 sm:px-5 py-4 pb-32 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ── 1. Top Executive Field Command Header ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-xl shadow-blue-950/20 flex flex-col gap-3.5 relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white tracking-tight leading-none">
                  Field Staff Hub
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  On-Site
                </span>
              </div>
              <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                {activeProject ? activeProject.name : 'Assigned Job Sites'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onTriggerPhotoUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 flex-shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snap Photo</span>
          </button>
        </div>

        {/* 4 Field KPI Tiles Compact Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Tile 1: Tasks In Progress */}
          <div 
            onClick={() => setTaskFilter('inProgress')}
            className={`flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border transition-all shadow-sm cursor-pointer ${
              taskFilter === 'inProgress' ? 'border-sky-400 bg-sky-950/20' : 'border-[#162238] hover:border-sky-500/40'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[#38BDF8] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-white leading-none tracking-tight">
                {inProgressCount || 3}
              </div>
              <div className="text-[12px] font-semibold text-slate-300 truncate mt-1">
                In Progress
              </div>
            </div>
          </div>

          {/* Tile 2: Completed Tasks */}
          <div 
            onClick={() => setTaskFilter('completed')}
            className={`flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border transition-all shadow-sm cursor-pointer ${
              taskFilter === 'completed' ? 'border-emerald-400 bg-emerald-950/20' : 'border-[#162238] hover:border-emerald-500/40'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34D399] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-emerald-400 leading-none tracking-tight">
                {completedCount || 5}
              </div>
              <div className="text-[12px] font-semibold text-slate-300 truncate mt-1">
                Completed Today
              </div>
            </div>
          </div>

          {/* Tile 3: Safety Compliance */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#34D399] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-emerald-400 leading-none tracking-tight">
                100%
              </div>
              <div className="text-[12px] font-semibold text-slate-300 truncate mt-1">
                Safety Passed
              </div>
            </div>
          </div>

          {/* Tile 4: Weather & Site Condition */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1E] border border-[#162238] hover:border-amber-500/40 transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#FBBF24] flex items-center justify-center flex-shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black text-amber-400 leading-none tracking-tight">
                74°F
              </div>
              <div className="text-[12px] font-semibold text-slate-300 truncate mt-1">
                Clear & Dry
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Field Action Center ── */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-white px-0.5 tracking-tight flex items-center justify-between">
          <span>Quick Actions</span>
          <span className="text-[10px] text-slate-400 font-semibold">1-Tap Fast Access</span>
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Snap Photo', icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', action: onTriggerPhotoUpload },
            { label: 'Daily Log', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', action: onOpenDailyLog || onViewDrawings },
            { label: 'Blueprints', icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', action: onViewDrawings },
            { label: 'Team Chat', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', action: onOpenMessages || onViewDrawings },
          ].map(({ label, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              onClick={action}
              className="p-2.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:bg-[#0C152B] group"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color} ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Assigned Tasks with 1-Click Status Cycle & Filters ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight shrink-0">Assigned Tasks</h2>
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 shrink-0">
              {displayTasks.length} tasks
            </span>
          </div>
          
          {/* Quick Filter Pills (12px standard font size) */}
          <div className="flex items-center gap-1 bg-[#090F1E] p-1 rounded-2xl border border-[#162238] shrink-0">
            {(['all', 'dueToday', 'inProgress', 'completed'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setTaskFilter(filterKey)}
                className={`px-2.5 py-1 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                  taskFilter === filterKey 
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filterKey === 'dueToday' ? 'Today' : filterKey === 'inProgress' ? 'Active' : filterKey === 'all' ? 'All' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards List */}
        <div className="flex flex-col gap-2.5">
          {displayTasks.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#070D1A] border border-[#142036] text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <p className="text-xs font-bold text-white">All caught up!</p>
              <p className="text-[11px] text-slate-400">No tasks matching the selected filter.</p>
            </div>
          ) : (
            displayTasks.slice(0, 5).map((t) => {
              const isCompleted = t.status === 'Completed';
              const isInProgress = t.status === 'In Progress';

              return (
                <div
                  key={t.id}
                  onClick={() => onOpenTask(t)}
                  className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all shadow-sm flex flex-col gap-2.5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* 1-Tap Status Checkbox Button */}
                    <button
                      onClick={(e) => handleCycleStatus(e, t)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all mt-0.5 cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : isInProgress 
                            ? 'bg-sky-500/20 border-sky-400 text-sky-400' 
                            : 'bg-[#050811] border-slate-700 text-slate-500 hover:border-blue-400'
                      }`}
                      title="Click to cycle status (Not Started -> In Progress -> Completed)"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : isInProgress ? (
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 stroke-[1.5]" />
                      )}
                    </button>

                    {/* Task Title & Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-white group-hover:text-blue-300'}`}>
                          {t.title}
                        </h4>
                        <StatusBadge status={t.status} size="xs" />
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                        <span className="font-medium text-slate-300">{t.projectName}</span>
                        {t.location && (
                          <>
                            <span>•</span>
                            <span className="text-blue-400 flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {t.location}
                            </span>
                          </>
                        )}
                        {t.costCode && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400 font-mono text-[10px]">{t.costCode}</span>
                          </>
                        )}
                      </div>

                      {/* Subtasks Progress */}
                      {t.subtasks && t.subtasks.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#131D31]">
                          <div className="flex-1 h-1 bg-[#141F33] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all"
                              style={{ 
                                width: `${(t.subtasks.filter(st => st.completed).length / t.subtasks.length) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {t.subtasks.filter(st => st.completed).length}/{t.subtasks.length} Subtasks
                          </span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 4. Today's Site Schedule & Inspection Timeline ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Today's Schedule</h3>
          </div>
          <button 
            onClick={onOpenSchedule}
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {scheduleTimeline.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex items-center justify-between gap-3 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.project}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[11px] font-bold text-amber-400">{item.time}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-300 border border-blue-500/20">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Assigned Projects Quick Access ── */}
      {projects && projects.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Assigned Projects</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">{projects.length} Active Sites</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject && onSelectProject(proj)}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#050A14] border border-[#131D31] flex-shrink-0">
                    <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300">{proj.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {proj.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{proj.progress}%</span>
                    <p className="text-[9px] text-slate-400">Progress</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. Live Job Site Camera & Photos Stream ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Live Site Camera Stream</span>
          </div>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>CAM 1 · LIVE</span>
          </span>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#050A14] border border-[#131D31] group shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
            alt="Live Site Stream"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3 flex flex-col justify-between">
            <div className="text-xs font-bold text-white drop-shadow">Riverside West Wing Pour</div>
            <div className="flex items-center justify-between text-[11px] text-slate-200">
              <span>24 Workers Active</span>
              <span className="text-emerald-400 font-bold">100% Inspection Passed</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
