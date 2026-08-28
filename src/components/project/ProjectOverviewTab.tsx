import React, { useState, useMemo } from 'react';
import { Project, Task, SitePhoto, DocumentItem, PunchItem, ProjectStatus, ChangeOrder } from '../../types';
import { 
  MapPin, Calendar, CheckSquare, Camera, FileText, 
  AlertCircle, Check, ChevronDown, ChevronRight, Plus, 
  Coins, Activity, FilePlus2, User
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectOverviewTabProps {
  project: Project;
  tasks: Task[];
  photos?: SitePhoto[];
  documents?: DocumentItem[];
  punchItems: PunchItem[];
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onCreateTask?: () => void;
  onCreatePunch?: () => void;
  onUpdateStatus?: (newStatus: ProjectStatus) => void;
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: any) => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks,
  photos = [],
  documents = [],
  punchItems = [],
  onSelectTab,
  onNavigate,
  changeOrders = [],
  onCreateChangeOrder,
  onUpdateTaskStatus
}) => {
  const projectCOs = useMemo(() => {
    return (changeOrders || []).filter(co => co.projectId === project.id);
  }, [changeOrders, project.id]);

  const pendingCOValue = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Pending').reduce((sum, co) => sum + co.amount, 0);
  }, [projectCOs]);

  const approvedCOValue = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Approved').reduce((sum, co) => sum + co.amount, 0);
  }, [projectCOs]);

  const approvedTimeAdded = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Approved').reduce((sum, co) => sum + co.timeImpact, 0);
  }, [projectCOs]);
  const handleTabChange = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPunchCount = punchItems.filter(p => p.status === 'Open').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;

  // Track expanded state for Task Phases
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'Structural Framing': true,
    'MEP Rough-in': false,
    'Site Logistics & Safety': false
  });

  // Master Code verification state
  const [verifyingTask, setVerifyingTask] = useState<Task | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleToggleTask = (task: Task) => {
    if (task.status === 'Completed') {
      if (onUpdateTaskStatus) {
        onUpdateTaskStatus(task.id, 'In Progress');
      }
    } else {
      setVerifyingTask(task);
      setEnteredCode('');
      setCodeError('');
    }
  };

  const handleVerifyMasterCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingTask) return;

    const correctCode = project.masterCode || '1234';
    if (enteredCode === correctCode) {
      if (onUpdateTaskStatus) {
        onUpdateTaskStatus(verifyingTask.id, 'Completed');
      }
      setVerifyingTask(null);
    } else {
      setCodeError('Incorrect Master Code. Unlock failed.');
    }
  };

  const togglePhase = (phaseName: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseName]: !prev[phaseName]
    }));
  };

  // Group tasks by Phase/Category
  const tasksByPhase = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const phase = task.milestone || 'Pre-Construction';
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(task);
    return acc;
  }, {});

  // Project Stage Index mapping
  const stageOrder: Partial<Record<ProjectStatus, number>> = {
    'Planning': 0,
    'Pre-Construction': 1,
    'In Progress': 2,
    'Completed': 3
  };
  
  const currentIdx = stageOrder[project.status] !== undefined ? stageOrder[project.status]! : 0;
  const stages: ProjectStatus[] = ['Planning', 'Pre-Construction', 'In Progress', 'Completed'];

  return (
    <div className="w-full flex flex-col gap-3 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HERO PROJECT BANNER CARD ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1A263E] bg-[#070D1A] shadow-md group">
        {/* Cover Image with gradient overlay */}
        <div className="h-44 w-full relative">
          <img
            src={project.coverImage || project.thumbnail || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'}
            alt={project.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/50 to-transparent" />
          
          {/* Top Status & Code Badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-200 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
              {project.code}
            </span>
            <StatusBadge status={project.status} size="sm" />
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-md truncate">
                {project.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">{project.location || project.cityState}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Meta Info Sub-header */}
        <div className="px-3 py-2 bg-[#070D1A] border-t border-[#142036] flex items-center justify-between text-[11px] text-slate-400">
          <span>GC Owner: <strong className="text-white font-bold">Sazzad</strong></span>
          <span className="text-slate-500">•</span>
          <span>Target End: <strong className="text-white font-bold">{project.targetEndDate || 'Jun 2026'}</strong></span>
        </div>
      </div>

      {/* ─── 2. TOP 3 KPI METRIC CARDS ─── */}
      <div className="grid grid-cols-3 gap-2">
        {/* Progress Card */}
        <div className="p-2.5 rounded-xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Progress</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-white">{project.progress}%</span>
            <div className="w-full bg-[#050811] h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="p-2.5 rounded-xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <CheckSquare className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Tasks</span>
          </div>
          <div className="mt-1 flex flex-col">
            <span className="text-base font-black text-white">{completedTasksCount}/{tasks.length || 71}</span>
            <span className="text-[9px] text-slate-400 font-medium">completed</span>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="p-2.5 rounded-xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Timeline</span>
          </div>
          <div className="mt-1 flex flex-col leading-tight">
            <span className="text-xs font-bold text-white truncate">Oct 15</span>
            <span className="text-[9px] text-slate-400 truncate">→ Apr 2027</span>
          </div>
        </div>
      </div>

      {/* ─── 3. PROJECT STAGE (LIFECYCLE STEPPER) ─── */}
      <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Project Stage
          </span>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Stage {currentIdx + 1} of 4
          </span>
        </div>

        <div className="relative flex items-center justify-between pt-1 pb-0.5 px-2">
          {/* Track Bar Background */}
          <div className="absolute top-[16px] left-6 right-6 h-0.5 bg-[#142036] z-0" />
          
          {/* Active Fill Track */}
          <div 
            className="absolute top-[16px] left-6 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 z-0 transition-all duration-500" 
            style={{ 
              width: currentIdx === 0 ? '0%' : currentIdx === 1 ? '33%' : currentIdx === 2 ? '66%' : '100%' 
            }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;

            return (
              <div
                key={stage}
                className="flex flex-col items-center gap-1 z-10 select-none"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm ring-3 ring-[#0A111F]'
                    : isActive
                    ? 'bg-blue-600 text-white ring-3 ring-blue-500/30 shadow-md font-bold'
                    : 'bg-[#070D1A] border border-[#142036] text-slate-500 ring-3 ring-[#0A111F]'
                }`}>
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                <span className={`text-[11px] font-bold leading-tight ${
                  isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {stage === 'Pre-Construction' ? 'Pre-Con' : stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 4. QUICK LINKS / NAVIGATION SHORTCUTS (UX Optimized & Redesigned) ─── */}
      <div className="grid grid-cols-3 gap-2 bg-[#0A111F] p-3 rounded-2xl border border-[#142036] shadow-sm">
        <button 
          onClick={() => handleTabChange('photos')}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer"
        >
          <Camera className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] font-bold text-white leading-tight">Photos</span>
          <span className="text-[9px] text-slate-500 font-medium">({photos.length})</span>
        </button>

        <button 
          onClick={() => handleTabChange('documents')}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-purple-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer"
        >
          <FileText className="w-5 h-5 text-purple-400" />
          <span className="text-[10px] font-bold text-white leading-tight">Documents</span>
          <span className="text-[9px] text-slate-500 font-medium">({documents.length})</span>
        </button>

        <button 
          onClick={() => handleTabChange('punch')}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-rose-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer"
        >
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] font-bold text-white leading-tight">Punch List</span>
          <span className="text-[9px] text-rose-400 font-extrabold bg-rose-500/10 px-1.5 py-0.2 rounded-full">
            {punchItems.filter(p => p.status === 'Open').length}
          </span>
        </button>
      </div>

      {/* ─── 5. FINANCIAL CONTROL BLOCK (Budget + Change Orders Grouped) ─── */}
      <div className="flex flex-col gap-2.5">
        {/* Budget Strip */}
        {project.budget.total > 0 ? (
          <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Master CSI Budget</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 mt-0.5">
              <p className="text-[11px] text-slate-400 leading-normal flex-1">
                CSI 16-Division Master Ledger (${(project.budget.total / 1000000).toFixed(2)}M) is active.
              </p>
              <button 
                onClick={() => handleTabChange('budget')}
                className="text-xs font-bold text-slate-300 hover:text-white bg-[#070D1A] border border-[#142036] px-3.5 py-1.5 rounded-xl hover:border-slate-600 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
              >
                View Ledger
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Project Budget</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 mt-0.5">
              <p className="text-[11px] text-slate-400 leading-normal flex-1">
                No budget spreadsheet imported for this project yet.
              </p>
              <button 
                onClick={() => handleTabChange('budget')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3.5 py-1.5 rounded-xl border border-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
              >
                Import Budget
              </button>
            </div>
          </div>
        )}

        {/* Change Orders Card */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FilePlus2 className="w-3.5 h-3.5 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Change Orders</h3>
            </div>
            <button 
              onClick={onCreateChangeOrder}
              className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>New</span>
            </button>
          </div>

          {/* Change Order Stats Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#070D1A] p-2 rounded-xl border border-[#142036] text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Pending</span>
              <span className="font-bold text-white text-xs mt-0.5 block">${pendingCOValue.toLocaleString()}</span>
            </div>
            <div className="border-x border-[#142036]">
              <span className="text-[10px] text-slate-400 block font-medium">Approved</span>
              <span className="font-bold text-emerald-400 text-xs mt-0.5 block">${approvedCOValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Time Added</span>
              <span className="font-bold text-blue-400 text-xs mt-0.5 block">{approvedTimeAdded}d</span>
            </div>
          </div>

          {/* Change Order List */}
          {projectCOs.length === 0 ? (
            <p className="text-center text-[11px] text-slate-500 py-1 font-medium italic">
              No change orders yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              {projectCOs.map((co) => (
                <div key={co.id} className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between text-xs transition-colors animate-fade-in">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h4 className="font-bold text-white leading-tight truncate max-w-[200px]">{co.title}</h4>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold">
                      <span className="bg-[#142036] px-1.5 py-0.2 rounded text-[8px] text-blue-300 font-bold uppercase tracking-wider">{co.category}</span>
                      <span>•</span>
                      <span>By: {co.requestedBy}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-black text-white">${co.amount.toLocaleString()}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 font-medium">
                        {co.timeImpact > 0 ? `+${co.timeImpact}d` : 'no delay'}
                      </span>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        co.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : co.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {co.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 6. TASKS SECTION (Directly in Overview!) ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tasks & Checklists</h3>
            <span className="text-[10px] text-slate-400 font-medium">({completedTasksCount} done)</span>
          </div>
          <button 
            onClick={() => handleTabChange('tasks')}
            className="text-[11px] text-blue-400 font-bold hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Phase Accordions */}
        <div className="flex flex-col gap-2">
          {Object.entries(tasksByPhase).slice(0, 3).map(([phaseName, phaseTasks]) => {
            const isExpanded = !!expandedPhases[phaseName];
            const phaseDone = phaseTasks.filter(t => t.status === 'Completed').length;

            return (
              <div key={phaseName} className="border border-[#142036] rounded-xl overflow-hidden bg-[#070D1A]">
                {/* Header click */}
                <button 
                  onClick={() => togglePhase(phaseName)}
                  className="w-full px-3 py-2 bg-[#09101E] hover:bg-[#0E1A32] flex items-center justify-between text-xs text-slate-200 font-bold border-b border-[#142036] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{phaseName}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">({phaseDone}/{phaseTasks.length})</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                {/* Task Checklist Rows */}
                {isExpanded && (
                  <div className="p-1.5 flex flex-col gap-1">
                    {phaseTasks.map((task) => {
                      const isTaskDone = task.status === 'Completed';
                      return (
                        <div key={task.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <div 
                              onClick={() => handleToggleTask(task)}
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 cursor-pointer transition-all active:scale-[0.88] ${
                                isTaskDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#2D3E5D] hover:border-blue-400'
                              }`}
                            >
                              {isTaskDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className={`truncate font-medium ${isTaskDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                              {task.title}
                            </span>
                          </div>
                          
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isTaskDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {isTaskDone ? 'done' : 'todo'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 7. STATIC PROJECT DETAILS / SPECIFICATIONS ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Project Specification</h3>
        
        <div className="grid grid-cols-2 gap-3.5 mt-0.5">
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Address</span>
              <span className="font-medium text-white text-[11px] break-words">{project.location || '1235 Cordova Blvd NE'}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{project.cityState}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <User className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Lead PM</span>
              <span className="font-medium text-white text-[11px]">{project.projectManager.name}</span>
              <span className="text-[9px] text-slate-400 block">GC Owner: Sazzad</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <Calendar className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Start Date</span>
              <span className="font-medium text-white text-[11px]">{project.startDate || 'Jan 10, 2025'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Target End</span>
              <span className="font-medium text-white text-[11px]">{project.targetEndDate || 'Jun 30, 2026'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 8. MOCK 3D/2D SITE CONSTRUCT VISUALIZER (Moved to bottom as aesthetic accent) ─── */}
      <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span>Site Blueprint Viewport</span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            7% built
          </span>
        </div>
        
        {/* Isometric Blueprint Grid */}
        <div className="h-28 w-full bg-[#050811] rounded-xl border border-[#142036] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />

          {/* Blueprint Construction Mock Drawing */}
          <svg className="w-24 h-24 text-blue-500/40 relative z-10" viewBox="0 0 100 100" fill="none">
            <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="25" y1="80" x2="25" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="75" y1="80" x2="75" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="30" y="40" width="40" height="40" stroke="currentColor" strokeWidth="1.5" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="40" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
            <path d="M75,80 L75,20 L65,15 M75,25 L90,25" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          {/* Indicator text */}
          <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono">
            Phase 1: Cleared Lot
          </div>
        </div>
      </div>

      {/* ─── MASTER CODE UNLOCK MODAL ─── */}
      {verifyingTask && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[340px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div className="flex items-center gap-1.5 text-blue-400">
                <CheckSquare className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Security Unlock</h3>
              </div>
              <button
                onClick={() => setVerifyingTask(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyMasterCode} className="flex flex-col gap-3 text-xs text-center">
              <p className="text-slate-350 text-[11px] leading-relaxed">
                Please enter the 4-digit **Project Master Code** to mark this task as completed.
              </p>

              <div className="flex flex-col items-center gap-2">
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="• • • •"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value.replace(/\D/g, ''));
                    setCodeError('');
                  }}
                  className="w-32 h-10 bg-[#050811] border border-[#142036] rounded-xl text-center text-white text-lg font-black tracking-widest outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 italic">Required to unlock completed tasks.</span>
              </div>

              {codeError && (
                <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 py-1 px-2 rounded-lg font-bold animate-pulse">
                  {codeError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setVerifyingTask(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0E1A33] text-slate-350 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
