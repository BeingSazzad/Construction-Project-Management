import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Sun, CloudRain, Users, ShieldCheck, 
  Plus, Calendar, HardHat, 
  FileText, Truck, Camera, Wrench
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';

interface ProjectDailyLogsTabProps {
  project: Project;
  dailyLogs?: DailyLogItem[];
  onAddDailyLog?: (log: DailyLogItem) => void;
}

export const ProjectDailyLogsTab: React.FC<ProjectDailyLogsTabProps> = ({
  project,
  dailyLogs = project.dailyLogs || [],
  onAddDailyLog
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(dailyLogs[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const selectedLog = dailyLogs.find(l => l.id === selectedLogId) || dailyLogs[0];

  const handleSaveNewLog = (newLog: DailyLogItem) => {
    if (onAddDailyLog) {
      onAddDailyLog(newLog);
    }
    setSelectedLogId(newLog.id);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* 1. Top Header & Action */}
      <div className="flex items-center justify-between border-b border-[#EAEDF1] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Daily Logs & Site Reports</h2>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">
            {project.name} · Field progress
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Log</span>
        </button>
      </div>

      {/* 2. Date Selector Pills */}
      {dailyLogs.length > 0 ? (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none py-0.5">
          {dailyLogs.map((log) => {
            const isSelected = log.id === (selectedLog?.id || selectedLogId);
            return (
              <button
                key={log.id}
                onClick={() => setSelectedLogId(log.id)}
                className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F2F2F7] border-[#DDE1E7]'
                }`}
              >
                <span>{log.date}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-[#DDE1E7] rounded-2xl flex flex-col items-center gap-2 shadow-xs">
          <Calendar className="w-8 h-8 text-[#9DA5B1]" />
          <p className="text-xs font-bold text-[#171A1F]">No daily logs recorded yet</p>
          <p className="text-[11px] text-[#68707C]">Click "+ New Log" to submit today's site report.</p>
        </div>
      )}

      {/* 3. Selected Log Display */}
      {selectedLog && (
        <div className="flex flex-col gap-3">
          {/* Weather & Site Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                {selectedLog.weather.condition?.toLowerCase().includes('rain') ? (
                  <CloudRain className="w-5 h-5 text-[#1677FF]" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider">Weather</span>
                <h4 className="text-xs font-bold text-[#171A1F] truncate mt-0.5">{selectedLog.weather.temperature}</h4>
                <p className="text-[11px] text-[#68707C] truncate">{selectedLog.weather.condition}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider">Labor</span>
                <h4 className="text-xs font-bold text-[#171A1F] truncate mt-0.5">{selectedLog.totalHeadcount} Workers</h4>
                <p className="text-[11px] text-emerald-700 font-semibold truncate">100% Attended</p>
              </div>
            </div>
          </div>

          {/* Work Completed Summary */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171A1F]">
              <FileText className="w-4 h-4 text-[#1677FF]" />
              <span>Work Progress Summary</span>
            </div>
            <p className="text-xs text-[#171A1F] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#EAEDF1] font-medium">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Site Operations: Deliveries, Equipment, Visitors */}
          {(selectedLog.deliveries || selectedLog.equipment || selectedLog.visitors) && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
                Site Operations & Logistics
              </span>

              {selectedLog.deliveries && selectedLog.deliveries.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#171A1F] bg-[#F7F8FA] p-2.5 rounded-xl border border-[#EAEDF1]">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#68707C] block font-semibold">Deliveries Received</span>
                    <span className="truncate">{selectedLog.deliveries.join(', ')}</span>
                  </div>
                </div>
              )}

              {selectedLog.equipment && (
                <div className="flex items-center gap-2 text-xs text-[#171A1F] bg-[#F7F8FA] p-2.5 rounded-xl border border-[#EAEDF1]">
                  <Wrench className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#68707C] block font-semibold">Machinery & Equipment Active</span>
                    <span className="truncate">{selectedLog.equipment}</span>
                  </div>
                </div>
              )}

              {selectedLog.visitors && (
                <div className="flex items-center gap-2 text-xs text-[#171A1F] bg-[#F7F8FA] p-2.5 rounded-xl border border-[#EAEDF1]">
                  <HardHat className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#68707C] block font-semibold">Site Visitors & Inspections</span>
                    <span className="truncate">{selectedLog.visitors}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Safety Compliance */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#171A1F] block">Safety Compliance</span>
                <span className="text-[11px] text-[#68707C]">{selectedLog.safetyIncidents}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Passed
            </span>
          </div>

          {/* Photos (if any) */}
          {selectedLog.photos && selectedLog.photos.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#171A1F]">
                <Camera className="w-4 h-4 text-[#1677FF]" />
                <span>Site Progress Photos ({selectedLog.photos.length})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {selectedLog.photos.map((photo, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-[#DDE1E7]">
                    <img src={photo} alt="Site progress" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log Author Footer */}
          <div className="text-center py-1 text-[11px] text-[#68707C] font-medium">
            Report recorded by <span className="text-[#171A1F] font-semibold">{selectedLog.author}</span>
          </div>
        </div>
      )}

      {/* 4. Create Daily Log Modal */}
      <CreateDailyLogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={[project]}
        preselectedProjectId={project.id}
        onSaveLog={handleSaveNewLog}
      />
    </div>
  );
};
