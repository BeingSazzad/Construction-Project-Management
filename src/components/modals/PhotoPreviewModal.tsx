import React from 'react';
import { SitePhoto } from '../../types';
import { X, MapPin, Calendar, User as UserIcon, Download, Tag } from 'lucide-react';

interface PhotoPreviewModalProps {
  photo: SitePhoto | null;
  onClose: () => void;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80';

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  photo,
  onClose
}) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-[#070D1A] border border-[#1E2E4A] p-4 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036] mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-cyan-400 px-2 py-0.5 rounded-lg border border-blue-500/25">
              {photo.category}
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[200px]">{photo.projectName}</span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
          >
            ✕
          </button>
        </div>

        {/* High-res Image with Robust Fail-safe Fallback */}
        <div className="rounded-2xl overflow-hidden mb-3 border border-[#142036] bg-[#050811] relative aspect-[4/3] flex items-center justify-center">
          <img
            src={photo.url || FALLBACK_PHOTO}
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Content */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h4 className="font-bold text-white leading-snug">{photo.caption}</h4>

          <div className="p-3 bg-[#050811] rounded-xl border border-[#142036] space-y-1.5 text-[12px] text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Location: <strong className="text-white">{photo.location}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Uploaded By: <strong className="text-slate-200">{photo.uploadedBy}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Timestamp: <strong className="text-slate-200">{photo.timestamp}</strong></span>
            </div>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {photo.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] bg-blue-500/10 text-cyan-300 px-2 py-0.5 rounded-lg border border-blue-500/20 font-semibold">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
            <button
              onClick={() => alert('Downloading original 4K photo asset...')}
              className="px-3 py-1.5 rounded-xl bg-[#0E1A33] hover:bg-[#142036] text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
