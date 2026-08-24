import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Button } from '../common/Button';
import { X, Camera, Upload, MapPin, Tag, CheckCircle2 } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onUpload: (photo: Partial<SitePhoto>) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  project,
  onClose,
  onUpload
}) => {
  const [caption, setCaption] = useState('Deck rebar and electrical conduit rough-in pre-pour check');
  const [location, setLocation] = useState('Level 12 Deck - Grid B3');
  const [category, setCategory] = useState<SitePhoto['category']>('Progress');
  const [selectedImg, setSelectedImg] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      caption,
      location,
      category,
      url: selectedImg,
      timestamp: 'Just now',
      uploadedBy: 'John Smith (Superintendent)',
      tags: ['Site Log', category],
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Riverside Office Complex'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Upload Site Photo</h3>
              <p className="text-[10px] text-cyan-400">{project?.name || 'Active Project'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-[#23334F] bg-[#090D17]">
          <img
            src={selectedImg}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>GPS: 40.7128° N, 74.0060° W</span>
          </div>

          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[9px] text-slate-300 font-mono">
            4K UHD • 12.4 MB
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-300 mb-1 block">Caption / Inspection Note</label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Jobsite Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Site Photos">Site Photos</option>
                <option value="Progress">Progress</option>
                <option value="Inspections">Inspections</option>
                <option value="Safety">Safety</option>
                <option value="Punch List">Punch List</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" leftIcon={<Upload className="w-4 h-4" />}>
              Save to Site Documentation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
