import React, { useState } from 'react';
import { 
  X, Calendar, CheckSquare, DollarSign, Clock, 
  ShieldCheck, AlertCircle, Users, Camera, FileText, 
  Check, ArrowUpRight, Sparkles, ChevronRight, Plus
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

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
  onClose: () => void;
  onUpdateStatus?: (milestoneId: string, status: 'Completed' | 'In Progress' | 'Upcoming') => void;
  onRequestDraw?: (milestone: MilestoneItem) => void;
}

export const MilestoneDetailsModal: React.FC<MilestoneDetailsModalProps> = ({
  milestone,
  projectName = 'Riverside Office Complex',
  onClose,
  onUpdateStatus,
  onRequestDraw
}) => {
  if (!milestone) return null;

  // Mock sub-tasks state for this milestone
  const [subtasks, setSubtasks] = useState([
    { id: 'st-1', title: 'Site Inspection & Engineering Sign-off', completed: true, assignee: 'Elena Rossi' },
    { id: 'st-2', title: 'Rebar Installation & Formwork Inspection', completed: true, assignee: 'Apex Concrete Masters' },
    { id: 'st-3', title: 'Ready-mix Concrete Pour & Vibration', completed: milestone.progress > 50, assignee: 'Apex Concrete Masters' },
    { id: 'st-4', title: '7-Day Compressive Compression Strength Test', completed: milestone.status === 'Completed', assignee: 'Field Testing Lab' },
    { id: 'st-5', title: 'Municipal Inspector Final Green Card Approval', completed: milestone.status === 'Completed', assignee: 'City Building Dept' },
  ]);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false, assignee: 'Project Manager' }
    ]);
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  const completedTasksCount = subtasks.filter(s => s.completed).length;
  const computedProgress = Math.round((completedTasksCount / subtasks.length) * 100);

  const budgetValue = milestone.budgetAllocation || (milestone.id === 'ph-3' ? 850000 : milestone.id === 'ph-2' ? 620000 : 450000);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-[430px] bg-[#070A12] border border-[#142036] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* ─── 1. MODAL HEADER ─── */}
        <div className="p-4 bg-[#09101F] border-b border-[#142036] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  {milestone.code || 'MILESTONE STAGE'}
                </span>
                <span className="text-[10px] text-slate-400">· {projectName}</span>
              </div>
              <h2 className="text-sm font-black text-white truncate tracking-tight mt-0.5">
                {milestone.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#121E36] text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── 2. MODAL SCROLLABLE BODY ─── */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {/* Status & Progress Summary Card */}
          <div className="p-4 rounded-2xl bg-[#090F1E] border border-[#162238] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <StatusBadge status={milestone.status} />
              <div className="text-right">
                <span className="text-xs font-bold text-white">{computedProgress}%</span>
                <span className="text-[10px] text-slate-400 ml-1 font-semibold">Completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#121E36] overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  milestone.status === 'Completed'
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8]'
                }`}
                style={{ width: `${computedProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-0.5">
              <span>{milestone.dates}</span>
              <span className="text-slate-300 font-bold">{milestone.duration}</span>
            </div>
          </div>

          {/* Key Metrics Grid (2x2) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Draw Value */}
            <div className="p-3 rounded-2xl bg-[#090F1E] border border-[#162238] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Draw Allocation</span>
              </div>
              <div className="text-base font-black text-white tracking-tight mt-1">
                ${(budgetValue / 1000).toFixed(0)}k
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Financing Draw Reserve</div>
            </div>

            {/* Lead Subcontractor */}
            <div className="p-3 rounded-2xl bg-[#090F1E] border border-[#162238] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Lead Subcontractor</span>
              </div>
              <div className="text-xs font-bold text-white truncate mt-1">
                {milestone.subcontractor}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Trade Partner Lead</div>
            </div>

            {/* Inspection Status */}
            <div className="p-3 rounded-2xl bg-[#090F1E] border border-[#162238] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>City Inspection</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Passed & Signed</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Building Dept Permitting</div>
            </div>

            {/* Task Completion Count */}
            <div className="p-3 rounded-2xl bg-[#090F1E] border border-[#162238] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Sub-activities</span>
              </div>
              <div className="text-base font-black text-white tracking-tight mt-1">
                {completedTasksCount} / {subtasks.length}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Milestone Tasks Done</div>
            </div>
          </div>

          {/* Sub-activities Interactive Checklist */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-tight">Milestone Tasks & Checklists</h3>
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="text-[11px] font-bold text-[#3875F6] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {isAddingSubtask && (
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 p-2 bg-[#090F1E] border border-[#162238] rounded-2xl">
                <input
                  type="text"
                  placeholder="Enter milestone sub-task..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 h-9 bg-transparent px-3 text-xs text-white outline-none placeholder-slate-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
                >
                  Save
                </button>
              </form>
            )}

            <div className="flex flex-col gap-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    st.completed
                      ? 'bg-[#090F1E]/60 border-[#142036] opacity-80'
                      : 'bg-[#090F1E] border-[#162238] hover:border-blue-500/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    st.completed ? 'bg-emerald-500 text-white' : 'border border-[#263756] bg-[#0D1629]'
                  }`}>
                    {st.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold leading-snug ${st.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Assigned to: {st.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Documentation Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-white tracking-tight">Milestone Photo Documentation</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-2xl overflow-hidden border border-[#162238] group h-24">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=80" 
                  alt="Site Pour Proof" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-bold text-white truncate">Rebar Pour Signoff</span>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#162238] group h-24">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80" 
                  alt="Site Signoff" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                  <span className="text-[10px] font-bold text-white truncate">Green Card Permit</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── 3. MODAL FOOTER ACTIONS ─── */}
        <div className="p-4 bg-[#09101F] border-t border-[#142036] flex items-center gap-2">
          {milestone.status !== 'Completed' ? (
            <button
              onClick={() => {
                if (onUpdateStatus) onUpdateStatus(milestone.id, 'Completed');
                onClose();
              }}
              className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark Milestone Complete</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onRequestDraw) onRequestDraw(milestone);
                onClose();
              }}
              className="flex-1 h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all active:scale-95"
            >
              <DollarSign className="w-4 h-4" />
              <span>Request Draw for Milestone</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 h-11 rounded-2xl bg-[#0F192E] hover:bg-[#162442] border border-[#1E2E4A] text-slate-300 text-xs font-bold transition-all active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
