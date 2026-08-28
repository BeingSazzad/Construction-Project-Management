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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="card-dark w-full max-w-[390px] bg-[#070D1A] border border-[#142036] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100 scrollbar-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#142036] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                New Punch Item
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                {project?.name || 'Log defect or inspection item'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* 1. Title * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HVAC ductwork sealing check"
              className="w-full h-11 bg-[#050811] border border-[#142036] rounded-xl px-3.5 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          {/* 2. Project * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Project *</label>
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
            <label className="font-bold text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe defect, trade issue, or inspection notes..."
              className="w-full p-3 bg-[#050811] border border-[#142036] rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-500"
            />
          </div>

          {/* 4. Row 1: Trade * & Priority (2-Column Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Trade * */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300">Trade *</label>
              <CustomSelect
                value={trade}
                onChange={setTrade}
                options={['HVAC', 'Concrete', 'Framing', 'Plumbing', 'Electrical', 'Drywall']}
                size="md"
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
          </div>

          {/* 5. Row 2: Location (Moved Down on its own line per request) */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Location</label>
            <div className="relative flex items-center">
              <LocateFixed className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Level 12 Deck - Grid B3"
                className="w-full h-11 bg-[#050811] border border-[#142036] rounded-xl pl-9 pr-9 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={handleTrackLocation}
                className={`absolute right-2.5 p-1 text-blue-400 hover:text-cyan-300 transition-colors cursor-pointer ${
                  isTracking ? 'animate-spin text-cyan-400' : ''
                }`}
                title="Auto-detect current GPS location"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6. Photos Upload & Thumbnails Section */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-300">Evidence Photos</label>
            
            {/* Camera Upload Dropzone */}
            <div
              onClick={handleAddSamplePhoto}
              className="p-3.5 rounded-2xl bg-[#050811] border border-dashed border-[#142036] hover:border-blue-500/80 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center group"
            >
              <Camera className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
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
                      className="w-13 h-13 rounded-xl object-cover border border-[#142036] shadow"
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

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full btn-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
