import React from 'react';
import { Project } from '../../types';
import { 
  X, CloudRain, Sun, CloudLightning, Calendar, 
  FileText, AlertTriangle, ArrowRight, ShieldCheck 
} from 'lucide-react';

interface WeatherImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onOpenSchedule: () => void;
  onOpenDailyLog: () => void;
}

export const WeatherImpactModal: React.FC<WeatherImpactModalProps> = ({
  isOpen,
  onClose,
  project,
  onOpenSchedule,
  onOpenDailyLog,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Site Weather & Delay Impact
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {project.weather?.locationName || project.cityState || 'Tampa, FL'} · Field Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Day Site Outlook */}
        <div>
          <label className="text-xs text-[#64748B] block mb-2 font-semibold uppercase tracking-wider text-[10px]">
            3-Day Atmospheric Forecast
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Wed */}
            <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center text-center gap-1">
              <span className="text-[10px] font-bold text-[#64748B]">WED · TODAY</span>
              <Sun className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#0F172A]">84°F</span>
              <span className="text-[10px] font-medium text-[#10A976]">0% Rain</span>
            </div>

            {/* Thu - Alert */}
            <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/50 flex flex-col items-center text-center gap-1 shadow-xs ring-1 ring-[#F59E0B]/30">
              <span className="text-[10px] font-bold text-[#D97706]">THU · ALERT</span>
              <CloudLightning className="w-5 h-5 text-[#D97706] animate-pulse" />
              <span className="text-xs font-bold text-[#92400E]">79°F</span>
              <span className="text-[10px] font-bold text-[#E5484D]">85% Heavy Rain</span>
            </div>

            {/* Fri */}
            <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center text-center gap-1">
              <span className="text-[10px] font-bold text-[#64748B]">FRI · CLEAR</span>
              <Sun className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#0F172A]">82°F</span>
              <span className="text-[10px] font-medium text-[#10A976]">10% Rain</span>
            </div>
          </div>
        </div>

        {/* Work Impact Analysis Card */}
        <div className="p-3 rounded-2xl bg-[#FFF7E6] border border-[#F59E0B]/30 flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#B45309] font-bold">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>High Impact Risk: Concrete Pour</span>
          </div>
          <p className="text-[#92400E] leading-relaxed text-xs">
            Heavy precipitation during Thursday's scheduled 8:00 AM slab pour will cause surface wash-out and water-cement ratio compromise. Pier drilling will also experience trench cave-in risk.
          </p>
          <div className="pt-2 border-t border-[#F59E0B]/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#B45309]">Recommended Mitigation:</span>
            <span className="font-bold text-[#0F172A]">Shift pour to Friday 7:30 AM</span>
          </div>
        </div>

        {/* OSHA & Site Safety Check */}
        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#1677FF] shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-[#0F172A] block leading-tight">OSHA Weather Safety Protocol</span>
            <span className="text-xs text-[#64748B] block mt-0.5 leading-tight">
              Trench pumps staged • Tie-down high-wind scaffolding
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#F1F5F9]">
          <button
            onClick={() => {
              onClose();
              onOpenSchedule();
            }}
            className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Adjust Schedule & Milestones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDailyLog();
            }}
            className="w-full h-10 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#10A976]" />
            <span>Record Weather Delay in Daily Log</span>
          </button>
        </div>

      </div>
    </div>
  );
};
