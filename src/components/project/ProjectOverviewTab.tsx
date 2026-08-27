import React, { useState } from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, CheckSquare, ArrowRight, TrendingUp, AlertCircle, 
  CalendarDays, DollarSign, Users, ChevronRight, FileText,
  Layers, Plus, Sparkles, Clock, CheckCircle2, ShieldAlert,
  Calendar, Check, Circle, ChevronDown, ChevronUp, Camera,
  Briefcase
} from 'lucide-react';
import { AddTasksTemplateModal } from '../modals/AddTasksTemplateModal';
import { CustomSelect } from '../common/CustomSelect';

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
}

interface BuildOrderTask {
  id: string;
  phase: 'Engineering' | 'Pre-Con' | 'Concrete' | 'Framing' | 'MEP';
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

const DEFAULT_BUILD_ORDER: BuildOrderTask[] = [
  { id: 'eng-1', phase: 'Engineering', title: 'Geotechnical soil report & foundation design', status: 'done' },
  { id: 'eng-2', phase: 'Engineering', title: 'Structural wind & seismic calculations', status: 'done' },
  { id: 'eng-3', phase: 'Engineering', title: 'Civil grading & stormwater drainage plan', status: 'done' },
  { id: 'eng-4', phase: 'Engineering', title: 'Architectural permit drawing review', status: 'done' },
  { id: 'eng-5', phase: 'Engineering', title: 'MEP utility load calculations & coordination', status: 'done' },
  { id: 'pc-1', phase: 'Pre-Con', title: 'Municipal building permit submission', status: 'in-progress' },
  { id: 'pc-2', phase: 'Pre-Con', title: 'Subcontractor trade buyout & executed contracts', status: 'todo' },
  { id: 'pc-3', phase: 'Pre-Con', title: 'Site erosion control & silt fence installation', status: 'todo' },
  { id: 'pc-4', phase: 'Pre-Con', title: 'Temporary power pole & water utility drop', status: 'todo' },
  { id: 'pc-5', phase: 'Pre-Con', title: 'Jobsite security perimeter fencing & signage', status: 'todo' },
  { id: 'pc-6', phase: 'Pre-Con', title: 'Pre-construction safety & subcontractor kickoff', status: 'todo' },
  { id: 'con-1', phase: 'Concrete', title: 'Footing excavation & subgrade compaction', status: 'todo' },
  { id: 'con-2', phase: 'Concrete', title: 'Rebar reinforcement placement & inspection', status: 'todo' },
  { id: 'con-3', phase: 'Concrete', title: 'Slab-on-grade concrete pour & curing', status: 'todo' }
];

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks,
  punchItems,
  photos,
  documents,
  onTabChange,
  onOpenTask,
  onOpenPunch,
  onOpenLatti,
  onAddTasksFromTemplate
}) => {
  const [currentStage, setCurrentStage] = useState<'Planning' | 'Pre-Con' | 'In Progress' | 'Completed'>(
    project.status === 'Planning' ? 'Planning' : 'In Progress'
  );
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isChangeOrderModalOpen, setIsChangeOrderModalOpen] = useState(false);
  const [isBuildOrderExpanded, setIsBuildOrderExpanded] = useState(false);
  
  // Timeline State
  const [projectedStart, setProjectedStart] = useState(project.startDate || '2025-06-01');
  const [duration, setDuration] = useState('6 months');

  // Change Orders State
  const [changeOrders, setChangeOrders] = useState([
    { id: 'co-1', title: 'Level 12 Core Wall Rebar Upgrade', amount: 35000, days: 4, status: 'Approved' }
  ]);
  const [newCoTitle, setNewCoTitle] = useState('');
  const [newCoAmount, setNewCoAmount] = useState('25000');
  const [newCoDays, setNewCoDays] = useState('3');

  const [activePhaseTab, setActivePhaseTab] = useState<'All' | 'Engineering' | 'Pre-Con' | 'Concrete'>('All');

  // Build Order Checklist State
  const [buildTasks, setBuildTasks] = useState<BuildOrderTask[]>(DEFAULT_BUILD_ORDER);

  // Filter tasks based on active phase tab
  const displayedPhases = activePhaseTab === 'All' 
    ? (['Engineering', 'Pre-Con', 'Concrete'] as const)
    : ([activePhaseTab] as const);

  const completedBuildTasks = buildTasks.filter(t => t.status === 'done').length;
  const dynamicBuildPct = Math.round((completedBuildTasks / buildTasks.length) * 100);

  const actualM = (project.budget.actual / 1000000).toFixed(2);
  const totalM = (project.budget.total / 1000000).toFixed(2);
  const remainingM = ((project.budget.total - project.budget.actual) / 1000000).toFixed(2);

  const approvedCoAmount = changeOrders
    .filter(c => c.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const stages = ['Planning', 'Pre-Con', 'In Progress', 'Completed'] as const;

  const cycleTaskStatus = (taskId: string) => {
    setBuildTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleCreateChangeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoTitle.trim()) return;
    setChangeOrders([
      ...changeOrders,
      {
        id: `co-${Date.now()}`,
        title: newCoTitle,
        amount: parseFloat(newCoAmount) || 0,
        days: parseInt(newCoDays) || 0,
        status: 'Pending'
      }
    ]);
    setNewCoTitle('');
    setIsChangeOrderModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-3.5 pt-1 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HERO BANNER (Card-less & Sleek) ─── */}
      <div className="h-40 w-full relative rounded-2xl overflow-hidden border border-[#142036] shadow-md group">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/50 to-transparent" />
        
        {/* Floating Top Header Badges */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-[11px] font-semibold text-white bg-[#060913]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3 h-3 text-[#3875F6]" />
            <span>{project.cityState}</span>
          </span>
          <StatusBadge status={project.status} size="xs" />
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <h2 className="text-sm font-bold text-white tracking-tight truncate drop-shadow-sm">
            {project.name}
          </h2>
          <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5 font-medium">
            <span>PM: {project.projectManager.name}</span>
            <span className="text-blue-400 font-bold">{dynamicBuildPct}% completed</span>
          </div>
        </div>
      </div>

      {/* ─── 2. CONNECTED PROJECT LIFECYCLE STEPPER ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Lifecycle Stage</span>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Current: {currentStage}
          </span>
        </div>

        {/* Connected Step Pipeline */}
        <div className="relative flex items-center justify-between pt-2 pb-1 px-2">
          {/* Background Connecting Track Line */}
          <div className="absolute top-[21px] left-6 right-6 h-0.5 bg-[#142036] z-0" />
          
          {/* Active Filled Track Line */}
          <div 
            className="absolute top-[21px] left-6 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 z-0" 
            style={{ 
              width: `${(stages.indexOf(currentStage) / (stages.length - 1)) * 88}%` 
            }}
          />

          {stages.map((stage, idx) => {
            const currentIdx = stages.indexOf(currentStage);
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;
            const isUpcoming = idx > currentIdx;

            return (
              <button
                key={stage}
                onClick={() => setCurrentStage(stage)}
                className="flex flex-col items-center gap-1.5 z-10 cursor-pointer group select-none active:scale-95 transition-transform"
              >
                {/* Node Circle */}
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

                {/* Stage Label & Subtext */}
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-bold leading-tight ${
                    isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {stage}
                  </span>
                  <span className={`text-[8px] font-medium ${isCompleted ? 'text-emerald-400/80' : isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                    {isCompleted ? 'Done' : isActive ? 'Active' : 'Pending'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. KEY VITALS STRIP (Progress, Timeline, Spend) ─── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
          <div className="mt-1">
            <span className="text-sm font-black text-white">{project.progress}%</span>
            <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1 border border-[#142036]">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Timeline</span>
            <button
              onClick={() => setIsTimelineModalOpen(true)}
              className="text-[9px] font-bold text-blue-400 hover:underline cursor-pointer"
            >
              Set
            </button>
          </div>
          <div className="mt-1">
            <span className="text-xs font-bold text-white block truncate">{projectedStart.slice(5)}</span>
            <span className="text-[10px] text-slate-400 font-medium">{duration}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Budget</span>
          <div className="mt-1">
            <span className="text-xs font-bold text-white block">${actualM}M</span>
            <span className="text-[10px] text-slate-400 font-medium">of ${totalM}M</span>
          </div>
        </div>
      </div>

      {/* ─── 4. QUICK SHORTCUTS TILES (Situational Color Accents) ─── */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onTabChange('tasks')}
          className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group active:scale-95 shadow-sm"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white">Tasks</span>
          <span className="text-[9px] text-slate-400 font-medium">{tasks?.length || 0}</span>
        </button>

        <button
          onClick={() => onTabChange('punch')}
          className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-rose-500/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group active:scale-95 shadow-sm"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white">Punch</span>
          <span className="text-[9px] text-rose-400 font-bold">{punchItems?.length || 0} defects</span>
        </button>

        <button
          onClick={() => onTabChange('photos')}
          className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-sky-500/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group active:scale-95 shadow-sm"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white">Photos</span>
          <span className="text-[9px] text-slate-400 font-medium">{photos?.length || 0}</span>
        </button>

        <button
          onClick={() => onTabChange('documents')}
          className="p-2.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group active:scale-95 shadow-sm"
        >
          <div className="w-7 h-7 rounded-lg bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white">Docs</span>
          <span className="text-[9px] text-slate-400 font-medium">{documents?.length || 0}</span>
        </button>
      </div>

      {/* ─── 5. CONSTRUCTION BUILD ORDER (Collapsible / Compact) ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Build Order Checklist</h3>
              <p className="text-[10px] text-slate-400 font-medium">
                {completedBuildTasks} of {buildTasks.length} done ({dynamicBuildPct}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-2 py-0.5 rounded-lg bg-blue-600/10 border border-blue-500/25 text-blue-400 text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
              + Template
            </button>
            <button
              onClick={() => setIsBuildOrderExpanded(!isBuildOrderExpanded)}
              className="w-7 h-7 rounded-lg bg-[#0E1726] border border-[#1A263B] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title={isBuildOrderExpanded ? 'Minimize' : 'Expand'}
            >
              {isBuildOrderExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Phase Summary Filter Strip (Interactive Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 text-[10px]">
          {(['All', 'Engineering', 'Pre-Con', 'Concrete'] as const).map(phase => {
            const isAll = phase === 'All';
            const phaseTasks = isAll ? buildTasks : buildTasks.filter(t => t.phase === phase);
            const doneCount = phaseTasks.filter(t => t.status === 'done').length;
            const isPhaseDone = doneCount === phaseTasks.length && phaseTasks.length > 0;
            const isActive = activePhaseTab === phase;

            return (
              <button
                key={phase}
                onClick={() => {
                  setActivePhaseTab(phase);
                  setIsBuildOrderExpanded(true);
                }}
                className={`px-2.5 py-1 rounded-xl border flex items-center gap-1 whitespace-nowrap font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                    : isPhaseDone
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : doneCount > 0
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20'
                    : 'bg-[#070D1A] text-slate-400 border-[#142036] hover:text-white'
                }`}
              >
                <span>{phase}</span>
                <span className="font-bold">({doneCount}/{phaseTasks.length})</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Detailed Task List */}
        {isBuildOrderExpanded && (
          <div className="pt-2 border-t border-[#142036] flex flex-col gap-2.5 animate-fade-in">
            {displayedPhases.map(phase => {
              const phaseTasks = buildTasks.filter(t => t.phase === phase);
              return (
                <div key={phase} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{phase}</span>
                    <span className="text-[9px] text-slate-500 font-medium">Tap task to cycle status</span>
                  </div>
                  {phaseTasks.map(task => {
                    const isDone = task.status === 'done';
                    const isInProgress = task.status === 'in-progress';
                    return (
                      <div
                        key={task.id}
                        onClick={() => cycleTaskStatus(task.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer active:scale-[0.99] select-none ${
                          isDone
                            ? 'bg-[#070D1A] border-[#142036] text-slate-400'
                            : isInProgress
                            ? 'bg-blue-950/25 border-blue-500/40 text-white'
                            : 'bg-[#070D1A] border-[#142036] text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isDone ? 'bg-emerald-500 text-black' : isInProgress ? 'bg-blue-500 text-white' : 'border border-slate-600'
                          }`}>
                            {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className={`text-[11px] truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                          isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isInProgress ? 'bg-blue-500/20 text-blue-300' : 'bg-[#0A1020] text-slate-500'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* ─── 6. CHANGE ORDERS (Compact Summary with + New CO) ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold text-white">Change Orders ({changeOrders.length})</h4>
          </div>
          <button
            onClick={() => setIsChangeOrderModalOpen(true)}
            className="h-6 px-2.5 rounded-lg bg-blue-600/15 border border-blue-500/25 hover:bg-blue-600 text-blue-400 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-1.5 bg-[#070D1A] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Pending</span>
            <span className="text-xs font-bold text-amber-400 block mt-0.5">
              ${changeOrders.filter(c => c.status === 'Pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </span>
          </div>

          <div className="p-1.5 bg-[#070D1A] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Approved</span>
            <span className="text-xs font-bold text-emerald-400 block mt-0.5">
              ${approvedCoAmount.toLocaleString()}
            </span>
          </div>

          <div className="p-1.5 bg-[#070D1A] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Time Added</span>
            <span className="text-xs font-bold text-blue-400 block mt-0.5">
              +{changeOrders.reduce((a, b) => a + b.days, 0)}d
            </span>
          </div>
        </div>
      </div>

      {/* ─── TIMELINE MODAL ─── */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[360px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-sm font-bold text-white">Project Timeline</h3>
              <button
                onClick={() => setIsTimelineModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Projected Start Date</label>
                <input
                  type="date"
                  value={projectedStart}
                  onChange={(e) => setProjectedStart(e.target.value)}
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Estimated Duration</label>
                <CustomSelect
                  value={duration}
                  onChange={setDuration}
                  options={['3 months', '6 months', '9 months', '12 months', '18 months']}
                  size="md"
                />
              </div>
              <button
                onClick={() => setIsTimelineModalOpen(false)}
                className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-md mt-1"
              >
                Save Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD TASKS TEMPLATE MODAL ─── */}
      <AddTasksTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        projectName={project.name}
        projectId={project.id}
        onAddTasks={(newTasks) => {
          if (onAddTasksFromTemplate) {
            onAddTasksFromTemplate(newTasks);
          }
          alert(`Successfully added ${newTasks.length} construction build-order tasks!`);
        }}
      />

      {/* ─── NEW CHANGE ORDER MODAL ─── */}
      {isChangeOrderModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-sm font-bold text-white">Create Change Order</h3>
              <button
                onClick={() => setIsChangeOrderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChangeOrder} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Scope Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Conduit Reroute"
                  value={newCoTitle}
                  onChange={(e) => setNewCoTitle(e.target.value)}
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Cost Impact ($)</label>
                  <input
                    type="number"
                    value={newCoAmount}
                    onChange={(e) => setNewCoAmount(e.target.value)}
                    className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Schedule Impact (Days)</label>
                  <input
                    type="number"
                    value={newCoDays}
                    onChange={(e) => setNewCoDays(e.target.value)}
                    className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs mt-2"
              >
                Submit Change Order
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
