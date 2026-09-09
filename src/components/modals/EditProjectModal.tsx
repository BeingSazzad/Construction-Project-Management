import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../../types';
import { X, Check } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProject: Project) => void;
  onDelete?: (projectId: string) => void;
  canAssignLeadPm?: boolean;
  canEditBudget?: boolean;
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
  onUpdate,
  canAssignLeadPm = false,
  canEditBudget = false,
}) => {
  const [name, setName] = useState(project.name);
  const [code, setCode] = useState(project.code || '');
  const [location, setLocation] = useState(project.location || '');
  const [cityState, setCityState] = useState(project.cityState || '');
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [selectedPM, setSelectedPM] = useState(project.projectManager?.name || 'Sarah Johnson');
  const [totalBudget, setTotalBudget] = useState(project.budget?.total || 0);
  const [startDate, setStartDate] = useState(project.startDate || '');
  const [targetEndDate, setTargetEndDate] = useState(project.targetEndDate || '');
  const [description, setDescription] = useState(project.description || '');

  const [clientName, setClientName] = useState(project.clientName || '');
  const [progress, setProgress] = useState(project.progress || 0);
  const [masterCode, setMasterCode] = useState(project.masterCode || '1234');

  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setCode(project.code || '');
      setLocation(project.location || '');
      setCityState(project.cityState || '');
      setStatus(project.status);
      setSelectedPM(project.projectManager?.name || 'Sarah Johnson');
      setTotalBudget(project.budget?.total || 0);
      setStartDate(project.startDate || '');
      setTargetEndDate(project.targetEndDate || '');
      setDescription(project.description || '');
      setClientName(project.clientName || '');
      setProgress(project.progress || 0);
      setMasterCode(project.masterCode || '1234');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pmObj = AVAILABLE_PMS.find(p => p.name === selectedPM) || {
      name: selectedPM.trim() || 'Sarah Johnson',
      email: 'pm@averymarsh.com',
      avatar: project.projectManager?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    };

    const updated: Project = {
      ...project,
      name: name.trim(),
      code: code.trim() || project.code,
      location: location.trim(),
      cityState: cityState.trim() || 'Tampa, FL',
      status: status,
      progress: Number(progress) || 0,
      startDate: startDate,
      targetEndDate: targetEndDate,
      description: description.trim(),
      clientName: clientName.trim(),
      masterCode: masterCode.trim(),
      projectManager: canAssignLeadPm ? {
        id: project.projectManager?.id || 'usr_pm',
        name: pmObj.name,
        avatar: pmObj.avatar
      } : project.projectManager,
      budget: canEditBudget ? {
        ...project.budget,
        total: Number(totalBudget) || project.budget.total,
        remaining: Math.max(0, (Number(totalBudget) || project.budget.total) - project.budget.actual)
      } : project.budget
    };

    onUpdate(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[410px] mx-auto bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#171A1F] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div>
            <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Edit Project Details</h2>
            <p className="text-xs text-[#68707C] mt-0.5 font-medium">Update address, client, and schedule</p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Project Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="SIR-2025"
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Site Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="450 Waterfront Blvd"
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">City / State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="New York, NY"
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
          </div>

          {/* Status & Progress % */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Lifecycle Status</label>
              <CustomSelect
                value={status}
                onChange={(v) => setStatus(v as ProjectStatus)}
                options={[
                  'On Schedule',
                  'In Progress',
                  'Planning',
                  'Pre-Construction',
                  'At Risk',
                  'Delayed',
                  'On Hold',
                  'Completed',
                  'Warranty'
                ]}
                size="md"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Progress %</label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
          </div>

          {/* Budget & Client Name */}
          <div className={`grid gap-2 ${canEditBudget ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {canEditBudget && (
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Total Budget ($ USD)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Texas Commercial LLC"
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
          </div>

          {/* Master Code & Project Manager */}
          <div className={`grid gap-2 ${canAssignLeadPm ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {canAssignLeadPm && (
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Lead Project Manager</label>
              <select
                value={selectedPM}
                onChange={(e) => setSelectedPM(e.target.value)}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] cursor-pointer font-medium"
              >
                {AVAILABLE_PMS.map(pm => (
                  <option key={pm.name} value={pm.name}>{pm.name}</option>
                ))}
              </select>
            </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Master Code (4 digits)</label>
              <input
                type="text"
                maxLength={4}
                required
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Target Completion Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#171A1F] mb-1 block">Project Scope & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of scope and structure..."
              className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl p-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Bottom Actions: Cancel & Save */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAEDF1] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
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
