import React, { useState } from 'react';
import { Project, DailyLogItem, User } from '../../types';
import { 
  Plus, Search, Calendar, ChevronRight
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';
import { DailyLogDetailModal } from '../modals/DailyLogDetailModal';

interface DailyLogsHubViewProps {
  projects: Project[];
  dailyLogs: DailyLogItem[];
  currentUser?: User;
  onAddDailyLog?: (newLog: DailyLogItem) => void;
  onDeleteLog?: (logId: string) => void;
  onNavigateToProject?: (projectId: string, tab?: string) => void;
}

export const DailyLogsHubView: React.FC<DailyLogsHubViewProps> = ({
  projects,
  dailyLogs,
  currentUser,
  onAddDailyLog,
  onDeleteLog,
  onNavigateToProject
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLogForModal, setSelectedLogForModal] = useState<DailyLogItem | null>(null);
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
      (log.materialsReceived && log.materialsReceived.some(m => m.toLowerCase().includes(q)));
    return matchesProject && matchesSearch;
  });

  const cleanAuthor = (authorName?: string) => {
    if (!authorName) return 'Superintendent';
    return authorName.replace(/\s*\(.*?\)/g, '').trim();
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-4 py-3.5 pb-28 font-sans max-w-[440px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] animate-fade-in">

      {/* ── Top Subtitle & Action Bar ── */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight">Daily Field Logs</h2>
          <p className="text-xs text-[#64748B] font-medium">Project field progress, workforce & safety</p>
        </div>
        {onAddDailyLog && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#1677FF]/90 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Log</span>
        </button>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search logs, notes, visitors, deliveries…"
          className="w-full h-10 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl pl-9 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors shadow-2xs font-medium"
        />
      </div>

      {/* ── Project Filter Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <button
          onClick={() => setSelectedProjectFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex-shrink-0 border ${
            selectedProjectFilter === 'all'
              ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] border-[#E2E8F0] font-medium'
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-2xs'
                  : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            >
              <span className="truncate max-w-[120px]">{p.name}</span>
              {count > 0 && (
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#64748B]'}`}>
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
          <div className="py-12 flex flex-col items-center gap-2 text-center bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-card">
            <Calendar className="w-8 h-8 text-[#94A3B8]" />
            <p className="text-xs font-semibold text-[#0F172A]">No field logs found</p>
            <p className="text-xs text-[#64748B] max-w-[220px]">
              {onAddDailyLog
                ? 'No logs recorded for this filter. Tap "New Log" to create one.'
                : 'No logs recorded for this filter.'}
            </p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const author = cleanAuthor(log.author);
            const initials = author.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'JS';
            const isIssue = Boolean(
              log.status?.toLowerCase().includes('issue') || 
              log.status?.toLowerCase().includes('delay') || 
              log.safetyPassed === false
            );
            const issueLabel = log.status || (log.safetyPassed === false ? '1 issue' : undefined);
            const hasPhotos = log.photos && log.photos.length > 0;
            const dateStr = log.date.includes('Sep') ? `Tue, ${log.date}` : log.date;

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLogForModal(log)}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card hover:border-[#1677FF]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2.5"
              >
                {/* Header Row: Author Avatar + Name & Date/Time + Project Tag + Optional Issue Tag + Chevron */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#1677FF] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1677FF]/20 shadow-2xs">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors leading-tight">
                          {author}
                        </h4>
                        {selectedProjectFilter === 'all' && (
                          <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-md">
                            {log.projectName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] font-normal leading-tight mt-0.5 truncate">
                        {dateStr} · {log.time || '5:42 PM'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isIssue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{issueLabel}</span>
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors" />
                  </div>
                </div>

                {/* Row 2: Work Summary Snippet */}
                <p className="text-xs text-[#334155] leading-relaxed line-clamp-2 font-normal">
                  {log.workSummary}
                </p>

                {/* Row 3: Compact 3-Photo Thumbnails */}
                {hasPhotos && (
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    {log.photos!.slice(0, 3).map((photoUrl, pIdx) => (
                      <div 
                        key={pIdx}
                        className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-[#E2E8F0] shadow-2xs group-hover:border-[#1677FF]/30 transition-all"
                      >
                        <img 
                          src={photoUrl} 
                          alt={`Site Preview ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        {pIdx === 2 && log.photos!.length > 3 && (
                          <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-bold">
                            +{log.photos!.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {onAddDailyLog && (
      <CreateDailyLogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projects={projects}
        currentUser={currentUser}
        onSaveLog={onAddDailyLog}
      />
      )}

      {/* Daily Log Detail Modal */}
      <DailyLogDetailModal
        isOpen={!!selectedLogForModal}
        onClose={() => setSelectedLogForModal(null)}
        log={selectedLogForModal}
      />
    </div>
  );
};
