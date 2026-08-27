import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { X, Trash2, Check, Building, MapPin, DollarSign, Calendar, UserCheck } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProject: Project) => void;
  onDelete: (projectId: string) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState(project.name);
  const [cityState, setCityState] = useState(project.cityState);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [pmName, setPmName] = useState(project.projectManager.name);
  const [totalBudget, setTotalBudget] = useState(project.budget.total);
  const [targetEndDate, setTargetEndDate] = useState(project.targetEndDate || '2026-06-30');
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Project = {
      ...project,
      name: name.trim(),
      cityState: cityState.trim() || 'Austin, TX',
      status: status,
      targetEndDate: targetEndDate,
      projectManager: {
        ...project.projectManager,
        name: pmName.trim() || 'Sarah Johnson'
      },
      budget: {
        ...project.budget,
        total: Number(totalBudget) || project.budget.total,
        remaining: Math.max(0, (Number(totalBudget) || project.budget.total) - project.budget.actual)
      }
    };

    onUpdate(updated);
    onClose();
  };

  const handleDelete = () => {
    onDelete(project.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Edit Project Details</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Code: {project.code}</p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Delete Confirmation Warning View */}
        {isConfirmingDelete ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Trash2 className="w-4 h-4" />
              <span>Delete this Project?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{project.name}"</strong>? All tasks, drawings, and budget logs will be removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3 py-1.5 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            {/* Project Name */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* City & State Location */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Location / City State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Lifecycle Status</label>
              <CustomSelect
                value={status}
                onChange={(v) => setStatus(v as ProjectStatus)}
                options={[
                  'Planning',
                  'Pre-Construction',
                  'In Progress',
                  'On Hold',
                  'Completed',
                  'Warranty'
                ]}
                size="md"
              />
            </div>

            {/* Project Manager & Target End Date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Manager</label>
                <input
                  type="text"
                  value={pmName}
                  onChange={(e) => setPmName(e.target.value)}
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Target Completion</label>
                <input
                  type="date"
                  value={targetEndDate}
                  onChange={(e) => setTargetEndDate(e.target.value)}
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Total Budget */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Total Budget ($)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Bottom Actions: Delete Button on left, Save on right */}
            <div className="flex items-center justify-between pt-3 border-t border-[#142036] mt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
