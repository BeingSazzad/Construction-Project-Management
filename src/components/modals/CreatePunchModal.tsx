import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, Priority } from '../../types';
import { X, Camera, CheckCircle2, Plus, LocateFixed, UploadCloud } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreatePunchModalProps {
  isOpen: boolean;
  projects?: Project[];
  project?: Project | null;
  onClose: () => void;
  onCreate: (item: Partial<PunchItem>) => void;
}

export const CreatePunchModal: React.FC<CreatePunchModalProps> = ({
  isOpen,
  projects = [],
  project,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || projects[0]?.id || 'proj-1');
  const [description, setDescription] = useState('');
  const [trade, setTrade] = useState('Concrete Solutions Inc.');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [project, projects, isOpen]);

  if (!isOpen) return null;

  const handleTrackLocation = () => {
    setIsTracking(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setLocation(`GPS: ${lat}° N, ${lng}° W (Sector B)`);
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

    onCreate({
      title: title.trim(),
      location: location.trim() || 'Jobsite Area',
      description: description.trim() || 'Punch list item description',
      priority,
      status: 'Open',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projectId: selectedProjectId,
      projectName: matchedProject?.name || 'Project',
      assignedTo: {
        id: `sub-${Date.now()}`,
        name: trade,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade
      },
      photos: uploadedPhotos
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setDueDate('');
    setUploadedPhotos([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] mx-auto bg-white border border-[#DDE1E7] p-4.5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
        
        {/* Hidden File Input for Multiple Photo Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1] mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                New Punch Item
              </h3>
              <p className="text-[11px] text-[#68707C] font-medium truncate">
                {projects.find(p => p.id === selectedProjectId)?.name || project?.name || 'Log quality defect'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          
          {/* 1. Title * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F] text-[11px]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Crack in concrete column"
              className="w-full h-9.5 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs font-medium focus:outline-hidden focus:border-[#1677FF] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          {/* 2. Project Assignment * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F] text-[11px]">Project *</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={(v) => setSelectedProjectId(v)}
              options={
                projects.length > 0
                  ? projects.map((p) => ({ value: p.id, label: p.name }))
                  : [{ value: 'proj-1', label: project?.name || 'Snell Isle Residence' }]
              }
              size="md"
            />
          </div>

          {/* 3. Subcontractor / Trade * & Priority */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F] text-[11px]">Subcontractor / Trade *</label>
              <CustomSelect
                value={trade}
                onChange={setTrade}
                options={[
                  'Concrete Solutions Inc.',
                  'Craft Drywall LLC',
                  'Prime Finishes Co.',
                  'FlowTech Plumbing',
                  'Climate HVAC Mechanical',
                  'Apex Glazing & Waterproofing',
                  'ProShield Firestopping',
                  'Steel Masters LLC'
                ]}
                size="md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F] text-[11px]">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
          </div>

          {/* 4. Location & Due Date */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F] text-[11px]">Location</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Level 3 – Grid A-4"
                  className="w-full h-9.5 bg-white border border-[#DDE1E7] rounded-xl pl-2.5 pr-7 text-[#171A1F] text-xs font-medium focus:outline-hidden focus:border-[#1677FF] transition-colors placeholder:text-[#94A3B8]"
                />
                <button
                  type="button"
                  onClick={handleTrackLocation}
                  className={`absolute right-2 text-[#1677FF] hover:text-[#0958D9] transition-colors cursor-pointer ${
                    isTracking ? 'animate-spin' : ''
                  }`}
                  title="Detect location"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F] text-[11px]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9.5 bg-white border border-[#DDE1E7] rounded-xl px-2.5 text-[#171A1F] text-xs font-medium focus:outline-hidden focus:border-[#1677FF] transition-colors"
              />
            </div>
          </div>

          {/* 5. Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F] text-[11px]">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe issue, location details, repair requirements..."
              className="w-full p-2.5 bg-white border border-[#DDE1E7] rounded-xl text-[#171A1F] text-xs font-medium focus:outline-hidden focus:border-[#1677FF] transition-colors resize-none placeholder:text-[#94A3B8]"
            />
          </div>

          {/* 6. Multiple Photos Upload & Gallery */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#171A1F] text-[11px]">
                Photos {uploadedPhotos.length > 0 ? `(${uploadedPhotos.length})` : '(Multiple)'}
              </label>
              <span className="text-[10px] text-[#64748B]">Attach one or more photos</span>
            </div>
            
            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] hover:border-[#1677FF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold text-[#475569] hover:text-[#1677FF]"
              >
                <UploadCloud className="w-4 h-4 text-[#1677FF]" />
                <span>Choose Files</span>
              </button>

              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-medium text-[#64748B]"
              >
                <Camera className="w-3.5 h-3.5 text-[#64748B]" />
                <span>+ Sample Pic</span>
              </button>
            </div>

            {/* Photo Thumbnails */}
            {uploadedPhotos.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-[#E2E8F0]">
                    <img
                      src={url}
                      alt={`evidence-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="w-2.5 h-2.5 stroke-[3]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-1.5 pt-2 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-9.5 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#171A1F] font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-9.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Item</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
