import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../../types';
import { 
  X, Check, Trash2, Edit3, Save, MapPin, Calendar, User, Clock
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
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

  const assigneeName = typeof task.assignee === 'string'
    ? task.assignee
    : (task.assignee?.name || 'Unassigned');
  const assigneeAvatar = typeof task.assignee === 'object' ? task.assignee?.avatar : undefined;

  return (
    <div 
      className="fixed inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[420px] mx-auto bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-4 text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Clean Breadcrumb & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-[#1677FF] tracking-wide">
              {task.projectName}
            </span>
            {!isEditing ? (
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight mt-1 leading-snug break-words">
                {task.title}
              </h2>
            ) : null}
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 -mr-1">
            {!isEditing && onEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#1677FF]/40 bg-white text-[#475569] hover:text-[#1677FF] flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                title="Edit Task"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Edit</span>
              </button>
            )}
            {!isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="h-8 px-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3.5 text-xs pt-1">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">Task Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-11 px-3.5 text-xs font-bold border border-[#E2E8F0] rounded-xl focus:border-[#1677FF] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">Scope & Instructions</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs border border-[#E2E8F0] rounded-xl focus:border-[#1677FF] outline-none resize-none leading-relaxed"
                placeholder="Scope & execution instructions..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Due Date</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs border border-[#E2E8F0] rounded-xl focus:border-[#1677FF] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475569] block mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full h-10 px-3 text-xs border border-[#E2E8F0] rounded-xl focus:border-[#1677FF] outline-none bg-white font-medium"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">Site Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full h-10 px-3 text-xs border border-[#E2E8F0] rounded-xl focus:border-[#1677FF] outline-none font-medium"
                placeholder="e.g. Level 12 Deck"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 mt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 h-10 rounded-xl bg-[#F1F5F9] text-[#475569] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode - Completely Box-Free, Open, Minimalist */
          <>
            {/* Status & Priority Row (Lightweight text & indicators, no heavy boxes) */}
            <div className="flex items-center gap-3 text-xs">
              {/* Status pill */}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                task.status === 'Completed'
                  ? 'bg-[#EAF3FF] text-[#1677FF]'
                  : task.status === 'Blocked'
                  ? 'bg-rose-50 text-rose-700'
                  : task.status === 'In Progress'
                  ? 'bg-[#EAF3FF] text-[#1677FF]'
                  : 'bg-[#F1F5F9] text-[#64748B]'
              }`}>
                {task.status === 'Completed' ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : task.status === 'In Progress' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                ) : task.status === 'Blocked' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                )}
                <span>{task.status}</span>
              </span>

              {/* Priority - Just a clean dot + text, no box */}
              {task.priority === 'Critical' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Critical Priority
                </span>
              )}
              {task.priority === 'High' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  High Priority
                </span>
              )}
              {task.priority !== 'Critical' && task.priority !== 'High' && (
                <span className="text-xs text-[#94A3B8] font-medium">
                  {task.priority} Priority
                </span>
              )}
            </div>

            {/* Clean Details Strip (Open & Borderless) */}
            <div className="grid grid-cols-3 gap-3 py-1">
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider block">Assignee</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {assigneeAvatar ? (
                    <img src={assigneeAvatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-[#E2E8F0] text-[#475569] text-[9px] font-bold flex items-center justify-center shrink-0">
                      {assigneeName.charAt(0)}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#0F172A] truncate">{assigneeName}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider block">Due Date</span>
                <span className="text-xs font-semibold text-[#0F172A] mt-1 block">
                  {task.dueDate || 'No date'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider block">Location</span>
                <span className="text-xs font-semibold text-[#0F172A] mt-1 block truncate">
                  {task.location || 'Site Office'}
                </span>
              </div>
            </div>

            {/* Scope & Instructions (Open, Clean Paragraph - NO gray box!) */}
            {task.description && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Scope & Instructions
                </span>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtasks (Clean Checklist Items - NO box borders around each item!) */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Checklist
                  </span>
                  <span className="text-[11px] font-bold text-[#1677FF]">
                    {task.subtasks.filter(s => s.completed).length} of {task.subtasks.length} done
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {task.subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onToggleSubtask?.(task.id, st.id)}
                      className="py-1.5 px-2 -mx-2 rounded-xl flex items-center gap-2.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        st.completed ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#CBD5E1] bg-white group-hover:border-[#1677FF]'
                      }`}>
                        {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs flex-1 transition-colors ${
                        st.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A] font-medium'
                      }`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Full-Width Primary CTA + Subtle Delete */}
            <div className="pt-3 flex items-center gap-2 mt-auto">
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-10 h-10 rounded-2xl text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {onUpdateStatus && !isDone ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(task.id, 'Completed');
                    onClose();
                  }}
                  className="flex-1 h-11 rounded-2xl bg-[#1677FF] hover:bg-[#125ecc] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Mark Task Complete</span>
                </button>
              ) : onUpdateStatus ? (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(task.id, 'In Progress');
                    onClose();
                  }}
                  className="flex-1 h-11 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-xs cursor-pointer active:scale-[0.99] transition-all"
                >
                  Reopen Task
                </button>
              ) : null}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
