import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, Priority, Subcontractor } from '../../types';
import { X, Camera, CheckCircle2, Plus, LocateFixed, UploadCloud, ChevronDown } from 'lucide-react';

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
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

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePhotos[uploadedPhotos.length % samplePhotos.length];
    setUploadedPhotos((prev) => [...prev, nextPhoto]);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] mx-auto bg-white border border-[#DDE1E7] rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
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
        <div className="px-4 py-3 border-b border-[#EAEDF1] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                New Punch Item
              </h3>
              <p className="text-[11px] text-[#64748B] font-medium truncate">
                {projects.find(p => p.id === selectedProjectId)?.name || project?.name || 'Log quality defect'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2.5 text-xs">
            
            {/* 1. Title * */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#334155] text-[11px]">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Crack in concrete column"
                className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg px-2.5 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#94A3B8]"
              />
            </div>

            {/* 2. Project * */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#334155] text-[11px]">Project *</label>
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg px-2.5 pr-8 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors appearance-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 3. Subcontractor / Trade * & Priority (2 columns) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#334155] text-[11px]">Subcontractor / Trade *</label>
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
                    className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg px-2.5 pr-7 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors appearance-none cursor-pointer truncate"
                  >
                    {tradeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="__custom__">+ Other (Type custom)...</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#334155] text-[11px]">Priority</label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg px-2.5 pr-7 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors appearance-none cursor-pointer"
                  >
                    {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom Subcontractor / Trade Input (if selected) */}
            {isCustomTrade && (
              <div className="flex flex-col gap-1 animate-fade-in">
                <label className="font-semibold text-[#1677FF] text-[11px]">Type Subcontractor / Trade Name</label>
                <input
                  type="text"
                  required
                  value={customTrade}
                  onChange={(e) => setCustomTrade(e.target.value)}
                  placeholder="e.g. Acme Tile & Masonry"
                  className="w-full h-8.5 bg-white border border-[#1677FF] rounded-lg px-2.5 text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1677FF] transition-colors"
                />
              </div>
            )}

            {/* 4. Location & Due Date (2 columns) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#334155] text-[11px]">Location</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Level 3 – Grid A-4"
                    className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg pl-2 pr-6 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#94A3B8]"
                  />
                  <button
                    type="button"
                    onClick={handleTrackLocation}
                    className={`absolute right-1.5 text-[#1677FF] hover:text-[#0958D9] cursor-pointer ${
                      isTracking ? 'animate-spin' : ''
                    }`}
                    title="Detect location"
                  >
                    <LocateFixed className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#334155] text-[11px]">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-8.5 bg-white border border-[#DDE1E7] rounded-lg px-2 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors"
                />
              </div>
            </div>

            {/* 5. Description */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#334155] text-[11px]">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe issue, location details, repair requirements..."
                className="w-full p-2 bg-white border border-[#DDE1E7] rounded-lg text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#1677FF] transition-colors resize-none placeholder:text-[#94A3B8]"
              />
            </div>

            {/* 6. Photos (Multiple) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#334155] text-[11px]">
                  Evidence Photos {uploadedPhotos.length > 0 ? `(${uploadedPhotos.length})` : '(Multiple)'}
                </label>
                <span className="text-[10px] text-[#64748B]">Attach one or more photos</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8.5 rounded-lg bg-[#F8FAFC] border border-dashed border-[#CBD5E1] hover:border-[#1677FF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold text-[#475569] hover:text-[#1677FF]"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Choose Files</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="h-8.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium text-[#64748B]"
                >
                  <Camera className="w-3 h-3 text-[#64748B]" />
                  <span>+ Sample Pic</span>
                </button>
              </div>

              {/* Uploaded Thumbnails */}
              {uploadedPhotos.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-[#E2E8F0] bg-slate-900">
                      <img
                        src={url}
                        alt={`evidence-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-2.5 h-2.5 stroke-[3]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Fixed Footer: Always pinned and 100% visible, never cut off */}
          <div className="px-4 py-3 border-t border-[#EAEDF1] bg-[#F8FAFC] shrink-0 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-8.5 rounded-lg bg-white border border-[#DDE1E7] hover:bg-slate-50 text-[#475569] text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-8.5 rounded-lg bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
