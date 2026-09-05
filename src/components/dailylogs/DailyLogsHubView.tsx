import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Plus, Search, Calendar, Users, Sun, CloudRain, 
  Building2, ArrowUpRight
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
    <div className="w-full flex-1 flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <h1 className="text-base font-bold text-[#171A1F] tracking-tight leading-none">Daily Logs</h1>
          <p className="text-xs text-[#68707C] font-medium mt-0.5">Jobsite field progress & crew activity</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Log</span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68707C] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search logs, notes, visitors…"
          className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl pl-9 pr-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors shadow-xs"
        />
      </div>

      {/* ── Project Filter Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <button
          onClick={() => setSelectedProjectFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 border ${
            selectedProjectFilter === 'all'
              ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F2F2F7] border-[#DDE1E7]'
          }`}
        >
          All · {dailyLogs.length}
        </button>
        {projects.map(p => {
          const count = dailyLogs.filter(l => l.projectId === p.id).length;
          const isSelected = selectedProjectFilter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProjectFilter(p.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
                  : 'bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F2F2F7] border-[#DDE1E7]'
              }`}
            >
              <span className="truncate max-w-[100px]">{p.name}</span>
              {count > 0 && (
                <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-[#68707C]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Log Cards ── */}
      <div className="flex flex-col gap-3">
        {filteredLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center bg-white border border-[#DDE1E7] rounded-3xl p-8 shadow-xs">
            <Calendar className="w-8 h-8 text-[#9DA5B1]" />
            <p className="text-xs font-semibold text-[#171A1F]">No logs found</p>
            <p className="text-[11px] text-[#68707C] max-w-[220px]">
              No logs recorded for this filter. Tap "New Log" to create one.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <article
              key={log.id}
              className="relative rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 transition-all overflow-hidden group shadow-xs p-4 flex flex-col gap-3"
            >
              {/* Row 1: Identity + status badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] truncate leading-tight">
                      {log.projectName}
                    </h3>
                    <p className="text-[11px] text-[#68707C] font-medium leading-tight mt-0.5">
                      {log.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {log.totalHeadcount} on-site
                  </span>
                  {onNavigateToProject && (
                    <button
                      onClick={() => onNavigateToProject(log.projectId, 'dailylogs')}
                      className="w-7 h-7 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7] flex items-center justify-center transition-colors cursor-pointer"
                      title="Open project logs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 2: Weather & Quick Tags */}
              <div className="flex items-center gap-2 text-[11px] text-[#68707C]">
                <div className="flex items-center gap-1 bg-[#F7F8FA] px-2 py-0.5 rounded-lg border border-[#EAEDF1]">
                  {log.weather.condition.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-3 h-3 text-[#1677FF]" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                  <span>{log.weather.temperature} · {log.weather.condition}</span>
                </div>
                <div className="flex items-center gap-1 bg-[#F7F8FA] px-2 py-0.5 rounded-lg border border-[#EAEDF1]">
                  <Users className="w-3 h-3 text-[#1677FF]" />
                  <span>{log.totalHeadcount} workers</span>
                </div>
              </div>

              {/* Row 3: Summary Text */}
              <p className="text-xs text-[#171A1F] bg-[#F7F8FA] p-3 rounded-xl border border-[#EAEDF1] leading-relaxed">
                {log.workSummary}
              </p>

              {/* Row 4: Author Footer */}
              <div className="flex items-center justify-between text-[11px] text-[#68707C] pt-1 border-t border-[#EAEDF1]">
                <span>By: {log.author}</span>
                <span className="text-emerald-700 font-semibold">{log.safetyIncidents}</span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Create Daily Log Modal */}
      <CreateDailyLogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={projects}
        onSaveLog={onAddDailyLog}
      />
    </div>
  );
};
