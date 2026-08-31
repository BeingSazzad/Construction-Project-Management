import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Plus, Search, Calendar, Users, Sun, CloudRain, 
  ShieldCheck, Wrench, Building2, Truck, HardHat, ArrowUpRight
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';

interface DailyLogsHubViewProps {
  projects: Project[];
  dailyLogs: DailyLogItem[];
  onAddDailyLog: (newLog: DailyLogItem) => void;
  onNavigateToProject?: (projectId: string, tab?: string) => void;
}

export const DailyLogsHubView: React.FC<DailyLogsHubViewProps> = ({
  projects,
  dailyLogs,
  onAddDailyLog,
  onNavigateToProject
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter logs by project and search query
  const filteredLogs = dailyLogs.filter(log => {
    const matchesProject = selectedProjectFilter === 'all' || log.projectId === selectedProjectFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesProject;
    
    const matchesSearch = 
      log.workSummary.toLowerCase().includes(q) ||
      log.projectName.toLowerCase().includes(q) ||
      (log.visitors && log.visitors.toLowerCase().includes(q)) ||
      (log.equipment && log.equipment.toLowerCase().includes(q)) ||
      (log.deliveries && log.deliveries.some(d => d.toLowerCase().includes(q))) ||
      log.materialsReceived.some(m => m.toLowerCase().includes(q));
    return matchesProject && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Clean Minimal Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Daily Logs
          </h1>
          <p className="text-xs text-slate-400 font-medium">Jobsite field progress & crew activity</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 px-4 rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#0D9488] hover:from-[#2563EB] hover:to-[#14B8A6] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/20 cursor-pointer flex-shrink-0 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Log</span>
        </button>
      </div>

      {/* 2. Search & Filter Row */}
      <div className="flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search logs, work notes, visitors..."
            className="w-full h-9 bg-[#070D1A] border border-[#142036] focus:border-blue-500 rounded-xl pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
          />
        </div>

        {/* Project Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => setSelectedProjectFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedProjectFilter === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
            }`}
          >
            All ({dailyLogs.length})
          </button>
          {projects.map(p => {
            const count = dailyLogs.filter(l => l.projectId === p.id).length;
            const isSelected = selectedProjectFilter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectFilter(p.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20'
                    : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
                }`}
              >
                <span>{p.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Daily Logs Cards Feed (Ultra-Clean, Clutter-Free) */}
      <div className="flex flex-col gap-3">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-[#070D1A] border border-[#142036] rounded-2xl flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-bold text-slate-300">No Daily Logs Found</p>
            <p className="text-[11px] text-slate-500 max-w-[240px]">
              No logs recorded for this filter. Tap "New Log" to create a report.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div 
              key={log.id}
              className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/30 transition-all shadow-sm flex flex-col gap-3"
            >
              {/* Header: Project Badge & Date */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">
                      {log.projectName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">{log.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    0 Incidents
                  </span>
                </div>
              </div>

              {/* Minimal Weather & Crew Row */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#040813] border border-[#142036] text-slate-300">
                  {log.weather.condition.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="font-semibold text-white">{log.weather.temperature}</span>
                  <span className="text-slate-400 text-[11px]">· {log.weather.condition}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#040813] border border-[#142036] text-slate-300">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">{log.totalHeadcount}</span>
                  <span className="text-slate-400 text-[11px]">Workers</span>
                </div>
              </div>

              {/* Work Summary Note */}
              <div className="text-xs text-slate-300 leading-relaxed font-normal bg-[#040813] p-3 rounded-xl border border-[#142036]">
                {log.workSummary}
              </div>

              {/* Operations Tags (Deliveries, Equipment, Visitors) */}
              {(log.deliveries || log.equipment || log.visitors) && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {log.deliveries && log.deliveries.length > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#0A1224] border border-[#142036] text-[10px] font-medium text-slate-300 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-amber-400" />
                      <span className="truncate max-w-[150px]">{log.deliveries.join(', ')}</span>
                    </span>
                  )}

                  {log.equipment && (
                    <span className="px-2 py-0.5 rounded-md bg-[#0A1224] border border-[#142036] text-[10px] font-medium text-slate-300 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-blue-400" />
                      <span className="truncate max-w-[150px]">{log.equipment}</span>
                    </span>
                  )}

                  {log.visitors && (
                    <span className="px-2 py-0.5 rounded-md bg-[#0A1224] border border-[#142036] text-[10px] font-medium text-slate-300 flex items-center gap-1">
                      <HardHat className="w-3 h-3 text-purple-400" />
                      <span className="truncate max-w-[150px]">{log.visitors}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Footer: Author & Project Link */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#142036]/60">
                <span>By <span className="text-slate-300 font-medium">{log.author}</span></span>
                {onNavigateToProject && (
                  <button
                    onClick={() => onNavigateToProject(log.projectId, 'daily-logs')}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    Open Project <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. New Daily Log Modal */}
      <CreateDailyLogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={projects}
        onSaveLog={(newLog) => {
          onAddDailyLog(newLog);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};
