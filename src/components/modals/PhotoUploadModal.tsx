import React, { useState, useRef } from 'react';
import { Project, SitePhoto } from '../../types';
import { X, Camera, Upload, RefreshCw, LocateFixed } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<SitePhoto['category']>('Progress');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
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
          // Fallback mock GPS coordinates for jobsite
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImg(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      caption: caption.trim() || 'Site Inspection Photo',
      location: location.trim() || 'Jobsite Area',
      category,
      url: selectedImg || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      uploadedBy: 'John Smith (Superintendent)',
      tags: ['Site Log', category],
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Riverside Office Complex'
    });
    setCaption('');
    setLocation('');
    setSelectedImg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                Upload Site Photo
              </h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5 truncate">
                {project?.name || 'Active Project'}
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

        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Interactive Photo Upload Dropzone Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative h-48 rounded-2xl overflow-hidden mb-4 border-2 border-dashed border-[#DDE1E7] hover:border-[#1677FF] bg-[#F7F8FA] cursor-pointer group transition-all flex flex-col items-center justify-center"
          title="Click to select photo file from your device"
        >
          {selectedImg ? (
            <>
              <img
                src={selectedImg}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Change Photo Hover Overlay Pill */}
              <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1677FF] border border-[#DDE1E7] flex items-center gap-1.5 shadow-md group-hover:bg-[#1677FF] group-hover:text-white transition-all">
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                <span>Change Photo</span>
              </div>
            </>
          ) : (
            /* Centered Clean Dropzone Placeholder */
            <div className="flex flex-col items-center justify-center gap-2.5 p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#171A1F] block group-hover:text-[#1677FF] transition-colors">
                  Tap or Drag to Upload Photo
                </span>
                <span className="text-xs text-[#68707C] font-medium block mt-0.5">
                  Supports JPG, PNG, WEBP image files
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Clean Upload Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Inspection Note Input */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Inspection Note *</label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter inspection note (e.g. Deck rebar rough-in check)"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#9DA5B1]"
            />
          </div>

          {/* Location & Category Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F]">Location</label>

              <div className="relative flex items-center">
                <LocateFixed className="w-4 h-4 text-[#68707C] absolute left-3 pointer-events-none" />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Level 12 Deck - Grid B3"
                  className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl pl-9 pr-9 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#9DA5B1]"
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

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#171A1F]">Category</label>
              <CustomSelect
                value={category}
                onChange={(v) => setCategory(v as any)}
                options={['Progress', 'Site Photos', 'Inspections', 'Safety', 'Punch List']}
                size="md"
              />
            </div>
          </div>

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-lg bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full btn-lg bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
