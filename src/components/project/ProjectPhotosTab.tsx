import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Camera, Plus, MapPin, Eye, Image as ImageIcon } from 'lucide-react';
import { FilterPills } from '../common/FilterPills';

interface ProjectPhotosTabProps {
  project: Project;
  photos: SitePhoto[];
  onUploadPhoto: () => void;
  onPreviewPhoto: (photo: SitePhoto) => void;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80';

export const ProjectPhotosTab: React.FC<ProjectPhotosTabProps> = ({
  project,
  photos,
  onUploadPhoto,
  onPreviewPhoto
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Site Photos', 'Progress', 'Inspections', 'Safety'];

  const filteredPhotos = photos.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Site Photo Gallery</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{filteredPhotos.length} {filteredPhotos.length === 1 ? 'Photo' : 'Photos'} Captured</p>
        </div>

        <button
          onClick={onUploadPhoto}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all flex-shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* ─── 2. CATEGORY FILTER PILLS ─── */}
      <FilterPills
        options={categories}
        selected={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* ─── 3. PREMIUM GRID OF SITE PHOTOS (Clean Visual Hierarchy) ─── */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center mt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-white">No photos in {activeCategory}</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px]">Upload site progress photos to document project milestones.</p>
          <button
            onClick={onUploadPhoto}
            className="mt-4 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onPreviewPhoto(photo)}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer border border-[#142036] hover:border-blue-500/50 transition-all bg-[#070D1A] shadow-md active:scale-[0.98] flex flex-col justify-between"
            >
              {/* Image Background */}
              <img
                src={photo.url}
                alt=""
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Scrim for Top & Bottom readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/30 to-black/40 pointer-events-none" />

              {/* Top Category Badge */}
              <div className="relative z-10 p-2.5 flex items-start justify-between">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-cyan-300 border border-white/10 shadow-sm">
                  {photo.category}
                </span>

                <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-md text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bottom Caption & Location Overlay */}
              <div className="relative z-10 p-2.5 flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-white leading-tight truncate drop-shadow-sm group-hover:text-blue-300 transition-colors">
                  {photo.caption}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium pt-0.5">
                  <span className="flex items-center gap-1 truncate max-w-[65%]">
                    <MapPin className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{photo.location.split('-')[0].trim()}</span>
                  </span>
                  <span className="text-slate-400 text-[10px] flex-shrink-0">
                    {photo.timestamp.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
