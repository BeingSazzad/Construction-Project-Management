import React from 'react';
import { Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { 
  X, CheckSquare, Calendar, MapPin, User as UserIcon, 
  Paperclip, MessageSquare, CheckCircle2, Clock, Check 
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onUpdateStatus,
  onToggleSubtask
}) => {
  if (!task) return null;

  const isDone = task.status === 'Completed';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1C2A44] mb-3">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400">{task.projectName}</span>
            <h3 className="text-sm font-black text-white tracking-tight mt-0.5">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status and Priority Pill */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={task.status} size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Priority:</span>
            <StatusBadge status={task.priority} size="xs" />
          </div>
        </div>

        {/* Description Box */}
        <div className="mb-4">
          <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1">Scope & Instructions</h4>
          <p className="text-xs text-slate-200 bg-[#0B101D] p-3 rounded-xl border border-[#182338] leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Subtask Checklist */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-bold uppercase text-slate-400">Subtask Execution Checklist</h4>
            <span className="text-[10px] text-cyan-400 font-bold">
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => onToggleSubtask(task.id, st.id)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                  st.completed ? 'bg-[#091522] border-emerald-500/30 text-slate-400' : 'bg-[#111827] border-[#1E2E4A] text-slate-200 hover:border-cyan-400/40'
                }`}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                  st.completed ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-600 bg-[#0B101D]'
                }`}>
                  {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs ${st.completed ? 'line-through text-slate-400' : 'font-medium'}`}>{st.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-[#0B101D] rounded-xl border border-[#172238]">
          <div>
            <span className="text-[10px] text-slate-400 block">Assignee</span>
            <span className="font-bold text-white mt-0.5 block">{task.assignee.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Due Date</span>
            <span className="font-bold text-amber-400 mt-0.5 block">{task.dueDate}</span>
          </div>
          {task.location && (
            <div className="col-span-2 pt-1 border-t border-[#141E30]">
              <span className="text-[10px] text-slate-400 block">Location</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{task.location}</span>
            </div>
          )}
        </div>

        {/* Action Button: Status Update */}
        <div className="mt-auto pt-2 flex gap-2">
          {!isDone ? (
            <Button
              variant="primary"
              onClick={() => {
                onUpdateStatus(task.id, 'Completed');
                onClose();
              }}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Mark Task Complete
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                onUpdateStatus(task.id, 'In Progress');
                onClose();
              }}
            >
              Reopen Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
