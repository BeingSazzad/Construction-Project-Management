import React from 'react';
import { Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
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
      <div className="w-full max-w-[440px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-4 text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#EAEDF1]">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] uppercase font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded">
              {task.projectName}
            </span>
            <h3 className="text-base font-bold text-[#171A1F] tracking-tight mt-1.5">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status and Priority Row */}
        <div className="flex items-center justify-between">
          <StatusBadge status={task.status} size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#68707C]">Priority:</span>
            <StatusBadge status={task.priority} size="xs" />
          </div>
        </div>

        {/* Clean Metadata Details (Single Row, No Inner Gray Box) */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#EAEDF1]">
          <div>
            <span className="text-xs text-[#525866] uppercase font-bold tracking-wider block">Assignee</span>
            <span className="text-xs sm:text-sm font-bold text-[#171A1F] mt-0.5 block truncate">{task.assignee.name}</span>
          </div>
          <div>
            <span className="text-xs text-[#525866] uppercase font-bold tracking-wider block">Due Date</span>
            <span className="text-xs sm:text-sm font-bold text-amber-700 mt-0.5 block">{task.dueDate}</span>
          </div>
          <div>
            <span className="text-xs text-[#525866] uppercase font-bold tracking-wider block">Location</span>
            <span className="text-xs sm:text-sm font-bold text-[#171A1F] mt-0.5 block truncate">{task.location || 'Site Area'}</span>
          </div>
        </div>

        {/* Description Text (Clean typography, no inner gray box) */}
        {task.description && (
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#525866] mb-1.5">Scope & Instructions</h4>
            <p className="text-xs sm:text-sm text-[#171A1F] leading-relaxed font-normal">
              {task.description}
            </p>
          </div>
        )}

        {/* Subtask Checklist (Clean divider list, not individual boxes) */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">Subtasks</h4>
              <span className="text-xs text-[#1677FF] font-extrabold">
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Completed
              </span>
            </div>

            <div className="rounded-2xl border border-[#EAEDF1] bg-white divide-y divide-[#EAEDF1] overflow-hidden">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  className="px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    st.completed ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#DDE1E7] bg-white'
                  }`}>
                    {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs flex-1 ${st.completed ? 'line-through text-[#9DA5B1]' : 'font-medium text-[#171A1F]'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex gap-2">
          {!isDone ? (
            <button
              onClick={() => {
                onUpdateStatus(task.id, 'Completed');
                onClose();
              }}
              className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
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
              className="w-full h-10 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#171A1F] font-bold text-xs border border-[#DDE1E7] cursor-pointer active:scale-95 transition-all"
            >
              Reopen Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
