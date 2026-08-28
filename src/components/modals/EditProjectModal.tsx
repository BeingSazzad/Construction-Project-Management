import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { X, Check, Building, MapPin, DollarSign, Calendar, UserCheck, FileText } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProject: Project) => void;
  onDelete?: (projectId: string) => void;
}

const AVAILABLE_PMS = [
  { name: 'Sarah Johnson', email: 'sarah.j@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Elena Rossi', email: 'elena.r@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { name: 'David Vance', email: 'david.v@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { name: 'Marcus Chen', email: 'marcus.c@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [name, setName] = useState(project.name);
  const [location, setLocation] = useState(project.location || '450 Waterfront Blvd');
  const [cityState, setCityState] = useState(project.cityState || 'New York, NY');
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [selectedPM, setSelectedPM] = useState(project.projectManager.name);
  const [totalBudget, setTotalBudget] = useState(project.budget.total);
  const [startDate, setStartDate] = useState(project.startDate || '2024-09-01');
  const [targetEndDate, setTargetEndDate] = useState(project.targetEndDate || '2025-11-30');
  const [description, setDescription] = useState(project.description || '');

  const [clientName, setClientName] = useState(project.clientName || '');
  const [progress, setProgress] = useState(project.progress);
  const [masterCode, setMasterCode] = useState(project.masterCode || '1234');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pmObj = AVAILABLE_PMS.find(p => p.name === selectedPM) || {
      name: selectedPM.trim() || 'Sarah Johnson',
      email: 'pm@averymarsh.com',
      avatar: project.projectManager.avatar
    };

    const updated: Project = {
      ...project,
      name: name.trim(),
      location: location.trim(),
      cityState: cityState.trim() || 'New York, NY',
      status: status,
      progress: Number(progress) || 0,
      startDate: startDate,
      targetEndDate: targetEndDate,
      description: description.trim(),
      clientName: clientName.trim(),
      masterCode: masterCode.trim(),
      projectManager: {
        id: project.projectManager.id,
        name: pmObj.name,
        avatar: pmObj.avatar
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Edit Project Info</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Code: {project.code}</p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Project Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Site Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="450 Waterfront Blvd"
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">City / State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="New York, NY"
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status & Progress % */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Lifecycle Status</label>
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

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Progress %</label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Budget & Client Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Total Budget ($ USD)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Texas Commercial LLC"
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Master Code & Project Manager */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Lead Project Manager</label>
              <select
                value={selectedPM}
                onChange={(e) => setSelectedPM(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
              >
                {AVAILABLE_PMS.map(pm => (
                  <option key={pm.name} value={pm.name}>{pm.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Master Code (4 digits)</label>
              <input
                type="text"
                maxLength={4}
                required
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Target Completion Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Project Scope & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of scope and structure..."
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Bottom Actions: Cancel & Save */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#142036] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
