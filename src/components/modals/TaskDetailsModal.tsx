import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  X, CheckCircle2, Check, Trash2, Edit3, Save
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (updatedTask: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onUpdateStatus,
  onToggleSubtask,
  onDelete,
  onEdit
}) => {
  if (!task) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState(task.dueDate);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editLocation, setEditLocation] = useState(task.location || 'Site Area');

  const isDone = task.status === 'Completed';

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    if (onEdit) {
      onEdit({
        ...task,
        title: editTitle.trim(),
        description: editDesc.trim(),
        dueDate: editDueDate,
        priority: editPriority,
        location: editLocation.trim()
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      if (onDelete) onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] mx-auto bg-white border border-slate-200 p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-4 text-slate-900">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[10px] uppercase font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-md">
              {task.projectName}
            </span>
            {!isEditing ? (
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1.5 leading-snug">
                {task.title}
              </h3>
            ) : (
              <div className="mt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1677FF] outline-none"
                  required
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!isEditing && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-[#1677FF] hover:bg-blue-50 flex items-center justify-center cursor-pointer transition-colors"
                title="Edit Task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Description / Instructions</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#1677FF] outline-none"
                placeholder="Scope & execution instructions..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Due Date</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#1677FF] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full h-9 px-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#1677FF] outline-none bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Location / Zone</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-xl focus:border-[#1677FF] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 h-9 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <>
            {/* Status and Priority Row */}
            <div className="flex items-center justify-between">
              <StatusBadge status={task.status} size="sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Priority:</span>
                <StatusBadge status={task.priority} size="xs" />
              </div>
            </div>

            {/* Clean Metadata Details */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Assignee</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{task.assignee.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Due Date</span>
                <span className="text-xs font-bold text-amber-600 mt-0.5 block">{task.dueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Location</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{task.location || 'Site Area'}</span>
              </div>
            </div>

            {/* Description Text */}
            {task.description && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Scope & Instructions</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtask Checklist */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subtasks</h4>
                  <span className="text-xs text-[#1677FF] font-bold">
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Done
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
                  {task.subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onToggleSubtask(task.id, st.id)}
                      className="px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                        st.completed ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs flex-1 ${st.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Status Toggle + Delete Task */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 active:scale-95"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {!isDone ? (
                <button
                  onClick={() => {
                    onUpdateStatus(task.id, 'Completed');
                    onClose();
                  }}
                  className="flex-1 h-10 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
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
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
                >
                  Reopen Task
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
