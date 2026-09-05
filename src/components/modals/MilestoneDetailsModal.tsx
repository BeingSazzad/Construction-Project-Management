import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../../types';
import { 
  X, CheckSquare, DollarSign, Clock, 
  ShieldCheck, Users, Check, Plus
} from 'lucide-react';

export interface MilestoneItem {
  id: string;
  name: string;
  code?: string;
  subcontractor: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  budgetAllocation?: number;
  inspectionPassed?: boolean;
  tasksCount?: { completed: number; total: number };
}

interface MilestoneDetailsModalProps {
  milestone: MilestoneItem | null;
  projectName?: string;
  projectTasks?: Task[];
  onClose: () => void;
  onUpdateStatus?: (milestoneId: string, status: 'Completed' | 'In Progress' | 'Upcoming') => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTask?: (task: Partial<Task>) => void;
  onRequestDraw?: (milestone: MilestoneItem) => void;
}

export const MilestoneDetailsModal: React.FC<MilestoneDetailsModalProps> = ({
  milestone,
  projectName = 'Riverside Office Complex',
  projectTasks = [],
  onClose,
  onUpdateStatus,
  onUpdateTaskStatus,
  onAddTask,
  onRequestDraw
}) => {
  if (!milestone) return null;

  // Filter real project tasks matching this milestone, or use default template checklist
  const linkedTasks = useMemo(() => {
    const matching = projectTasks.filter(t => 
      t.milestone === milestone.name || 
      (milestone.code && t.milestone?.includes(milestone.code)) ||
      (milestone.name.toLowerCase().includes('foundation') && t.milestone?.toLowerCase().includes('foundation')) ||
      (milestone.name.toLowerCase().includes('framing') && t.milestone?.toLowerCase().includes('framing')) ||
      (milestone.name.toLowerCase().includes('excavation') && t.milestone?.toLowerCase().includes('prep')) ||
      (milestone.name.toLowerCase().includes('mep') && t.milestone?.toLowerCase().includes('mep'))
    );

    if (matching.length > 0) {
      return matching.map(t => ({
        id: t.id,
        title: t.title,
        completed: t.status === 'Completed',
        assignee: t.assignee?.name || milestone.subcontractor,
        isRealTask: true
      }));
    }

    // Default template tasks for this milestone if no tasks tagged yet
    return [
      { id: `${milestone.id}-st-1`, title: 'Engineering Drawings & Subcontractor Sign-off', completed: milestone.progress >= 30, assignee: milestone.subcontractor, isRealTask: false },
      { id: `${milestone.id}-st-2`, title: 'Material Delivery & On-Site Staging Inspection', completed: milestone.progress >= 50, assignee: 'Site Superintendent', isRealTask: false },
      { id: `${milestone.id}-st-3`, title: 'Trade Execution & Construction Installation', completed: milestone.progress >= 75, assignee: milestone.subcontractor, isRealTask: false },
      { id: `${milestone.id}-st-4`, title: 'Municipal QA / City Building Inspector Approval', completed: milestone.status === 'Completed', assignee: 'City Inspector', isRealTask: false },
    ];
  }, [projectTasks, milestone]);

  const [localTasks, setLocalTasks] = useState(linkedTasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const toggleSubtask = (id: string, isRealTask: boolean, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;
    
    // Update local modal state
    setLocalTasks(prev => prev.map(st => st.id === id ? { ...st, completed: nextCompleted } : st));

    // If it's a real project task, update the app store
    if (isRealTask && onUpdateTaskStatus) {
      onUpdateTaskStatus(id, nextCompleted ? 'Completed' : 'In Progress');
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newTaskTitle = newSubtaskTitle.trim();
    const newTaskId = `task-${Date.now()}`;

    // Add to local state
    setLocalTasks(prev => [
      ...prev,
      {
        id: newTaskId,
        title: newTaskTitle,
        completed: false,
        assignee: milestone.subcontractor,
        isRealTask: true
      }
    ]);

    // Push into real app store if handler provided
    if (onAddTask) {
      onAddTask({
        id: newTaskId,
        title: newTaskTitle,
        status: 'In Progress',
        priority: 'Medium',
        milestone: milestone.name,
        assignee: {
          id: 'sub-trade',
          name: milestone.subcontractor,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          role: 'Trade Lead'
        },
        subtasks: [],
        attachmentsCount: 0,
        notesCount: 0
      });
    }

    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const completedTasksCount = localTasks.filter(s => s.completed).length;
  const computedProgress = localTasks.length > 0 ? Math.round((completedTasksCount / localTasks.length) * 100) : milestone.progress;
  const isFullyComplete = computedProgress === 100 || milestone.status === 'Completed';

  const budgetValue = milestone.budgetAllocation || 450000;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[460px] bg-white border border-[#DDE1E7] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#171A1F]">
        
        {/* ─── 1. MODAL HEADER ─── */}
        <div className="p-4 bg-white border-b border-[#EAEDF1] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#1677FF] font-mono uppercase tracking-wider bg-[#EAF3FF] px-1.5 py-0.2 rounded">
                  {milestone.code || 'MILESTONE GATE'}
                </span>
                <span className="text-[11px] text-[#68707C] truncate">· {projectName}</span>
              </div>
              <h2 className="text-sm font-black text-[#171A1F] truncate tracking-tight mt-0.5">
                {milestone.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors flex-shrink-0 active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── 2. MODAL SCROLLABLE BODY ─── */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {/* Status & Progress Summary Card */}
          <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isFullyComplete 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/20'
              }`}>
                {isFullyComplete ? 'Completed Gate' : 'In Progress'}
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#171A1F] tabular-nums">{computedProgress}%</span>
                <span className="text-[11px] text-[#68707C] ml-1 font-semibold">({completedTasksCount}/{localTasks.length} tasks done)</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#EAEDF1] overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isFullyComplete
                    ? 'bg-emerald-500'
                    : 'bg-[#1677FF]'
                }`}
                style={{ width: `${computedProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#68707C] font-medium pt-0.5">
              <span>{milestone.dates}</span>
              <span className="text-[#171A1F] font-bold">{milestone.duration}</span>
            </div>
          </div>

          {/* Key Metrics Grid (2x2) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Draw Allocation Value */}
            <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Draw Allocation</span>
              </div>
              <div className="text-base font-black text-[#171A1F] tracking-tight mt-1 tabular-nums">
                ${(budgetValue / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-[#68707C] font-medium">Lender Draw Gate</div>
            </div>

            {/* Lead Subcontractor */}
            <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#1677FF] text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Lead Subcontractor</span>
              </div>
              <div className="text-xs font-bold text-[#171A1F] truncate mt-1">
                {milestone.subcontractor}
              </div>
              <div className="text-[10px] text-[#68707C] font-medium">Trade Partner Lead</div>
            </div>

            {/* Inspection Status */}
            <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-purple-700 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>City Inspection</span>
              </div>
              <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${
                isFullyComplete ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isFullyComplete ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span>{isFullyComplete ? 'Passed & Approved' : 'Pending Verification'}</span>
              </div>
              <div className="text-[10px] text-[#68707C] font-medium">Building Dept Signoff</div>
            </div>

            {/* Connected Tasks Count */}
            <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Linked Tasks</span>
              </div>
              <div className="text-base font-black text-[#171A1F] tracking-tight mt-1 tabular-nums">
                {completedTasksCount} / {localTasks.length}
              </div>
              <div className="text-[10px] text-[#68707C] font-medium">Field Work Items</div>
            </div>
          </div>

          {/* Sub-activities / Connected Tasks Interactive Checklist */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#171A1F] tracking-tight">Milestone Field Tasks ({localTasks.length})</h3>
                <p className="text-[10px] text-[#68707C]">Complete all tasks to unlock bank draw</p>
              </div>
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="text-[11px] font-bold text-[#1677FF] hover:text-[#0958D9] flex items-center gap-1 cursor-pointer bg-[#EAF3FF] px-2.5 py-1 rounded-lg border border-[#1677FF]/20"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {isAddingSubtask && (
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 p-2 bg-[#F7F8FA] border border-[#EAEDF1] rounded-2xl animate-fade-in">
                <input
                  type="text"
                  placeholder="Enter task name for this milestone..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 h-9 bg-white px-3 text-xs text-[#171A1F] outline-none rounded-xl border border-[#DDE1E7] placeholder-[#9DA5B1] focus:border-[#1677FF]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  Save
                </button>
              </form>
            )}

            <div className="flex flex-col gap-2">
              {localTasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id, st.isRealTask, st.completed)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                    st.completed
                      ? 'bg-[#F7F8FA] border-[#EAEDF1] opacity-75'
                      : 'bg-white border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-xs'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    st.completed ? 'bg-emerald-500 text-white shadow-xs' : 'border border-[#DDE1E7] bg-white'
                  }`}>
                    {st.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold leading-snug ${st.completed ? 'line-through text-[#68707C]' : 'text-[#171A1F]'}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-[#68707C] mt-0.5">Assigned to: {st.assignee}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    st.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F2F2F7] text-[#68707C]'
                  }`}>
                    {st.completed ? 'Done' : 'To-Do'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Documentation Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#171A1F] tracking-tight">Milestone Inspection Proof</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-2xl overflow-hidden border border-[#DDE1E7] group h-24">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80" 
                  alt="Site Pour Proof" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-bold text-white truncate">Field QA Sign-off</span>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#DDE1E7] group h-24">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80" 
                  alt="Site Signoff" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-bold text-white truncate">Building Dept Permit</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── 3. MODAL FOOTER ACTIONS ─── */}
        <div className="p-4 bg-white border-t border-[#EAEDF1] flex items-center gap-2">
          {!isFullyComplete ? (
            <button
              onClick={() => {
                if (onUpdateStatus) onUpdateStatus(milestone.id, 'Completed');
                onClose();
              }}
              className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark Gate Completed (100%)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onRequestDraw) onRequestDraw(milestone);
                onClose();
              }}
              className="flex-1 h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Draw (${(budgetValue / 1000).toFixed(0)}k)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 h-11 rounded-2xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
