import React, { useState } from 'react';
import { DailyLogItem } from '../../types';
import { 
  ArrowLeft, Building2, Sun, Cloud, CloudRain, 
  Users, Truck, HardHat, Wrench, X, Phone
} from 'lucide-react';

interface DailyLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: DailyLogItem | null;
}

export const DailyLogDetailModal: React.FC<DailyLogDetailModalProps> = ({
  isOpen,
  onClose,
  log
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !log) return null;

  const getWeatherIcon = (cond?: string) => {
    const c = (cond || '').toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-4 h-4 text-[#1677FF]" />;
    if (c.includes('cloud')) return <Cloud className="w-4 h-4 text-[#68707C]" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  const deliveriesList = log.deliveries || [];
  const cleanAuthorName = log.author.replace(/\s*\([^)]*\)/g, '').trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans bg-black/40 backdrop-blur-sm animate-fade-in p-0 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-[440px] min-h-screen sm:min-h-0 sm:max-h-[92vh] bg-white sm:border sm:border-[#DDE1E7] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#171A1F] relative"
      >
        {/* ─── Top Header Bar ─── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#EAEDF1] bg-white sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] flex items-center justify-center text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">
            Daily Log Details
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] flex items-center justify-center text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Single-Surface Breathable Content ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24 divide-y divide-[#EAEDF1]">
          
          {/* 1. Project & Metric Overview Header */}
          <div className="space-y-3 pb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#1677FF] flex-shrink-0">
                <Building2 className="w-5 h-5 text-[#1677FF]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[#171A1F] truncate leading-tight">
                  {log.projectName}
                </h3>
                <p className="text-xs text-[#68707C] font-medium mt-0.5">
                  {log.date}
                </p>
              </div>
            </div>

            {/* Flat Clean Key Metrics Strip */}
            <div className="flex items-center justify-between py-2 border-t border-[#EAEDF1] text-xs">
              <div className="flex items-center gap-1.5 text-[#171A1F] font-semibold">
                {getWeatherIcon(log.weather.condition)}
                <span>{log.weather.temperature} · {log.weather.condition}</span>
              </div>
              <span className="text-[#DDE1E7]">|</span>
              <div className="flex items-center gap-1.5 text-[#171A1F] font-semibold">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{log.totalHeadcount} Workers</span>
              </div>
              <span className="text-[#DDE1E7]">|</span>
              <div className="flex items-center gap-1.5 text-[#171A1F] font-semibold">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>{deliveriesList.length} Deliveries</span>
              </div>
            </div>
          </div>

          {/* 2. Notes & Work Summary (Clean reading text, no box) */}
          <div className="pt-3.5 space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#68707C] block">
              Notes & Work Summary
            </span>
            <p className="text-xs text-[#171A1F] leading-relaxed font-normal whitespace-pre-wrap">
              {log.workSummary}
            </p>
          </div>

          {/* 3. Site Logistics & Activity (Clean Key-Value Rows) */}
          {(log.visitors || log.equipment || deliveriesList.length > 0) && (
            <div className="pt-3.5 space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#68707C] block">
                Site Operations & Logistics
              </span>

              <div className="space-y-2 text-xs divide-y divide-[#EAEDF1]">
                {/* Visitors */}
                {log.visitors && (
                  <div className="flex items-start justify-between gap-3 pt-1.5 first:pt-0">
                    <span className="text-[#68707C] flex items-center gap-1.5 flex-shrink-0">
                      <HardHat className="w-3.5 h-3.5 text-purple-600" />
                      Visitors:
                    </span>
                    <span className="text-right text-[#171A1F] font-medium">
                      {log.visitors}
                    </span>
                  </div>
                )}

                {/* Equipment */}
                {log.equipment && (
                  <div className="flex items-start justify-between gap-3 pt-1.5 first:pt-0">
                    <span className="text-[#68707C] flex items-center gap-1.5 flex-shrink-0">
                      <Wrench className="w-3.5 h-3.5 text-[#1677FF]" />
                      Equipment:
                    </span>
                    <span className="text-right text-[#171A1F] font-medium">
                      {log.equipment}
                    </span>
                  </div>
                )}

                {/* Deliveries List */}
                {deliveriesList.length > 0 && (
                  <div className="flex items-start justify-between gap-3 pt-1.5 first:pt-0">
                    <span className="text-[#68707C] flex items-center gap-1.5 flex-shrink-0">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      Deliveries:
                    </span>
                    <span className="text-right text-[#171A1F] font-medium">
                      {deliveriesList.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Site Photos Grid */}
          {log.photos && log.photos.length > 0 && (
            <div className="pt-3.5 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#68707C] block">
                Site Photos ({log.photos.length})
              </span>
              <div className="grid grid-cols-3 gap-2">
                {log.photos.map((photoUrl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(photoUrl)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#EAEDF1] bg-[#F2F2F7] group cursor-pointer"
                  >
                    <img 
                      src={photoUrl} 
                      alt={`Site ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ─── Bottom Sticky Reporter Bar ─── */}
        <div className="p-3.5 border-t border-[#EAEDF1] bg-white absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1677FF] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {cleanAuthorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#68707C]">Reported By</p>
              <h4 className="text-xs font-bold text-[#171A1F]">{cleanAuthorName}</h4>
            </div>
          </div>

          <a
            href="tel:+15555678901"
            className="w-8 h-8 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#1677FF] flex items-center justify-center transition-colors cursor-pointer"
            title="Call Superintendent"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* ─── Lightbox Modal for Photo Zoom ─── */}
        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in cursor-pointer"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedImage} 
              alt="Site Preview" 
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" 
            />
          </div>
        )}

      </div>
    </div>
  );
};
