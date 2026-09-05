import React from 'react';
import { Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { 
  X, CheckCircle2, Check 
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#EAEDF1] mb-3">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] uppercase font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded">{task.projectName}</span>
            <h3 className="text-base font-bold text-[#171A1F] tracking-tight mt-1.5">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status and Priority Pill */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={task.status} size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#68707C]">Priority:</span>
            <StatusBadge status={task.priority} size="xs" />
          </div>
        </div>

        {/* Description Box */}
        {task.description && (
          <div className="mb-4">
            <h4 className="text-[11px] font-bold uppercase text-[#68707C] mb-1">Scope & Instructions</h4>
            <p className="text-xs text-[#171A1F] bg-[#F7F8FA] p-3 rounded-xl border border-[#EAEDF1] leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Subtask Checklist */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase text-[#68707C]">Subtask Checklist</h4>
              <span className="text-[11px] text-[#1677FF] font-bold">
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    st.completed ? 'bg-[#F7F8FA] border-[#EAEDF1] text-[#68707C]' : 'bg-white border-[#DDE1E7] text-[#171A1F] hover:border-[#1677FF]/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                    st.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#DDE1E7] bg-white'
                  }`}>
                    {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs ${st.completed ? 'line-through text-[#68707C]' : 'font-medium'}`}>{st.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-[#F7F8FA] rounded-xl border border-[#EAEDF1]">
          <div>
            <span className="text-[10px] text-[#68707C] block font-semibold">Assignee</span>
            <span className="font-bold text-[#171A1F] mt-0.5 block">{task.assignee.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#68707C] block font-semibold">Due Date</span>
            <span className="font-bold text-amber-700 mt-0.5 block">{task.dueDate}</span>
          </div>
          {task.location && (
            <div className="col-span-2 pt-1 border-t border-[#EAEDF1]">
              <span className="text-[10px] text-[#68707C] block font-semibold">Location</span>
              <span className="font-semibold text-[#171A1F] mt-0.5 block">{task.location}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2 flex gap-2">
          {!isDone ? (
            <button
              onClick={() => {
                onUpdateStatus(task.id, 'Completed');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Task Complete</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onUpdateStatus(task.id, 'In Progress');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#171A1F] font-bold text-xs border border-[#DDE1E7] cursor-pointer active:scale-95 transition-all"
            >
              Reopen Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
