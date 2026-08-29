import React, { useState } from 'react';
import { Project } from '../../types';
import { X, Upload, Check } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: Partial<Project>) => void;
}

export const PROJECT_TYPES = [
  'Custom Home',
  'Remodel',
  'New Construction',
  'Commercial',
  'Design-Build'
] as const;

export const DEFAULT_PRESET_PHOTOS = [
  { label: 'Commercial Highrise', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' },
  { label: 'Modern Residence', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Urban Tower', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Coastal Condo', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' }
];

const AVAILABLE_PMS = [
  { name: 'Sarah Johnson', email: 'sarah.j@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Elena Rossi', email: 'elena.r@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { name: 'David Vance', email: 'david.v@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { name: 'Marcus Chen', email: 'marcus.c@averymarsh.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [cityState, setCityState] = useState('');
  const [type, setType] = useState<string>(PROJECT_TYPES[0]);
  const [pmName, setPmName] = useState(AVAILABLE_PMS[0].name);
  const [totalBudget, setTotalBudget] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [masterCode, setMasterCode] = useState('');
  const [thumbnail, setThumbnail] = useState<string>('');

  if (!isOpen) return null;

  const isValid = name.trim().length > 0;

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
    if (!isValid) return;

    const pmObj = AVAILABLE_PMS.find(p => p.name === pmName) || AVAILABLE_PMS[0];
    const budgetNum = Number(totalBudget) || 0;

    onCreate({
      name: name.trim(),
      code: masterCode.trim() ? `PRJ-${masterCode.trim()}` : `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      location: address.trim() || 'Site Address Pending',
      cityState: cityState.trim() || (address.includes(',') ? address.split(',')[1]?.trim() || 'Austin, TX' : 'Austin, TX'),
      status: 'Planning',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: targetEndDate || '2026-06-30',
      budget: {
        total: budgetNum,
        committed: 0,
        actual: 0,
        paid: 0,
        remaining: budgetNum,
        variance: 0,
        costToComplete: budgetNum
      },
      projectManager: {
        id: `pm-${Date.now()}`,
        name: pmObj.name,
        avatar: pmObj.avatar
      },
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        openPunchItems: 0,
        totalMilestones: 4,
        completedMilestones: 0
      },
      thumbnail: thumbnail || DEFAULT_PRESET_PHOTOS[0].url,
      coverImage: thumbnail || DEFAULT_PRESET_PHOTOS[0].url,
      description: description.trim() || `${type} development for ${clientName.trim() || 'Client'}.`,
      clientName: clientName.trim(),
      type: type as any,
      masterCode: masterCode.trim()
    });

    onClose();
  };

  const inputClass =
    'w-full h-10 bg-[#050811] border border-[#142036] focus:border-[#2563EB] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-colors font-medium';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#142036]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Create New Project</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Initialize a new project workspace</p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          
          {/* Cover Photo Upload Box */}
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
              Project Cover Photo
            </label>
            {thumbnail ? (
              <div className="h-28 w-full relative rounded-2xl overflow-hidden border border-[#142036] bg-[#050811] group">
                <img
                  src={thumbnail}
                  alt="Project Thumbnail"
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="h-24 w-full rounded-2xl border-2 border-dashed border-[#1A2744] hover:border-blue-500/40 bg-[#060B17] flex flex-col items-center justify-center gap-1.5 cursor-pointer group transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                    Upload Cover Photo
                  </span>
                  <p className="text-[10px] text-slate-500 font-medium">PNG, JPG or choose preset (Optional)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Quick Preset Selector */}
            <div className="mt-2">
              <p className="text-[10px] text-slate-500 font-medium mb-1">Or select a preset:</p>
              <div className="grid grid-cols-4 gap-1.5">
                {DEFAULT_PRESET_PHOTOS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThumbnail(thumbnail === p.url ? '' : p.url)}
                    className={`relative h-10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      thumbnail === p.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-[#142036] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    {thumbnail === p.url && (
                      <div className="absolute inset-0 bg-blue-600/50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Riverside Office Complex"
              className={inputClass}
            />
          </div>

          {/* Client / Owner & Project Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Client / Owner
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Texas Commercial LLC"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Project Type
              </label>
              <CustomSelect
                value={type}
                onChange={(v) => setType(v)}
                options={PROJECT_TYPES as unknown as string[]}
                size="md"
              />
            </div>
          </div>

          {/* Site Address & City/State */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Site Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="450 Waterfront Blvd"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                City / State
              </label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="Austin, TX"
                className={inputClass}
              />
            </div>
          </div>

          {/* Lead PM & Total Estimated Budget */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Lead Project Manager
              </label>
              <select
                value={pmName}
                onChange={(e) => setPmName(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
              >
                {AVAILABLE_PMS.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Total Budget ($ USD)
              </label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="e.g. 2500000"
                className={inputClass}
              />
            </div>
          </div>

          {/* Target Completion Date & Master Code */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Target Completion Date
              </label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
                Master Code (Optional)
              </label>
              <input
                type="text"
                maxLength={4}
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1042"
                className={inputClass}
              />
            </div>
          </div>

          {/* Project Scope & Description */}
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
              Project Scope & Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of structure, LEED requirements, architectural notes..."
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none font-medium placeholder-slate-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-[#142036] flex items-center justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isValid
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-blue-600/30 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
