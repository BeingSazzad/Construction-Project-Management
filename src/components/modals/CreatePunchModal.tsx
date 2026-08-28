import React, { useState } from 'react';
import { Project, PunchItem, Priority } from '../../types';
import { X, Camera, MapPin, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
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
  const [title, setTitle] = useState('Facere in iusto ipsa');
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || 'proj-1');
  const [description, setDescription] = useState('Cumque excepturi con');
  const [trade, setTrade] = useState('HVAC');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState('Explicabo Necessita');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
  ]);

  if (!isOpen) return null;

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
      title,
      location,
      description,
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
      photos: uploadedPhotos
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-[#070D1A] border border-[#142036] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142036] bg-[#0A1020]">
          <h3 className="text-base font-bold text-white tracking-tight">New Punch Item</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[82vh]">
          
          {/* 1. Title * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Facere in iusto ipsa"
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* 2. Project * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Project *</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {projects.length > 0 ? (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              ) : (
                <option value="proj-1">{project?.name || 'Riverside Office Complex'}</option>
              )}
            </select>
          </div>

          {/* 3. Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cumque excepturi con..."
              className="w-full p-3 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-cyan-500 transition-colors resize-none placeholder:text-slate-600"
            />
          </div>

          {/* 4. 3-Column Grid: Trade *, Priority, Location */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Trade * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-300">Trade *</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="HVAC">HVAC</option>
                <option value="Concrete">Concrete</option>
                <option value="Framing">Framing</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Drywall">Drywall</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-300">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Level 12"
                className="w-full h-10 px-2.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* 5. Photos Upload & Thumbnails Section */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">Photos</label>
            
            {/* Camera Upload Dropzone */}
            <div
              onClick={handleAddSamplePhoto}
              className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-cyan-500/50 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center group"
            >
              <Camera className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                Add evidence photos
              </span>
            </div>

            {/* Uploaded Thumbnails with Red (X) Badges */}
            {uploadedPhotos.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap pt-1">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`evidence-${idx}`}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#1E2638] shadow"
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

          {/* 6. Primary Action Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-900/40 active:scale-[0.98] mt-2"
          >
            <span>Create Item</span>
          </button>
        </form>

      </div>
    </div>
  );
};
