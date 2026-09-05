import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Camera, Eye, Image as ImageIcon } from 'lucide-react';
import { FilterPills } from '../common/FilterPills';

interface ProjectPhotosTabProps {
  project: Project;
  photos: SitePhoto[];
  onUploadPhoto: () => void;
  onPreviewPhoto: (photo: SitePhoto) => void;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80';

export const ProjectPhotosTab: React.FC<ProjectPhotosTabProps> = ({
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
    <div className="w-full flex-1 flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Site Photo Gallery</h2>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">{filteredPhotos.length} {filteredPhotos.length === 1 ? 'Photo' : 'Photos'}</p>
        </div>

        <button
          onClick={onUploadPhoto}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all flex-shrink-0"
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

      {/* ─── 3. TRUE GALLERY GRID ─── */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-[#DDE1E7] text-center mt-2 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-[#171A1F]">No photos in {activeCategory}</h4>
          <p className="text-xs text-[#68707C] mt-1 max-w-[220px]">Upload site progress photos to document project milestones.</p>
          <button
            onClick={onUploadPhoto}
            className="mt-4 px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onPreviewPhoto(photo)}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-[#DDE1E7] hover:border-[#1677FF]/50 transition-all bg-white shadow-xs active:scale-[0.98]"
            >
              {/* Clean Photo Thumbnail */}
              <img
                src={photo.url}
                alt={photo.caption}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Top Category Tag (Minimal Glass Pill) */}
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-white border border-white/20 shadow-xs">
                  {photo.category}
                </span>
              </div>

              {/* Hover Center Eye Action */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#171A1F] flex items-center justify-center border border-white/40 shadow-md">
                  <Eye className="w-4 h-4 text-[#1677FF]" />
                </div>
              </div>

              {/* Bottom Info Strip */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 z-10 flex items-end justify-between gap-1 text-[10px] text-white font-medium pointer-events-none">
                <span className="truncate max-w-[65%] text-white font-semibold drop-shadow-sm">
                  {photo.caption}
                </span>
                <span className="text-white/80 text-[10px] flex-shrink-0 drop-shadow-sm">
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
