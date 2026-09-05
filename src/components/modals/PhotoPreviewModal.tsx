import React from 'react';
import { SitePhoto } from '../../types';
import { MapPin, Calendar, User as UserIcon, Download } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-white border border-[#DDE1E7] p-5 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1] mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF3FF] text-[#1677FF] px-2.5 py-0.5 rounded-lg border border-[#1677FF]/20">
              {photo.category}
            </span>
            <span className="text-xs font-bold text-[#171A1F] truncate max-w-[200px]">{photo.projectName}</span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
          >
            ✕
          </button>
        </div>

        {/* High-res Image with Robust Fail-safe Fallback */}
        <div className="rounded-2xl overflow-hidden mb-3 border border-[#DDE1E7] bg-[#F7F8FA] relative aspect-[4/3] flex items-center justify-center shadow-xs">
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
          <h4 className="font-bold text-[#171A1F] leading-snug">{photo.caption}</h4>

          <div className="p-3 bg-[#F7F8FA] rounded-xl border border-[#EAEDF1] space-y-1.5 text-[12px] text-[#68707C] font-medium">
            <div className="flex items-center gap-1.5 text-[#171A1F]">
              <MapPin className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
              <span>Location: <strong className="text-[#171A1F]">{photo.location}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-[#68707C] flex-shrink-0" />
              <span>Uploaded By: <strong className="text-[#171A1F]">{photo.uploadedBy}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#68707C] flex-shrink-0" />
              <span>Timestamp: <strong className="text-[#171A1F]">{photo.timestamp}</strong></span>
            </div>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {photo.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] bg-[#EAF3FF] text-[#1677FF] px-2 py-0.5 rounded-lg border border-[#1677FF]/20 font-semibold">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAEDF1] mt-1">
            <button
              onClick={() => alert('Downloading original photo asset...')}
              className="px-3.5 py-1.5 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
