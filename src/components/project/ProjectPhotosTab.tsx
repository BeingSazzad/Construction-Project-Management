import React, { useState } from 'react';
import { Project, SitePhoto } from '../../types';
import { Camera, Plus, MapPin, Tag, Calendar, Eye } from 'lucide-react';

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
    <div className="flex flex-col gap-4 pb-24">
      {/* Category Pills & Upload Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onUploadPhoto}
          className="h-9 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Grid of Site Photos (2 columns on mobile) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onPreviewPhoto(photo)}
            className="card-dark overflow-hidden group cursor-pointer border-[#1E2E4A] hover:border-cyan-400/50 transition-all flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden bg-[#0A0E18]">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold text-cyan-300 border border-white/10">
                {photo.category}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>

            <div className="p-2.5 flex flex-col flex-1 bg-[#111827]">
              <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{photo.caption}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{photo.location}</span>
              </p>
              <div className="mt-auto text-xs text-slate-400 flex items-center justify-between border-t border-[#1C2A44] pt-1.5 font-medium">
                <span>{photo.uploadedBy}</span>
                <span>{photo.timestamp.split(',')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
