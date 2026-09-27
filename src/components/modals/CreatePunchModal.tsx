import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, Priority, Subcontractor } from '../../types';
import { X, Camera, CheckCircle2, Plus, LocateFixed, ChevronDown } from 'lucide-react';

interface CreatePunchModalProps {
  isOpen: boolean;
  projects?: Project[];
  project?: Project | null;
  subcontractors?: Subcontractor[];
  onClose: () => void;
  onCreate: (item: Partial<PunchItem>) => void;
}

export const CreatePunchModal: React.FC<CreatePunchModalProps> = ({
  isOpen,
  projects = [],
  project,
  subcontractors = [],
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || projects[0]?.id || 'proj-1');
  const [description, setDescription] = useState('');
  const [trade, setTrade] = useState('Concrete Solutions Inc.');
  const [customTrade, setCustomTrade] = useState('');
  const [isCustomTrade, setIsCustomTrade] = useState(false);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize project selection
  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [project, projects, isOpen]);

  // Dynamically compute trade options from selected project and subcontractors directory
  const projectSubcontractors = subcontractors
    .filter(s => s.activeProjects?.includes(selectedProjectId))
    .map(s => s.companyName);

  const allSubcontractorNames = subcontractors.map(s => s.companyName);

  const defaultTrades = [
    'Concrete Solutions Inc.',
    'Craft Drywall LLC',
    'Prime Finishes Co.',
    'FlowTech Plumbing',
    'Climate HVAC Mechanical',
    'Apex Glazing & Waterproofing',
    'ProShield Firestopping',
    'Steel Masters LLC'
  ];

  const tradeOptions = Array.from(new Set([
    ...projectSubcontractors,
    ...allSubcontractorNames,
    ...defaultTrades
  ]));

  if (!isOpen) return null;

  const handleTrackLocation = () => {
    setIsTracking(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setLocation(`GPS: ${lat}° N, ${lng}° W`);
          setIsTracking(false);
        },
        () => {
          setLocation('Level 3 – Grid A-4');
          setIsTracking(false);
        },
        { timeout: 3000 }
      );
    } else {
      setLocation('Level 3 – Grid A-4');
      setIsTracking(false);
    }
  };

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setUploadedPhotos((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedProject = projects.find((p) => p.id === selectedProjectId) || project;
    const finalTrade = isCustomTrade && customTrade.trim() ? customTrade.trim() : trade;

    onCreate({
      title: title.trim(),
      location: location.trim() || 'Jobsite Area',
      description: description.trim() || 'Punch list item description',
      priority,
      status: 'Open',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projectId: selectedProjectId,
      projectName: matchedProject?.name || 'Snell Isle Residence',
      assignedTo: {
        id: `sub-${Date.now()}`,
        name: finalTrade,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade: finalTrade
      },
      photos: uploadedPhotos
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setDueDate('');
    setCustomTrade('');
    setIsCustomTrade(false);
    setUploadedPhotos([]);
    onClose();
  };

  const activeProjectName = projects.find(p => p.id === selectedProjectId)?.name || project?.name || 'Project';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 font-sans animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] mx-auto bg-white border border-[#E2E8F0] rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up"
      >
        
        {/* Hidden File Input for Multiple Photo Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Fixed Header */}
        <div className="px-5 py-3.5 border-b border-[#EAEDF1] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                New Punch Item
              </h3>
              <p className="text-xs text-[#64748B] font-medium truncate mt-0.5">
                {activeProjectName} · Quality Defect Notice
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3.5 text-xs">
            
            {/* 1. Title * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#334155]">
                Title <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Crack in concrete column"
                className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            {/* 2. Project * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#334155]">
                Project <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 pr-8 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all appearance-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* 3. Subcontractor / Trade * & Priority (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-xs font-semibold text-[#334155] truncate">
                  Subcontractor / Trade <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={isCustomTrade ? '__custom__' : trade}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomTrade(true);
                      } else {
                        setIsCustomTrade(false);
                        setTrade(e.target.value);
                      }
                    }}
                    className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 pr-8 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all appearance-none cursor-pointer truncate"
                  >
                    {tradeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="__custom__">+ Other (Type custom)...</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Priority</label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 pr-8 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all appearance-none cursor-pointer"
                  >
                    {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom Subcontractor / Trade Input (if selected) */}
            {isCustomTrade && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-[#1677FF]">
                  Custom Subcontractor / Trade Name <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customTrade}
                  onChange={(e) => setCustomTrade(e.target.value)}
                  placeholder="e.g. Acme Tile & Masonry"
                  className="w-full h-10 bg-white border border-[#1677FF] rounded-xl px-3 text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 transition-all"
                />
              </div>
            )}

            {/* 4. Location & Due Date (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Location</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Level 3 – Grid A-4"
                    className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl pl-3 pr-9 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all placeholder:text-[#94A3B8]"
                  />
                  <button
                    type="button"
                    onClick={handleTrackLocation}
                    className={`absolute right-2.5 p-1 text-[#1677FF] hover:text-[#0958D9] cursor-pointer rounded-md hover:bg-[#F0F7FF] transition-colors ${
                      isTracking ? 'animate-spin' : ''
                    }`}
                    title="Detect GPS location"
                  >
                    <LocateFixed className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#334155]">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all"
                />
              </div>
            </div>

            {/* 5. Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#334155]">Description / Rectification Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe issue, location details, repair requirements..."
                className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all resize-none placeholder:text-[#94A3B8]"
              />
            </div>

            {/* 6. Photos (Unified Multi-Photo Upload) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#334155]">
                  Evidence Photos {uploadedPhotos.length > 0 && <span className="text-[#1677FF] font-bold">({uploadedPhotos.length})</span>}
                </label>
                <span className="text-[11px] text-[#64748B]">
                  {uploadedPhotos.length > 0 ? 'Multiple photos attached' : 'Optional · Attach defect images'}
                </span>
              </div>
              
              {/* If no photos uploaded yet: Single clean dashed upload box */}
              {uploadedPhotos.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#1677FF] bg-[#F0F7FF]'
                      : 'border-[#CBD5E1] hover:border-[#1677FF] bg-[#F8FAFC] hover:bg-[#F0F7FF]/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-[#1E293B] block">
                      Click to upload or drag photos here
                    </span>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      Select one or multiple photos (JPG, PNG, WEBP)
                    </span>
                  </div>
                </div>
              ) : (
                /* When photos are uploaded: Clean thumbnail gallery with inline Add tile */
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="flex items-center gap-2.5 flex-wrap p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"
                >
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-[#CBD5E1] bg-slate-900 shrink-0 shadow-xs">
                      <img
                        src={url}
                        alt={`evidence-${idx}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(idx);
                        }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        title="Remove photo"
                      >
                        <X className="w-2.5 h-2.5 stroke-[2.5]" />
                      </button>
                    </div>
                  ))}

                  {/* Clean Inline + Add More Tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-lg border-2 border-dashed border-[#CBD5E1] hover:border-[#1677FF] bg-white hover:bg-[#F0F7FF] flex flex-col items-center justify-center gap-0.5 text-[#64748B] hover:text-[#1677FF] transition-all cursor-pointer shrink-0"
                    title="Add more photos"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span className="text-[9px] font-bold">Add</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Fixed Footer: Pinned at bottom with clear visual hierarchy */}
          <div className="px-5 py-3.5 border-t border-[#EAEDF1] bg-[#F8FAFC] shrink-0 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Item</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

