import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Camera, Plus, MapPin, Tag, Calendar, Eye, Image as ImageIcon } from 'lucide-react';

interface ProjectPhotosTabProps {
  project: Project;
  photos: SitePhoto[];
  onUploadPhoto: () => void;
  onPreviewPhoto: (photo: SitePhoto) => void;
}

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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Upload Action */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Site Photo Gallery</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{photos.length} Captured Progress Photos</p>
        </div>

        <button
          onClick={onUploadPhoto}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all flex-shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-600/25'
                  : 'bg-[#070D1A] border-[#142036] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Grid of Site Photos (2 columns) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onPreviewPhoto(photo)}
            className="rounded-2xl overflow-hidden group cursor-pointer border border-[#142036] hover:border-blue-500/50 transition-all flex flex-col bg-[#070D1A] shadow-sm active:scale-[0.98]"
          >
            <div className="relative aspect-square overflow-hidden bg-[#050811]">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 bg-[#060913]/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-cyan-300 border border-white/10">
                {photo.category}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1 bg-[#070D1A]">
              <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                {photo.caption}
              </h4>
              <p className="text-[12px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span className="truncate">{photo.location}</span>
              </p>
              <div className="mt-auto text-[10px] text-slate-500 flex items-center justify-between border-t border-[#142036] pt-2 mt-2 font-medium">
                <span className="truncate max-w-[60%]">{photo.uploadedBy}</span>
                <span>{photo.timestamp.split(',')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
