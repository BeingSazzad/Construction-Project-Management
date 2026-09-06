import React, { useState, useMemo } from 'react';
import { Project, DailyLogItem, ProjectUpdate, User } from '../../types';
import { 
  Sun, CloudRain, Users, ShieldCheck, 
  Plus, HardHat, FileText, Check,
  Activity, ArrowUpRight
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';
import { CreateProjectUpdateModal } from '../modals/CreateProjectUpdateModal';
import { DailyLogDetailModal } from '../modals/DailyLogDetailModal';

interface ProjectDailyLogsTabProps {
  project: Project;
  dailyLogs?: DailyLogItem[];
  updates?: ProjectUpdate[];
  currentUser?: User;
  onAddDailyLog?: (log: DailyLogItem) => void;
  onAddUpdate?: (update: ProjectUpdate) => void;
}

export const ProjectDailyLogsTab: React.FC<ProjectDailyLogsTabProps> = ({
  project,
  dailyLogs = project.dailyLogs || [],
  updates = [],
  currentUser,
  onAddDailyLog,
  onAddUpdate
}) => {
  const [localLogs, setLocalLogs] = useState<DailyLogItem[]>(dailyLogs);
  const [localUpdates, setLocalUpdates] = useState<ProjectUpdate[]>(updates);
  const [isCreateLogOpen, setIsCreateLogOpen] = useState(false);
  const [isCreateUpdateOpen, setIsCreateUpdateOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [selectedLogForModal, setSelectedLogForModal] = useState<DailyLogItem | null>(null);

  // Sync state if props change
  React.useEffect(() => {
    if (dailyLogs) setLocalLogs(dailyLogs);
  }, [dailyLogs]);

  React.useEffect(() => {
    if (updates) setLocalUpdates(updates);
  }, [updates]);

  const handleSaveNewLog = (newLog: DailyLogItem) => {
    setLocalLogs(prev => [newLog, ...prev]);
    if (onAddDailyLog) onAddDailyLog(newLog);
    setIsCreateLogOpen(false);
  };

  const handleSaveNewUpdate = (newUpdate: ProjectUpdate) => {
    setLocalUpdates(prev => [newUpdate, ...prev]);
    if (onAddUpdate) onAddUpdate(newUpdate);
    setIsCreateUpdateOpen(false);
  };

  const handleApproveDecision = (updateId: string) => {
    setLocalUpdates(prev => prev.map(u => 
      u.id === updateId ? { ...u, decisionStatus: 'Approved' } : u
    ));
  };

  // ─── Merged Chronological Feed (Daily Logs + Live Updates Unified) ───
  const mergedFeed = useMemo(() => {
    type FeedItem = 
      | { type: 'daily_log'; id: string; sortDate: string; data: DailyLogItem }
      | { type: 'update'; id: string; sortDate: string; data: ProjectUpdate };

    const logItems: FeedItem[] = localLogs.map(log => ({
      type: 'daily_log',
      id: log.id,
      sortDate: log.date || '2026-09-05',
      data: log
    }));

    const updateItems: FeedItem[] = localUpdates.map(upd => {
      let d = '2026-09-05';
      if (upd.timestamp?.toLowerCase().includes('yesterday')) d = '2026-09-04';
      else if (upd.timestamp?.toLowerCase().includes('sep 3')) d = '2026-09-03';
      else if (upd.timestamp?.toLowerCase().includes('sep 2')) d = '2026-09-02';

      return {
        type: 'update',
        id: upd.id,
        sortDate: d,
        data: upd
      };
    });

    // Combine & Sort newest first
    return [...logItems, ...updateItems].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
  }, [localLogs, localUpdates]);

  const latestLog = localLogs[0];

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ─── 1. Header & Unified Action ─── */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Daily Logs & Updates
          </h2>
          <p className="text-xs text-[#64748B] font-medium">
            {project.name} • Live chronological field stream
          </p>
        </div>

        {/* Unified Post Action with Clean Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsActionMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#1366DB] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Post Update</span>
          </button>

          {isActionMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-20"
                onClick={() => setIsActionMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-1.5 z-30 flex flex-col gap-1 animate-scale-in">
                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsCreateLogOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block leading-tight">Daily Field Log</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Weather, crew & work summary</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsCreateUpdateOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block leading-tight">Site Quick Notice</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Photo, progress or decision</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── 2. Top Site Condition Strip (Clean Single-Layer Metric) ─── */}
      <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-card flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            {latestLog?.weather?.condition?.toLowerCase().includes('rain') ? (
              <CloudRain className="w-3.5 h-3.5 text-[#1677FF]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#64748B] font-medium block leading-none">Weather Today</span>
            <span className="text-xs font-bold text-[#0F172A] truncate block mt-0.5">
              {latestLog?.weather?.temperature || '78°F'} • {latestLog?.weather?.condition || 'Clear'}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-[#E2E8F0] shrink-0" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <HardHat className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-[#64748B] font-medium block leading-none">Active Workforce</span>
            <span className="text-xs font-bold text-[#0F172A] truncate block mt-0.5">
              {latestLog?.totalHeadcount || 18} Workers
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-[#E2E8F0] shrink-0" />

        <div className="flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-700">
            0 Incidents
          </span>
        </div>
      </div>

      {/* ─── 3. Unified Chronological Activity Stream (Clean, No Duplicate Tabs) ─── */}
      <div className="flex flex-col gap-3">
        {mergedFeed.map(item => {
          if (item.type === 'daily_log') {
            const log = item.data;
            return (
              <div 
                key={log.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3 hover:border-[#1677FF]/40 transition-all"
              >
                {/* Header: Author + Date + Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1677FF] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      JS
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-[#0F172A] truncate">
                          {log.author}
                        </h3>
                      </div>
                      <p className="text-[10px] text-[#64748B]">
                        Superintendent • {log.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF]">
                      Daily Log
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] text-[#475569]">
                      {log.totalHeadcount} Workers
                    </span>
                  </div>
                </div>

                {/* Work Accomplished Summary */}
                <div className="text-xs text-[#334155] leading-relaxed">
                  {log.workSummary}
                </div>

                {/* Active Subcontractors / Trades Chips */}
                {log.crews && log.crews.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {log.crews.map((c, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]"
                      >
                        {c.trade}: {c.workersCount}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Footer with Full Detail Trigger */}
                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B] flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>{log.weather.condition}</span>
                    {log.deliveries && log.deliveries.length > 0 && (
                      <span>• {log.deliveries.length} Deliveries</span>
                    )}
                  </span>

                  <button
                    onClick={() => setSelectedLogForModal(log)}
                    className="font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View full report</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          } else {
            const upd = item.data;
            const isDecision = upd.type === 'decision_needed' || upd.decisionNeeded;
            const isApproved = upd.decisionStatus === 'Approved';

            return (
              <div 
                key={upd.id}
                className={`bg-white rounded-2xl border p-4 shadow-card flex flex-col gap-3 transition-all ${
                  isDecision && !isApproved 
                    ? 'border-amber-300 shadow-amber-500/5' 
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Header: Author + Timestamp + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={upd.author.avatar}
                      alt={upd.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#0F172A] truncate">
                        {upd.author.name}
                      </h3>
                      <p className="text-[10px] text-[#64748B]">
                        {upd.author.role} • {upd.timestamp}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isDecision
                      ? isApproved 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-[#F1F5F9] text-[#475569]'
                  }`}>
                    {isDecision ? (isApproved ? 'Approved' : 'Decision Needed') : 'Site Update'}
                  </span>
                </div>

                {/* Update Title & Description */}
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] leading-snug">
                    {upd.title}
                  </h4>
                  <p className="text-xs text-[#334155] leading-relaxed mt-1">
                    {upd.description}
                  </p>
                </div>

                {/* Attachments if any */}
                {upd.attachments && upd.attachments.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    {upd.attachments.map((att, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] flex items-center gap-1 border border-[#E2E8F0]"
                      >
                        <FileText className="w-3 h-3 text-[#1677FF]" />
                        <span>{att.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Decision Action Prompt if Needed */}
                {isDecision && !isApproved && (
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium text-amber-800">
                      Awaiting approval from Architect or PM
                    </span>
                    <button
                      onClick={() => handleApproveDecision(upd.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>

      {/* ─── Modals ─── */}
      <CreateDailyLogModal
        isOpen={isCreateLogOpen}
        onClose={() => setIsCreateLogOpen(false)}
        projects={[project]}
        preselectedProjectId={project.id}
        onSaveLog={handleSaveNewLog}
      />

      <CreateProjectUpdateModal
        isOpen={isCreateUpdateOpen}
        onClose={() => setIsCreateUpdateOpen(false)}
        project={project}
        currentUser={currentUser}
        onSaveUpdate={handleSaveNewUpdate}
      />

      <DailyLogDetailModal
        isOpen={!!selectedLogForModal}
        onClose={() => setSelectedLogForModal(null)}
        log={selectedLogForModal}
      />

    </div>
  );
};
