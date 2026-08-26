import React, { useState } from 'react';
import { Project, Task, PunchItem, SitePhoto, DocumentItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, CheckSquare, ArrowRight, TrendingUp, AlertCircle, 
  CalendarDays, DollarSign, Users, ChevronRight, FileText,
  Layers, Plus, Sparkles, Clock, CheckCircle2, ShieldAlert,
  Calendar, Check, Circle, RefreshCw
} from 'lucide-react';
import { AddTasksTemplateModal } from '../modals/AddTasksTemplateModal';

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

  // Build Order Checklist State
  const [buildTasks, setBuildTasks] = useState<BuildOrderTask[]>(DEFAULT_BUILD_ORDER);

  // Dynamic progress calculation based on completed tasks
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
    <div className="w-full flex flex-col gap-3.5 pt-2 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Hero Image Container */}
      <div className="h-44 w-full relative rounded-2xl overflow-hidden border border-[#142036] shadow-md group">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/40 to-transparent" />
        
        {/* Floating Top Header Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-xs font-semibold text-white bg-[#060913]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#3875F6]" />
            <span>{project.cityState}</span>
          </span>
          <StatusBadge status={project.status} size="xs" />
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 z-10">
          <h2 className="text-base font-bold text-white tracking-tight truncate drop-shadow-sm">
            {project.name}
          </h2>
          <div className="flex items-center justify-between text-xs text-slate-300 mt-1 font-medium">
            <span>PM: {project.projectManager.name}</span>
            <span className="text-blue-400 font-bold">{dynamicBuildPct}% built</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Stage Bar */}
      <div className="p-3 bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Lifecycle Stage</span>
          <span className="text-xs font-bold text-blue-400">{currentStage}</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {stages.map((stage, idx) => {
            const isActive = currentStage === stage;
            const isPassed = stages.indexOf(currentStage) >= idx;
            return (
              <button
                key={stage}
                onClick={() => setCurrentStage(stage)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer text-center truncate ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                    : isPassed
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/30'
                    : 'bg-[#050811] text-slate-500 border border-[#142036]'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Timeline / Duration Setter */}
      <div className="p-3.5 bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Project Schedule</span>
          <div className="flex items-center gap-2 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-white">{projectedStart}</span>
            <span className="text-[11px] text-slate-400 font-medium">({duration})</span>
          </div>
        </div>

        <button
          onClick={() => setIsTimelineModalOpen(true)}
          className="px-3 h-8 rounded-xl bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-blue-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          Set
        </button>
      </div>

      {/* 4. Budget Metric Summary */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Project Financials</h3>
              <p className="text-[10px] text-slate-400 font-medium">Total: ${totalM}M</p>
            </div>
          </div>
          <button
            onClick={() => onTabChange('budget')}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>CSI Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-full bg-[#050811] h-2 rounded-full overflow-hidden border border-[#142036]">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1 text-xs font-medium border-t border-[#121B2D]">
          <span className="text-slate-400">
            Spent: <strong className="text-white font-bold">${actualM}M ({project.progress}%)</strong>
          </span>
          <span className="text-emerald-400 font-bold">
            Remaining: ${remainingM}M
          </span>
        </div>
      </div>

      {/* 5. LIVE BUILD ORDER CHECKLIST (71 Tasks with Live Status Cycling) */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Construction Build Order</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {completedBuildTasks} of {buildTasks.length} tasks completed ({dynamicBuildPct}%)
            </p>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            + Add Tasks
          </button>
        </div>

        {/* Categories Grouping: Engineering, Pre-Con, Concrete */}
        {(['Engineering', 'Pre-Con', 'Concrete'] as const).map(phase => {
          const phaseTasks = buildTasks.filter(t => t.phase === phase);
          const doneCount = phaseTasks.filter(t => t.status === 'done').length;

          return (
            <div key={phase} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{phase}</span>
                <span className="text-[10px] font-bold text-blue-400 bg-[#050811] px-2 py-0.5 rounded-full border border-[#142036]">
                  {doneCount}/{phaseTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {phaseTasks.map(task => {
                  const isDone = task.status === 'done';
                  const isInProgress = task.status === 'in-progress';

                  return (
                    <div
                      key={task.id}
                      onClick={() => cycleTaskStatus(task.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none active:scale-[0.99] ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                          : isInProgress
                          ? 'bg-blue-950/20 border-blue-500/40 text-slate-200'
                          : 'bg-[#050811] border-[#142036] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-emerald-500 text-black' : isInProgress ? 'bg-blue-500 text-white' : 'border border-slate-600'
                        }`}>
                          {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          {isInProgress && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </div>
                        <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </span>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isInProgress
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. CHANGE ORDERS SECTION */}
      <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Change Orders</h4>
              <p className="text-[10px] text-slate-400 font-medium">{changeOrders.length} Logged Adjustments</p>
            </div>
          </div>

          <button
            onClick={() => setIsChangeOrderModalOpen(true)}
            className="h-7 px-2.5 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-blue-400 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>New CO</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-1">
          <div className="p-2 bg-[#050811] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">Pending</span>
            <span className="text-xs font-bold text-amber-400 mt-0.5 block">
              ${changeOrders.filter(c => c.status === 'Pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </span>
          </div>

          <div className="p-2 bg-[#050811] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">Approved</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
              ${approvedCoAmount.toLocaleString()}
            </span>
          </div>

          <div className="p-2 bg-[#050811] rounded-xl border border-[#142036]">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">Time Added</span>
            <span className="text-xs font-bold text-blue-400 mt-0.5 block">
              +{changeOrders.reduce((a, b) => a + b.days, 0)} Days
            </span>
          </div>
        </div>
      </div>

      {/* 7. Quick Jump Cards (Schedule, Punch List, PlanGrid) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div 
          onClick={() => onTabChange('schedule')}
          className="p-3 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex flex-col justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-base font-bold text-white leading-tight">Master Gantt</span>
          <span className="text-xs text-slate-400 mt-1 font-medium">Timeline Schedule</span>
        </div>

        <div 
          onClick={() => onTabChange('punch')}
          className="p-3 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex flex-col justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-base font-bold text-white leading-tight">
            {punchItems.length} Punch Items
          </span>
          <span className="text-xs text-slate-400 mt-1 font-medium">Quality & QC</span>
        </div>
      </div>

      {/* TIMELINE SET MODAL */}
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
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>9 months</option>
                  <option>12 months</option>
                  <option>18 months</option>
                </select>
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

      {/* ADD TASKS TEMPLATE MODAL */}
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

      {/* NEW CHANGE ORDER MODAL */}
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
