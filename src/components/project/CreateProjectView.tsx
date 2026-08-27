import React, { useState } from 'react';
import { Project } from '../../types';
import { ArrowLeft, Camera, Upload, Check, Image as ImageIcon, X } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateProjectViewProps {
  onBack: () => void;
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
  { label: 'Modern Build', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Custom Residence', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Commercial Highrise', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80' },
  { label: 'Renovation', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80' }
];

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onBack,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<string>(PROJECT_TYPES[0]);
  const [masterCode, setMasterCode] = useState('');
  const [thumbnail, setThumbnail] = useState<string>(DEFAULT_PRESET_PHOTOS[0].url);

  const isValid = name.trim().length > 0 && masterCode.trim().length > 0;

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

    onCreate({
      name: name.trim(),
      code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      location: address.trim() || 'Site Address',
      cityState: address.includes(',') ? address.split(',')[1]?.trim() || 'Austin, TX' : 'Austin, TX',
      status: 'Planning',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: '2026-12-31',
      budget: {
        total: 2500000,
        committed: 0,
        actual: 0,
        paid: 0,
        remaining: 2500000,
        variance: 0,
        costToComplete: 2500000
      },
      projectManager: {
        id: 'usr_pm',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
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
      description: `Client: ${clientName.trim() || 'Private Client'} • Master Code: ${masterCode.trim()}`
    });
  };

  const inputClass =
    'w-full h-11 bg-[#070D1A] border border-[#142036] focus:border-[#2563EB] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-colors font-medium';

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          New Construction
        </span>
      </div>

      <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-6 shadow-2xl flex flex-col text-slate-100">
        <h2 className="text-lg font-bold text-white tracking-tight pb-4 border-b border-[#142036] mb-4">
          New Project
        </h2>

        {/* 1:1 Reference Form with Photo Upload */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Cover Photo Upload Box */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Project Cover Photo
            </label>
            <div className="h-32 w-full relative rounded-2xl overflow-hidden border border-[#142036] bg-[#050811] group">
              <img
                src={thumbnail}
                alt="Project Thumbnail"
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Photo Preset Selectors */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {DEFAULT_PRESET_PHOTOS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setThumbnail(p.url)}
                  className={`h-10 rounded-xl overflow-hidden border transition-all cursor-pointer relative ${
                    thumbnail === p.url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-[#142036] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  {thumbnail === p.url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Project Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Johnson Residence"
              className={inputClass}
            />
          </div>

          {/* 2. Client Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. John & Sarah Johnson"
              className={inputClass}
            />
          </div>

          {/* 3. Address */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Oak Lane, Austin TX"
              className={inputClass}
            />
          </div>

          {/* 4. Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Type
            </label>
            <CustomSelect
              value={type}
              onChange={setType}
              options={PROJECT_TYPES as any}
              size="md"
            />
          </div>

          {/* 5. Master Code (4 digits) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Master Code (4 digits) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={masterCode}
              onChange={(e) => setMasterCode(e.target.value)}
              placeholder="1 2 3 4"
              className={`${inputClass} tracking-widest text-center font-mono`}
            />
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Required to unlock completed tasks.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full h-12 rounded-2xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isValid
                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-600/30 active:scale-[0.99]'
                  : 'bg-[#0D1422] text-slate-500 border border-[#142036] cursor-not-allowed'
              }`}
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
