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
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Daily Field Logs</h2>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
                }`}
              >
                <span>{log.date}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-[#DDE1E7] rounded-3xl flex flex-col items-center gap-2 shadow-xs">
          <Calendar className="w-8 h-8 text-[#9DA5B1]" />
          <p className="text-xs font-bold text-[#171A1F]">No daily logs recorded yet</p>
          <p className="text-xs text-[#68707C]">Click "+ New Log" to submit today's site report.</p>
        </div>
      )}

      {/* 3. Selected Log Display (Single Cohesive Card - No Box Inception) */}
      {selectedLog && (
        <div className="rounded-3xl bg-white border border-[#DDE1E7] shadow-xs divide-y divide-[#EAEDF1] overflow-hidden">
          
          {/* Header & Metric Strip */}
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF]">
                  Site Report · {selectedLog.date}
                </span>
                <h3 className="text-sm font-bold text-[#171A1F] mt-0.5">
                  Logged by {selectedLog.author}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Safety Verified
              </span>
            </div>

            {/* Clean 2-Column Info Strip (Replaces separate floating boxes) */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#EAEDF1]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  {selectedLog.weather.condition?.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-4 h-4 text-[#1677FF]" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-[#68707C] uppercase block">Weather</span>
                  <span className="text-xs font-bold text-[#171A1F] block truncate mt-0.5">
                    {selectedLog.weather.temperature} · {selectedLog.weather.condition}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-[#68707C] uppercase block">On-Site Labor</span>
                  <span className="text-xs font-bold text-[#171A1F] block truncate mt-0.5">
                    {selectedLog.totalHeadcount} Workers (100%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Completed Summary */}
          <div className="p-5 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
              Work Progress Summary
            </span>
            <p className="text-xs text-[#0F172A] leading-relaxed font-normal">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Subcontractor Crews on Site */}
          {selectedLog.crews && selectedLog.crews.length > 0 && (
            <div className="p-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
                  Active Trade Crews ({selectedLog.crews.length})
                </span>
                <span className="text-xs text-[#64748B] font-medium">
                  {selectedLog.crews.reduce((acc, c) => acc + c.workersCount, 0)} Total Workers
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {selectedLog.crews.map((crew, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F172A] truncate">{crew.subcontractor}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] font-semibold">
                          {crew.trade}
                        </span>
                      </div>
                      {crew.notes && (
                        <p className="text-[11px] text-[#64748B] mt-0.5 truncate">{crew.notes}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#0F172A] block">{crew.workersCount} Workers</span>
                      <span className="text-[10px] text-[#64748B]">{crew.hoursWorked} hrs shift</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Site Operations: Deliveries, Equipment, Visitors (Clean list rows, no gray boxes) */}
          {(selectedLog.deliveries || selectedLog.equipment || selectedLog.visitors) && (
            <div className="p-5 flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
                Site Logistics & Operations
              </span>

              <div className="flex flex-col gap-2 text-xs">
                {selectedLog.deliveries && selectedLog.deliveries.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#171A1F]">Deliveries: </span>
                      <span className="text-[#68707C]">{selectedLog.deliveries.join(', ')}</span>
                    </div>
                  </div>
                )}

                {selectedLog.equipment && (
                  <div className="flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-[#1677FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#171A1F]">Equipment: </span>
                      <span className="text-[#68707C]">{selectedLog.equipment}</span>
                    </div>
                  </div>
                )}

                {selectedLog.visitors && (
                  <div className="flex items-start gap-2.5">
                    <HardHat className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#171A1F]">Inspections & Visitors: </span>
                      <span className="text-[#68707C]">{selectedLog.visitors}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Photos (if any) */}
          {selectedLog.photos && selectedLog.photos.length > 0 && (
            <div className="p-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
                Site Photos ({selectedLog.photos.length})
              </span>
              <div className="grid grid-cols-3 gap-2">
                {selectedLog.photos.map((photo, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-[#EAEDF1]">
                    <img src={photo} alt="Site progress" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

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
