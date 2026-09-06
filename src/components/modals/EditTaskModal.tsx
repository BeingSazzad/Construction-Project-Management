import React, { useState, useEffect } from 'react';
import { X, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

export interface EditableTaskData {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  costCode?: string;
  assignee?: string;
  dueDate?: string;
  groupId: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: EditableTaskData | null;
  stageGroups: { id: string; name: string }[];
  onSave: (updatedTask: {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority?: 'Low' | 'Medium' | 'High' | 'Critical';
    costCode?: string;
    assignee?: string;
    dueDate?: string;
    targetGroupId: string;
  }) => void;
  onDelete?: (groupId: string, taskId: string) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  stageGroups,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [costCode, setCostCode] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setGroupId(task.groupId || (stageGroups[0]?.id || ''));
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'Medium');
      setAssignee(task.assignee || '');
      setDueDate(task.dueDate || '');
      setCostCode(task.costCode || '');
      setIsConfirmingDelete(false);
    }
  }, [task, stageGroups]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task.id,
      title: title.trim(),
      status,
      priority,
      costCode: costCode.trim() || undefined,
      assignee: assignee.trim() || undefined,
      dueDate: dueDate.trim() || undefined,
      targetGroupId: groupId
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.groupId, task.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[390px] mx-auto bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <Pencil className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-snug truncate">
                Edit Construction Task
              </h3>
              <p className="text-xs text-[#68707C] font-medium truncate">
                Task ID: {task.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Task Title */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Level 2 Elevated Deck Concrete Pour"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
            />
          </div>

          {/* Phase / Stage Selection */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
              Construction Phase / Stage
            </label>
            <CustomSelect
              value={groupId}
              onChange={(val) => setGroupId(val)}
              options={stageGroups.map(g => ({
                value: g.id,
                label: g.name
              }))}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
                Status
              </label>
              <CustomSelect
                value={status}
                onChange={(val) => setStatus(val as 'todo' | 'in-progress' | 'done')}
                options={[
                  { value: 'todo', label: 'To Do' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'done', label: 'Completed (Done)' }
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
                Priority
              </label>
              <CustomSelect
                value={priority}
                onChange={(val) => setPriority(val as 'Low' | 'Medium' | 'High' | 'Critical')}
                options={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                  { value: 'Critical', label: 'Critical' }
                ]}
              />
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
                Assignee / Trade
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g. Apex Framing"
                className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
                Due Date
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Thu, Sep 10"
                className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
              />
            </div>
          </div>

          {/* CSI Cost Code */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">
              CSI Cost Code (Optional)
            </label>
            <input
              type="text"
              value={costCode}
              onChange={(e) => setCostCode(e.target.value)}
              placeholder="e.g. 03-3100 Cast-in-Place Concrete"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
            />
          </div>

          {/* Action Buttons (Global 48px Large Button Standard) */}
          <div className="grid grid-cols-2 gap-2.5 mt-2 pt-2 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full btn-modal-submit disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>

          {/* Destructive Delete Action with Confirmation */}
          {onDelete && (
            <div className="pt-2 border-t border-[#EAEDF1] flex justify-center">
              {isConfirmingDelete ? (
                <div className="w-full flex items-center justify-between gap-2 p-2 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in">
                  <span className="text-xs font-semibold text-rose-700">Delete this task permanently?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
