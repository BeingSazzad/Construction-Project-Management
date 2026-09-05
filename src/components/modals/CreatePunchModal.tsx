import React, { useState } from 'react';
import { Project, PunchItem, Priority } from '../../types';
import { X, Camera, CheckCircle2, Plus, LocateFixed } from 'lucide-react';
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
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || 'proj-1');
  const [description, setDescription] = useState('');
  const [trade, setTrade] = useState('HVAC');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  if (!isOpen) return null;

  const handleTrackLocation = () => {
    setIsTracking(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setLocation(`GPS: ${lat}° N, ${lng}° W (Jobsite Sector B)`);
          setIsTracking(false);
        },
        () => {
          setLocation('GPS: 40.7128° N, 74.0060° W (Level 12 Deck)');
          setIsTracking(false);
        },
        { timeout: 3000 }
      );
    } else {
      setLocation('GPS: 40.7128° N, 74.0060° W (Level 12 Deck)');
      setIsTracking(false);
    }
  };

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePhotos[uploadedPhotos.length % samplePhotos.length];
    setUploadedPhotos(prev => [...prev, nextPhoto]);
  };

  const handleRemovePhoto = (idx: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      location: location.trim() || 'Jobsite Area',
      description: description.trim() || 'Punch list item description',
      priority,
      status: 'Open',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projectId: selectedProjectId,
      assignedTo: {
        id: `sub-${Date.now()}`,
        name: `${trade} Subcontractor`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade
      },
      photos: uploadedPhotos.length > 0 ? uploadedPhotos : ['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80']
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setUploadedPhotos([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                New Punch Item
              </h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5 truncate">
                {project?.name || 'Log defect or inspection item'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* 1. Title * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HVAC ductwork sealing check"
              className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#8F95B2]"
            />
          </div>

          {/* 2. Project * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Project *</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={(v) => setSelectedProjectId(v)}
              options={
                projects.length > 0
                  ? projects.map((p) => ({ value: p.id, label: p.name }))
                  : [{ value: 'proj-1', label: project?.name || 'Riverside Office Complex' }]
              }
              size="md"
            />
          </div>

          {/* 3. Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe defect, trade issue, or inspection notes..."
              className="w-full p-3 bg-white border border-[#DDE1E7] rounded-xl text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors resize-none placeholder:text-[#8F95B2]"
            />
          </div>

          {/* 4. Row 1: Trade * & Priority (2-Column Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Trade * */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F]">Trade *</label>
              <CustomSelect
                value={trade}
                onChange={setTrade}
                options={['HVAC', 'Concrete', 'Framing', 'Plumbing', 'Electrical', 'Drywall']}
                size="md"
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F]">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
          </div>

          {/* 5. Row 2: Location */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Location</label>
            <div className="relative flex items-center">
              <LocateFixed className="w-4 h-4 text-[#68707C] absolute left-3 pointer-events-none" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Level 12 Deck - Grid B3"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-9 pr-9 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#8F95B2]"
              />

              <button
                type="button"
                onClick={handleTrackLocation}
                className={`absolute right-2.5 p-1 text-[#1677FF] hover:text-[#0958D9] transition-colors cursor-pointer ${
                  isTracking ? 'animate-spin' : ''
                }`}
                title="Auto-detect current GPS location"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6. Photos Upload & Thumbnails Section */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#171A1F]">Evidence Photos</label>
            
            {/* Camera Upload Dropzone */}
            <div
              onClick={handleAddSamplePhoto}
              className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-dashed border-[#DDE1E7] hover:border-[#1677FF]/80 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center group"
            >
              <Camera className="w-5 h-5 text-[#68707C] group-hover:text-[#1677FF] transition-colors" />
              <span className="text-xs font-bold text-[#68707C] group-hover:text-[#171A1F] transition-colors">
                Tap to attach inspection photos
              </span>
            </div>

            {/* Uploaded Thumbnails with Red (X) Badges */}
            {uploadedPhotos.length > 0 && (
              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`evidence-${idx}`}
                      className="w-13 h-13 rounded-xl object-cover border border-[#DDE1E7] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#171A1F] font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
