import React from 'react';
import { SitePhoto } from '../../types';
import { X, MapPin, Calendar, Tag, User as UserIcon, Download } from 'lucide-react';

interface PhotoPreviewModalProps {
  photo: SitePhoto | null;
  onClose: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  photo,
  onClose
}) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[400px] bg-[#0E1524] border-cyan-500/40 p-4 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
              {photo.category}
            </span>
            <span className="text-xs font-bold text-white">{photo.projectName}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-res Image */}
        <div className="rounded-2xl overflow-hidden mb-3 border border-[#23334F] bg-black">
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-full h-auto max-h-[380px] object-contain mx-auto"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 text-xs">
          <h4 className="font-bold text-white leading-snug">{photo.caption}</h4>

          <div className="p-3 bg-[#0B101D] rounded-xl border border-[#172238] space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>Location: {photo.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Uploaded By: {photo.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Timestamp: {photo.timestamp}</span>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap pt-1">
            {photo.tags.map((t, idx) => (
              <span key={idx} className="text-[10px] bg-[#162033] text-cyan-300 px-2 py-0.5 rounded-md border border-[#223554]">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
