import React, { useState } from 'react';
import { DailyLogItem } from '../../types';
import { 
  ArrowLeft, Sun, Cloud, CloudRain, Wind, Flame, Snowflake, Calendar, 
  Users, Truck, Wrench, X, 
  FileText, Camera, ChevronRight, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface DailyLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: DailyLogItem | null;
  onEdit?: (log: DailyLogItem) => void;
}

export const DailyLogDetailModal: React.FC<DailyLogDetailModalProps> = ({
  isOpen,
  onClose,
  log,
  onEdit
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderWeatherIcon = (condition?: string) => {
    const c = (condition || '').toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />;
    if (c.includes('wind')) return <Wind className="w-4 h-4 text-teal-500 shrink-0" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-4 h-4 text-slate-500 shrink-0" />;
    if (c.includes('heat') || c.includes('hot')) return <Flame className="w-4 h-4 text-red-500 shrink-0" />;
    if (c.includes('snow') || c.includes('ice') || c.includes('freez')) return <Snowflake className="w-4 h-4 text-sky-400 shrink-0" />;
    return <Sun className="w-4 h-4 text-amber-500 shrink-0" />;
  };

  if (!isOpen || !log) return null;

  const cleanAuthorName = log.author ? log.author.replace(/\s*\([^)]*\)/g, '').trim() : 'John Smith';
  const authorInitials = cleanAuthorName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'JS';
  const role = log.authorRole || 'Superintendent';
  const dateFormatted = log.date.includes('Sep') ? `Tue, ${log.date}, 2026` : log.date;

  const deliveriesList = [
    ...(log.deliveries || []),
    ...(log.materialsReceived || [])
  ];
  const uniqueDeliveries = Array.from(new Set(deliveriesList)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center font-sans bg-black/45 backdrop-blur-xs animate-fade-in p-0 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-[440px] mx-auto min-h-screen sm:min-h-0 sm:max-h-[92vh] bg-white sm:border sm:border-[#E2E8F0] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#0F172A] relative"
      >
        {/* ─── Top Header Bar ─── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-white sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            Daily Log Details
          </h2>

          <button
            onClick={() => {
              if (onEdit) onEdit(log);
            }}
            className="text-xs font-bold text-[#1677FF] hover:underline cursor-pointer px-1 py-1"
          >
            Edit
          </button>
        </div>

        {/* ─── Scrollable Content ─── */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 pb-12 scrollbar-none">
          
          {/* Top Header Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80" 
                alt={log.projectName}
                className="w-11 h-11 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#0F172A] truncate leading-tight">
                  {log.projectName}
                </h3>
                <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
                  {log.address || '1840 Brightwaters Blvd NE · St. Petersburg, FL'}
                </p>
              </div>
            </div>

            {/* Clean Inline Date & Weather Row (No inner box borders) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#F1F5F9] text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-[#1677FF] shrink-0" />
                <span className="font-bold text-[#0F172A] truncate">
                  {dateFormatted}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {renderWeatherIcon(log.weather.condition)}
                <span className="font-bold text-[#64748B]">
                  {log.weather.temperature || '82°F'} · {log.weather.condition || 'Sunny'}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Work Completed */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
              <FileText className="w-4 h-4 text-[#1677FF]" />
              <span>Work Completed</span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed font-normal">
              {log.workSummary}
            </p>
          </div>

          {/* 2. Crew on Site (Clean Honest Direct Count) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block leading-tight">Crew on Site</span>
                <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Active workforce on project site</p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#1677FF] bg-[#EAF3FF] border border-[#1677FF]/20 px-3 py-1 rounded-full shadow-2xs">
              {log.totalHeadcount} workers on site
            </span>
          </div>

          {/* 3. Photos (3) */}
          {log.photos && log.photos.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                  <Camera className="w-4 h-4 text-[#1677FF]" />
                  <span>Photos ({log.photos.length})</span>
                </div>
                <button 
                  onClick={() => setSelectedImage(log.photos![0])}
                  className="text-xs font-bold text-[#1677FF] hover:underline cursor-pointer"
                >
                  View Full
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {log.photos.slice(0, 3).map((photoUrl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(photoUrl)}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100 group cursor-pointer shadow-2xs hover:border-[#1677FF]/40 transition-all"
                  >
                    <img 
                      src={photoUrl} 
                      alt={`Site Progress ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incident Alert - ONLY shown when an incident actually occurred */}
          {Boolean(
            log.safetyPassed === false || 
            (log.safetyIncidents && 
             !log.safetyIncidents.toLowerCase().includes('0 incident') && 
             !log.safetyIncidents.toLowerCase().includes('zero incident') && 
             !log.safetyIncidents.toLowerCase().includes('no incident') && 
             !log.safetyIncidents.toLowerCase().includes('daily morning safety briefing'))
          ) && (
            <div className="bg-rose-50/70 rounded-2xl border border-rose-200 p-4 shadow-2xs space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Safety Incident Reported</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                  Incident
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-normal bg-white/80 border border-rose-200 rounded-xl p-2.5">
                {log.safetyIncidents}
              </p>
            </div>
          )}

          {/* 5. Additional Details */}
          {(log.visitors || uniqueDeliveries.length > 0 || log.equipment || log.status) && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <FileText className="w-4 h-4 text-[#1677FF]" />
                <span>Site Activity & Details</span>
              </div>

              <div className="divide-y divide-[#F1F5F9] text-xs">
                {/* Deliveries */}
                {uniqueDeliveries.length > 0 && (
                  <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[#0F172A] block leading-tight">Deliveries Received</span>
                      <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                        {uniqueDeliveries.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Visitor */}
                {log.visitors && (
                  <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[#0F172A] block leading-tight">Visitors & Inspectors</span>
                      <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                        {log.visitors}
                      </p>
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {log.equipment && (
                  <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[#0F172A] block leading-tight">Equipment on Site</span>
                      <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                        {log.equipment}
                      </p>
                    </div>
                  </div>
                )}

                {/* Issue / Delay */}
                {log.status && (
                  <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-amber-800 block leading-tight">Issue / Delay Recorded</span>
                      <p className="text-xs text-amber-900 font-normal leading-relaxed mt-0.5">
                        {log.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. Reported By Footer */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#1677FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {authorInitials}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block leading-none">
                Reported by
              </span>
              <p className="text-xs font-bold text-[#0F172A] leading-tight mt-0.5">
                {cleanAuthorName} <span className="text-[#64748B] font-normal">• {role}</span>
              </p>
            </div>
          </div>

        </div>

        {/* ─── Lightbox Modal for Photo Zoom ─── */}
        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in cursor-pointer"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
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
