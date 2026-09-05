import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Plus, Search, Calendar, Users, Sun, CloudRain, 
  ShieldCheck, Wrench, Building2, Truck, HardHat, ArrowUpRight,
  SlidersHorizontal
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
    <div className="w-full flex flex-col gap-3.5 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <h1 className="text-[15px] font-bold text-white tracking-tight leading-none">Daily Logs</h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Jobsite field progress & crew activity</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-8 px-3.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[11px] font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-3 h-3" />
          New Log
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search logs, notes, visitors…"
          className="w-full h-9 bg-[#080D19] border border-[#111A2E] hover:border-[#1A2640] focus:border-blue-600/60 rounded-xl pl-8.5 pr-3 text-[12px] text-white placeholder-slate-600 outline-none transition-colors"
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      {/* ── Project Filter Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedProjectFilter('all')}
          className={`px-3 h-7 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
            selectedProjectFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-[#0A0F1E] text-slate-500 hover:text-slate-300 border border-[#131D35]'
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
              className={`px-3 h-7 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0A0F1E] text-slate-500 hover:text-slate-300 border border-[#131D35]'
              }`}
            >
              <span className="truncate max-w-[90px]">{p.name}</span>
              {count > 0 && (
                <span className={`text-[9px] font-bold ${isSelected ? 'opacity-70' : 'text-slate-600'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Log Cards ── */}
      <div className="flex flex-col gap-2.5">
        {filteredLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center">
            <Calendar className="w-8 h-8 text-slate-800" />
            <p className="text-[13px] font-semibold text-slate-400">No logs found</p>
            <p className="text-[11px] text-slate-600 max-w-[220px]">
              No logs recorded for this filter. Tap "New Log" to create one.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <article
              key={log.id}
              className="relative rounded-2xl bg-[#080D19] border border-[#111A2E] hover:border-[#1A2940] transition-all overflow-hidden group"
            >
              {/* Gradient top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500/50 via-cyan-400/25 to-transparent" />

              <div className="p-4 flex flex-col gap-3">

                {/* Row 1: Identity + status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/8 border border-blue-500/15 flex items-center justify-center text-blue-400/80 flex-shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-bold text-white truncate leading-tight">
                        {log.projectName}
                      </h3>
                      <p className="text-[10px] text-slate-600 font-medium leading-tight mt-0.5">
                        {log.date}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/8 px-2 py-1 rounded-full flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    0 Incidents
                  </span>
                </div>

                {/* Row 2: Flat inline meta — no pill boxes */}
                <div className="flex items-center gap-2.5 text-[11px]">
                  {log.weather.condition.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-3 h-3 text-blue-400/70 flex-shrink-0" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-slate-300">{log.weather.temperature}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{log.weather.condition}</span>
                  <span className="text-slate-700 mx-0.5">|</span>
                  <Users className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-300">{log.totalHeadcount}</span>
                  <span className="text-slate-500">workers</span>
                </div>

                {/* Row 3: Work summary — plain text, no inner box */}
                <p className="text-[12px] text-slate-400 leading-[1.65] line-clamp-3">
                  {log.workSummary}
                </p>

                {/* Row 4: Compact tags */}
                {(log.deliveries || log.equipment || log.visitors) && (
                  <div className="flex flex-wrap gap-1.5">
                    {log.deliveries && log.deliveries.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-[#0C1220] px-2 py-1 rounded-md">
                        <Truck className="w-2.5 h-2.5 text-amber-500/60 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {log.deliveries[0]}{log.deliveries.length > 1 ? ` +${log.deliveries.length - 1}` : ''}
                        </span>
                      </span>
                    )}
                    {log.equipment && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-[#0C1220] px-2 py-1 rounded-md">
                        <Wrench className="w-2.5 h-2.5 text-blue-500/60 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{log.equipment}</span>
                      </span>
                    )}
                    {log.visitors && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-[#0C1220] px-2 py-1 rounded-md">
                        <HardHat className="w-2.5 h-2.5 text-violet-500/60 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{log.visitors}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#0E1625]">
                <span className="text-[10px] text-slate-600">
                  By <span className="text-slate-400 font-semibold">{log.author}</span>
                </span>
                {onNavigateToProject && (
                  <button
                    onClick={() => onNavigateToProject(log.projectId, 'daily-logs')}
                    className="text-[10px] text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    Open Project <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal */}
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
