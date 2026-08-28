import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Camera, Eye, MapPin, Image as ImageIcon } from 'lucide-react';
import { FilterPills } from '../common/FilterPills';

interface ProjectPhotosTabProps {
  project: Project;
  photos: SitePhoto[];
  onUploadPhoto: () => void;
  onPreviewPhoto: (photo: SitePhoto) => void;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80';

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
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{filteredPhotos.length} {filteredPhotos.length === 1 ? 'Photo' : 'Photos'}</p>
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

      {/* ─── 3. TRUE GALLERY GRID (Clean Visual Focus, No Text Clutter Over Photos) ─── */}
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
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-[#142036] hover:border-blue-500/50 transition-all bg-[#070D1A] shadow-md active:scale-[0.98]"
            >
              {/* Clean Photo Thumbnail */}
              <img
                src={photo.url}
                alt={photo.caption}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
                }}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />

              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Top Category Tag (Minimal Glass Pill) */}
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-cyan-300 border border-white/10 shadow-sm">
                  {photo.category}
                </span>
              </div>

              {/* Hover Center Eye Action */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Minimal Info Strip (Gallery Aesthetic) */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 flex items-end justify-between gap-1 text-[10px] text-slate-300 font-medium pointer-events-none">
                <span className="truncate max-w-[65%] text-white font-semibold drop-shadow-sm">
                  {photo.caption}
                </span>
                <span className="text-slate-400 text-[10px] flex-shrink-0 drop-shadow-sm">
                  {photo.timestamp.split(',')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
