import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../../types';
import { X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { PROJECT_TYPES, DEFAULT_PRESET_PHOTOS } from '../project/CreateProjectView';

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
  const [type, setType] = useState<string>(project.type || PROJECT_TYPES[0]);
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
  const [thumbnail, setThumbnail] = useState<string>(project.coverImage || project.thumbnail || '');
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setCode(project.code || '');
      setType(project.type || PROJECT_TYPES[0]);
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
      setThumbnail(project.coverImage || project.thumbnail || '');
      setShowPhotoSelector(false);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      type: type as any,
      location: location.trim(),
      cityState: cityState.trim() || 'Tampa, FL',
      status: status,
      progress: Number(progress) || 0,
      startDate: startDate,
      targetEndDate: targetEndDate,
      description: description.trim(),
      clientName: clientName.trim(),
      masterCode: masterCode.trim(),
      thumbnail: thumbnail || project.thumbnail,
      coverImage: thumbnail || project.coverImage,
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

  const inputClass =
    'w-full h-11 bg-[#F8FAFC] border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3.5 text-xs text-[#0F172A] placeholder-[#8F95B2] outline-none transition-colors font-medium';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[430px] sm:max-w-lg mx-auto bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">Edit Project Details</h2>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">Update project scope, metadata, dates & photos</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Cover Photo / Thumbnail Section */}
          <div className="flex flex-col gap-2 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#1677FF]" />
                <span className="text-xs font-bold text-[#0F172A]">Cover Image</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPhotoSelector(!showPhotoSelector)}
                className="text-[11px] font-semibold text-[#1677FF] hover:underline cursor-pointer"
              >
                {showPhotoSelector ? 'Hide Presets' : 'Change Photo'}
              </button>
            </div>

            {/* Current Cover Preview */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-200">
              <img
                src={thumbnail || DEFAULT_PRESET_PHOTOS[0].url}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute bottom-2 right-2 h-7 px-2.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3 h-3" />
                <span>Upload Custom</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preset Selector Grid */}
            {showPhotoSelector && (
              <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-in">
                {DEFAULT_PRESET_PHOTOS.map((preset, idx) => {
                  const isSelected = thumbnail === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnail(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer h-16 ${
                        isSelected ? 'border-[#1677FF] shadow-xs scale-[1.02]' : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-semibold text-white truncate">{preset.label}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1677FF] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title & Project Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="e.g. Waterfront Residence"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project Type</label>
              <CustomSelect
                value={type}
                onChange={(v) => setType(v)}
                options={[...PROJECT_TYPES]}
                size="md"
              />
            </div>
          </div>

          {/* Code & Master Access Code */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRJ-1001"
                className={`${inputClass} font-mono font-bold`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Lockbox Code (4 digits)</label>
              <input
                type="text"
                maxLength={4}
                required
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          {/* Address & City/State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Site Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="1840 Brightwaters Blvd"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">City / State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="Tampa, FL"
                className={inputClass}
              />
            </div>
          </div>

          {/* Status & Progress % */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Lifecycle Status</label>
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
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Progress %</label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Client Name & Lead PM */}
          <div className={`grid gap-2.5 ${canAssignLeadPm ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Arthur & Evelyn Vance"
                className={inputClass}
              />
            </div>

            {canAssignLeadPm && (
              <div>
                <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Lead Project Manager</label>
                <select
                  value={selectedPM}
                  onChange={(e) => setSelectedPM(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {AVAILABLE_PMS.map(pm => (
                    <option key={pm.name} value={pm.name}>{pm.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Budget (Owner/Finance Only) */}
          {canEditBudget && (
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Base Contract Budget ($ USD)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Target Completion Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Scope & Description */}
          <div>
            <label className="text-xs font-semibold text-[#0F172A] mb-1 block">Project Scope & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of scope, zoning, and construction specifications..."
              className="w-full bg-[#F8FAFC] border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl p-3 text-[#0F172A] text-xs outline-none resize-none font-medium leading-relaxed transition-colors"
            />
          </div>

          {/* Bottom Actions: Cancel & Save */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAEDF1] mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#DDE1E7] text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
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
