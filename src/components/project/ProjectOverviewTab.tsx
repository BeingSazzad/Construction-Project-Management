import React, { useMemo } from 'react';
import { Project, Task, SitePhoto, DocumentItem, PunchItem, ProjectStatus, ChangeOrder, TaskStatus } from '../../types';
import { 
  MapPin, Calendar, Camera, FileText, 
  AlertCircle, Check, Plus, Coins, 
  Activity, FilePlus2, User, ClipboardList,
  Building2, ShieldCheck, FileCheck, Compass, Clock, ArrowUpRight,
  CheckSquare
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectOverviewTabProps {
  project: Project;
  tasks?: Task[];
  photos?: SitePhoto[];
  documents?: DocumentItem[];
  punchItems: PunchItem[];
  dailyLogs?: any[];
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onCreatePunch?: () => void;
  onUpdateStatus?: (newStatus: ProjectStatus) => void;
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks = [],
  photos = [],
  documents = [],
  punchItems = [],
  dailyLogs = [],
  onSelectTab,
  onNavigate,
  changeOrders = [],
  onCreateChangeOrder
}) => {
  const projectCOs = useMemo(() => {
    return (changeOrders || []).filter(co => co.projectId === project.id);
  }, [changeOrders, project.id]);

  const pendingCOValue = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Pending').reduce((sum, co) => sum + co.amount, 0);
  }, [projectCOs]);

  const approvedCOValue = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Approved').reduce((sum, co) => sum + co.amount, 0);
  }, [projectCOs]);

  const approvedTimeAdded = useMemo(() => {
    return projectCOs.filter(co => co.status === 'Approved').reduce((sum, co) => sum + co.timeImpact, 0);
  }, [projectCOs]);

  const handleTabChange = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPunchCount = punchItems.filter(p => p.status === 'Open').length;
  const projectDailyLogsCount = dailyLogs.length || (project.dailyLogs ? project.dailyLogs.length : 0);

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HERO PROJECT BANNER CARD ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1A263E] bg-[#070D1A] shadow-md group">
        <div className="h-44 w-full relative">
          <img
            src={project.coverImage || project.thumbnail || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'}
            alt={project.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/55 to-transparent" />
          
          {/* Top Status & Code Badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[12px] font-mono font-bold text-slate-200 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
              {project.code}
            </span>
            <StatusBadge status={project.status} size="sm" />
          </div>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-md truncate">
                {project.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">{project.location || project.cityState}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Meta Info Sub-header */}
        <div className="px-3.5 py-2.5 bg-[#070D1A] border-t border-[#142036] flex items-center justify-between text-xs text-slate-400">
          <span>GC Owner: <strong className="text-white font-bold">Sazzad</strong></span>
          <span className="text-slate-600">•</span>
          <span>Target End: <strong className="text-white font-bold">{project.targetEndDate || 'Jun 2026'}</strong></span>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE 3-KPI METRIC CARDS ─── */}
      <div className="grid grid-cols-3 gap-2">
        {/* Progress Card */}
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Progress</span>
          </div>
          <div className="mt-2">
            <span className="text-base font-black text-white">{project.progress}%</span>
            <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Budget</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-base font-black text-white">${(project.budget.total / 1000000).toFixed(2)}M</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Active Ledger</span>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Timeline</span>
          </div>
          <div className="mt-2 flex flex-col leading-tight">
            <span className="text-xs font-bold text-white truncate">{project.startDate?.split('-')[0] || '2025'}</span>
            <span className="text-[10px] text-slate-400 truncate">→ {project.targetEndDate?.split('-')[0] || '2026'}</span>
          </div>
        </div>
      </div>

      {/* ─── 3. QUICK FIELD ACCESS BUTTONS (Tasks, Photos, Documents, Punch List) ─── */}
      <div className="grid grid-cols-4 gap-2 bg-[#0A111F] p-3 rounded-2xl border border-[#142036] shadow-sm">
        <button 
          onClick={() => handleTabChange('tasks')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-emerald-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer group"
        >
          <CheckSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-white leading-tight">Tasks</span>
          <span className="text-[10px] text-slate-500 font-medium">({tasks.length})</span>
        </button>

        <button 
          onClick={() => handleTabChange('photos')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer group"
        >
          <Camera className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-white leading-tight">Photos</span>
          <span className="text-[10px] text-slate-500 font-medium">({photos.length})</span>
        </button>

        <button 
          onClick={() => handleTabChange('documents')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-purple-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer group"
        >
          <FileText className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-white leading-tight">Documents</span>
          <span className="text-[10px] text-slate-500 font-medium">({documents.length})</span>
        </button>

        <button 
          onClick={() => handleTabChange('punch')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-rose-500/30 text-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer group"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-white leading-tight">Punch List</span>
          <span className="text-[10px] text-rose-400 font-extrabold bg-rose-500/10 px-1.5 py-0.2 rounded-full">
            {openPunchCount}
          </span>
        </button>
      </div>

      {/* ─── 5. FULL PROJECT SPECIFICATIONS & DETAILS (BENTO GRID) ─── */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#142036] pb-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Project Details</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-[#070D1A] px-2 py-0.5 rounded border border-[#142036]">
            {project.code}
          </span>
        </div>
        
        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Location & Coordinates */}
          <div className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>Jobsite Location</span>
            </div>
            <p className="font-semibold text-white text-xs leading-snug break-words">
              {project.location || '400 Lakeview Blvd'}
            </p>
            <p className="text-[10px] text-slate-400">{project.cityState || 'Orlando, FL'}</p>
          </div>

          {/* Project Manager & GC */}
          <div className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <User className="w-3 h-3 text-emerald-400" />
              <span>Project Leadership</span>
            </div>
            <p className="font-semibold text-white text-xs leading-snug">
              {project.projectManager.name}
            </p>
            <p className="text-[10px] text-slate-400">GC Owner: Sazzad</p>
          </div>

          {/* Start Date */}
          <div className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Start Date</span>
            </div>
            <p className="font-semibold text-white text-xs leading-snug">
              {project.startDate || '2024-11-01'}
            </p>
            <p className="text-[10px] text-slate-400">Notice to Proceed</p>
          </div>

          {/* Target Completion */}
          <div className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>Target End</span>
            </div>
            <p className="font-semibold text-white text-xs leading-snug">
              {project.targetEndDate || '2026-05-30'}
            </p>
            <p className="text-[10px] text-slate-400">Substantial Handover</p>
          </div>
        </div>

        {/* Compliance & Permit Info Row */}
        <div className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-white">City Building Permit</p>
              <p className="text-[10px] text-slate-400 font-mono">Permit #BP-2025-8841 · Approved</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            100% Compliant
          </span>
        </div>
      </div>

      {/* ─── 5. CHANGE ORDERS ─── */}
      <div className="flex flex-col gap-2.5">
        {/* Change Orders Summary */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FilePlus2 className="w-3.5 h-3.5 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Change Orders</h3>
            </div>
            <button 
              onClick={onCreateChangeOrder}
              className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>New</span>
            </button>
          </div>

          {/* Change Order Stats Grid */}
          <div className="grid grid-cols-3 gap-2 bg-[#070D1A] p-2 rounded-xl border border-[#142036] text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Pending</span>
              <span className="font-bold text-white text-xs mt-0.5 block">${pendingCOValue.toLocaleString()}</span>
            </div>
            <div className="border-x border-[#142036]">
              <span className="text-[10px] text-slate-400 block font-medium">Approved</span>
              <span className="font-bold text-emerald-400 text-xs mt-0.5 block">${approvedCOValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Time Added</span>
              <span className="font-bold text-blue-400 text-xs mt-0.5 block">{approvedTimeAdded}d</span>
            </div>
          </div>

          {/* Change Order List */}
          {projectCOs.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-1 font-medium italic">
              No change orders yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              {projectCOs.map((co) => (
                <div key={co.id} className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between text-xs transition-colors">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h4 className="font-bold text-white leading-tight truncate max-w-[200px]">{co.title}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                      <span className="bg-[#142036] px-1.5 py-0.2 rounded text-[10px] text-blue-300 font-bold uppercase tracking-wider">{co.category}</span>
                      <span>•</span>
                      <span>By: {co.requestedBy}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-black text-white">${co.amount.toLocaleString()}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {co.timeImpact > 0 ? `+${co.timeImpact}d` : 'no delay'}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        co.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : co.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {co.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 7. SITE BLUEPRINT & FLOOR PLAN VIEWPORT ─── */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Site Blueprint Viewport</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            7% built
          </span>
        </div>
        
        {/* Isometric Blueprint Grid */}
        <div className="h-32 w-full bg-[#050811] rounded-xl border border-[#142036] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />

          {/* Blueprint Construction Mock Drawing */}
          <svg className="w-24 h-24 text-blue-500/40 relative z-10" viewBox="0 0 100 100" fill="none">
            <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="25" y1="80" x2="25" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="75" y1="80" x2="75" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="30" y="40" width="40" height="40" stroke="currentColor" strokeWidth="1.5" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="40" x2="50" y2="80" stroke="currentColor" strokeWidth="1" />
            <path d="M75,80 L75,20 L65,15 M75,25 L90,25" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          {/* Indicator text */}
          <div className="absolute bottom-2.5 left-2.5 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Phase 1: Cleared Lot</span>
          </div>
        </div>
      </div>

    </div>
  );
};
