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
  projectName = 'Snell Isle Residence',
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
      <div className="w-full max-w-[480px] bg-white border border-[#DDE1E7] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#171A1F]">
        
        {/* ─── 1. MODAL HEADER ─── */}
        <div className="p-4 bg-white border-b border-[#EAEDF1] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-5 h-5 text-[#1677FF]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#1677FF] font-mono uppercase tracking-wider">
                  {milestone.code || 'MILESTONE'}
                </span>
                <span className="text-xs text-[#68707C] truncate">· {projectName}</span>
              </div>
              <h2 className="text-base font-bold text-[#171A1F] truncate tracking-tight mt-0.5">
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
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          
          {/* ── Progress & Key Stats Strip (Clean, Single Surface - No Boxes) ── */}
          <div className="flex flex-col gap-3">
            {/* Status & Percent */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isFullyComplete 
                  ? 'bg-[#ECFDF5] text-[#10B981]' 
                  : 'bg-[#EAF3FF] text-[#1677FF]'
              }`}>
                {isFullyComplete ? 'Completed Gate' : 'In Progress'}
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#171A1F] tabular-nums">{computedProgress}%</span>
                <span className="text-xs text-[#68707C] ml-1 font-medium">({completedTasksCount}/{localTasks.length} tasks)</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#EAEDF1] overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isFullyComplete ? 'bg-[#10B981]' : 'bg-[#1677FF]'
                }`}
                style={{ width: `${computedProgress}%` }}
              />
            </div>

            {/* 3-Column Key Metrics (Hairline Separators, No Heavy Cards) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EAEDF1]">
              <div>
                <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Allocation</span>
                <span className="text-xs font-bold text-[#171A1F] block mt-0.5">${(budgetValue / 1000).toFixed(0)}k</span>
              </div>
              <div>
                <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Trade Lead</span>
                <span className="text-xs font-bold text-[#171A1F] block mt-0.5 truncate">{milestone.subcontractor}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Inspection</span>
                <span className={`text-xs font-bold block mt-0.5 ${isFullyComplete ? 'text-[#10B981]' : 'text-[#D97706]'}`}>
                  {isFullyComplete ? 'Passed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Sub-activities / Connected Tasks Section ── */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#171A1F] tracking-tight">Milestone Field Tasks ({localTasks.length})</h3>
                <p className="text-xs text-[#68707C]">Complete all tasks to unlock bank draw</p>
              </div>
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="text-xs font-bold text-[#1677FF] hover:text-[#0958D9] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Clean inline Add Task Input (No outer gray box) */}
            {isAddingSubtask && (
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Enter task name for this milestone..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs text-[#171A1F] bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl outline-none placeholder-[#68707C]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(false)}
                  className="h-9 px-2.5 text-xs text-[#68707C] hover:text-[#171A1F] cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Single Clean List Container with Hairline Dividers (NOT separate boxes for each task!) */}
            <div className="rounded-2xl border border-[#EAEDF1] bg-white divide-y divide-[#EAEDF1] overflow-hidden shadow-xs">
              {localTasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id, st.isRealTask, st.completed)}
                  className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer select-none"
                >
                  {/* Clean circular checkbox */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    st.completed ? 'bg-[#10B981] text-white' : 'border-2 border-[#DDE1E7] bg-white'
                  }`}>
                    {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs ${st.completed ? 'line-through text-[#9DA5B1]' : 'font-medium text-[#171A1F]'}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-[#68707C]">Assigned to: {st.assignee}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    st.completed ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F2F2F7] text-[#68707C]'
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
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative rounded-xl overflow-hidden border border-[#EAEDF1] group h-20">
                <img 
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80" 
                  alt="Field QA Sign-off" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-semibold text-white truncate">Field QA Sign-off</span>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-[#EAEDF1] group h-20">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80" 
                  alt="Site Signoff" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-semibold text-white truncate">City Permit Approval</span>
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
              className="flex-1 h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
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
              className="flex-1 h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Draw (${(budgetValue / 1000).toFixed(0)}k)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 h-10 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#171A1F] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
