import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Sun, CloudSun, CloudRain, Users, ShieldCheck, 
  Plus, Calendar, PackageCheck, Wrench, HardHat, 
  FileText, Truck, Camera, CheckCircle2
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Top Header & Action */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Daily Logs & Site Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {project.name} · Field progress
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 px-3.5 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#0D9488] hover:from-[#2563EB] hover:to-[#14B8A6] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/20 cursor-pointer flex-shrink-0 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Log</span>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20'
                    : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
                }`}
              >
                <span>{log.date}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#070D1A] border border-[#142036] rounded-2xl flex flex-col items-center gap-2">
          <Calendar className="w-8 h-8 text-slate-600" />
          <p className="text-xs font-bold text-white">No daily logs recorded yet</p>
          <p className="text-[11px] text-slate-400">Click "+ New Log" to submit today's site report.</p>
        </div>
      )}

      {/* 3. Selected Log Display */}
      {selectedLog && (
        <div className="flex flex-col gap-3">
          {/* Weather & Site Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-amber-400 flex-shrink-0">
                {selectedLog.weather.condition?.toLowerCase().includes('rain') ? (
                  <CloudRain className="w-5 h-5 text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Weather</span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{selectedLog.weather.temperature}</h4>
                <p className="text-[11px] text-slate-400 truncate">{selectedLog.weather.condition}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Labor</span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{selectedLog.totalHeadcount} Workers</h4>
                <p className="text-[11px] text-emerald-400 font-semibold truncate">100% Attended</p>
              </div>
            </div>
          </div>

          {/* Work Completed Summary */}
          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Work Progress Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#050811] p-3 rounded-xl border border-[#142036] font-medium">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Site Operations: Deliveries, Equipment, Visitors */}
          {(selectedLog.deliveries || selectedLog.equipment || selectedLog.visitors) && (
            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Site Operations & Logistics
              </span>

              {selectedLog.deliveries && selectedLog.deliveries.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#050811] p-2.5 rounded-xl border border-[#142036]">
                  <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Deliveries Received</span>
                    <span className="truncate">{selectedLog.deliveries.join(', ')}</span>
                  </div>
                </div>
              )}

              {selectedLog.equipment && (
                <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#050811] p-2.5 rounded-xl border border-[#142036]">
                  <Wrench className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Machinery & Equipment Active</span>
                    <span className="truncate">{selectedLog.equipment}</span>
                  </div>
                </div>
              )}

              {selectedLog.visitors && (
                <div className="flex items-center gap-2 text-xs text-slate-200 bg-[#050811] p-2.5 rounded-xl border border-[#142036]">
                  <HardHat className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Site Visitors & Inspections</span>
                    <span className="truncate">{selectedLog.visitors}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Safety Compliance */}
          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Safety Compliance</span>
                <span className="text-[11px] text-slate-400">{selectedLog.safetyIncidents}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Passed
            </span>
          </div>

          {/* Photos (if any) */}
          {selectedLog.photos && selectedLog.photos.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Site Progress Photos ({selectedLog.photos.length})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {selectedLog.photos.map((photo, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-[#142036]">
                    <img src={photo} alt="Site progress" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log Author Footer */}
          <div className="text-center py-1 text-[11px] text-slate-500 font-medium">
            Report recorded by <span className="text-slate-400 font-semibold">{selectedLog.author}</span>
          </div>
        </div>
      )}

      {/* 4. Create Daily Log Modal (Pre-locked to current project) */}
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
