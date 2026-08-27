import React, { useState } from 'react';
import { Project, GanttItem } from '../../types';
import { 
  CalendarDays, Flag, Sparkles, Check, 
  ChevronRight, HardHat, Calendar, Clock, Filter
} from 'lucide-react';

interface ProjectScheduleTabProps {
  project: Project;
  ganttItems: GanttItem[];
  onCreateTask?: () => void;
}

interface PhaseItem {
  id: string;
  num: string;
  name: string;
  assignee: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'At Risk';
  isCritical: boolean;
  milestone?: string;
}

const PHASES_DATA: PhaseItem[] = [
  {
    id: 'ph-1',
    num: '01',
    name: 'Site Preparation & Mass Earthwork',
    assignee: 'Earthworks Pro',
    dates: 'Jan 10 – Feb 15',
    duration: '36d',
    progress: 100,
    status: 'Completed',
    isCritical: true,
    milestone: 'Site Graded & Retention'
  },
  {
    id: 'ph-2',
    num: '02',
    name: 'Foundation & Deep Pier Drilling',
    assignee: 'Concrete Solutions',
    dates: 'Feb 16 – Apr 10',
    duration: '53d',
    progress: 100,
    status: 'Completed',
    isCritical: true,
    milestone: 'Subterranean Foundation Approved'
  },
  {
    id: 'ph-3',
    num: '03',
    name: 'Structural Concrete Slabs & Columns',
    assignee: 'Apex Concrete',
    dates: 'Apr 11 – Jul 20',
    duration: '100d',
    progress: 68,
    status: 'In Progress',
    isCritical: true,
    milestone: 'L12 Deck Slab Pour'
  },
  {
    id: 'ph-4',
    num: '04',
    name: 'MEP Utility Rough-in & Risers',
    assignee: 'Prime MEP & Electric',
    dates: 'Jun 01 – Sep 15',
    duration: '106d',
    progress: 35,
    status: 'In Progress',
    isCritical: false
  },
  {
    id: 'ph-5',
    num: '05',
    name: 'Curtain Wall Facade & Glazing',
    assignee: 'Apex Glass',
    dates: 'Aug 10 – Nov 05',
    duration: '87d',
    progress: 0,
    status: 'Upcoming',
    isCritical: true,
    milestone: 'Envelope Weathertight'
  },
  {
    id: 'ph-6',
    num: '06',
    name: 'Interior Framing, Drywall & Finishes',
    assignee: 'Craft Drywall LLC',
    dates: 'Oct 01 – Jan 20',
    duration: '111d',
    progress: 0,
    status: 'Upcoming',
    isCritical: false
  },
  {
    id: 'ph-7',
    num: '07',
    name: 'Testing, Commissioning & Final Punch',
    assignee: 'Integrated Systems',
    dates: 'Jan 15 – Mar 15',
    duration: '59d',
    progress: 0,
    status: 'Upcoming',
    isCritical: true,
    milestone: 'Certificate of Occupancy'
  }
];

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Active' | 'Done'>('All');
  const [selectedPhase, setSelectedPhase] = useState<PhaseItem | null>(null);

  const filtered = PHASES_DATA.filter(p => {
    if (activeFilter === 'Critical') return p.isCritical;
    if (activeFilter === 'Active') return p.status === 'In Progress';
    if (activeFilter === 'Done') return p.status === 'Completed';
    return true;
  });

  const completedCount = PHASES_DATA.filter(p => p.status === 'Completed').length;

  return (
    <div className="w-full flex flex-col gap-3 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in pb-24">
      
      {/* ─── 1. COMPACT HEADER & INLINE STATS STRIP ─── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <span>Schedule</span>
            <span className="text-[11px] font-normal text-slate-400">({completedCount}/{PHASES_DATA.length} done)</span>
          </h2>
        </div>

        {/* Minimalist Health Tag */}
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          On Track · Nov 2025
        </span>
      </div>

      {/* ─── 2. SLIM FILTER PILLS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {[
          { id: 'All', label: 'All Phases' },
          { id: 'Active', label: 'In Progress' },
          { id: 'Critical', label: '⚡ Critical' },
          { id: 'Done', label: 'Completed' }
        ].map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm shadow-blue-500/20'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ─── 3. ULTRA-COMPACT HIGH-HIERARCHY PHASE LIST ─── */}
      <div className="flex flex-col gap-2">
        {filtered.map((phase) => {
          const isDone = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedPhase(phase)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 shadow-sm group ${
                isInProgress
                  ? 'bg-[#081020] border-blue-500/40 hover:border-blue-500/70'
                  : isDone
                  ? 'bg-[#060B16] border-[#142036] opacity-80 hover:opacity-100'
                  : 'bg-[#070D1A] border-[#142036] hover:border-slate-700'
              }`}
            >
              {/* Row 1: Number Badge + Title + Status Pill */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded ${
                    isDone 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : isInProgress 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-[#0E1728] text-slate-400'
                  }`}>
                    {phase.num}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {phase.name}
                  </h3>
                </div>

                {/* Progress / Status Tag */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1 ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isInProgress
                    ? 'bg-blue-500/15 text-blue-400 font-extrabold'
                    : 'bg-[#0E1728] text-slate-500'
                }`}>
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                  <span>{phase.progress}%</span>
                </span>
              </div>

              {/* Row 2: Clean Subtext Meta (Subcontractor · Date Span · Critical Badge) */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-300 font-semibold truncate">{phase.assignee}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 truncate">{phase.dates}</span>
                  <span className="text-slate-500 font-mono text-[10px]">({phase.duration})</span>
                </div>

                {phase.isCritical && (
                  <span className="text-[9px] font-bold text-amber-400/90 flex items-center gap-0.5 flex-shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Critical
                  </span>
                )}
              </div>

              {/* Row 3: Slim Single-Line Progress Track */}
              <div className="w-full h-1 bg-[#050811] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDone
                      ? 'bg-emerald-500'
                      : isInProgress
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              {/* Optional Milestone Tag if present */}
              {phase.milestone && (
                <div className="flex items-center gap-1 text-[10px] text-blue-300/80 font-medium pt-0.5 truncate">
                  <Flag className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                  <span className="truncate">Gateway: {phase.milestone}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── 4. PHASE DETAIL SHEET (CLEAN MODAL ON TAP) ─── */}
      {selectedPhase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-black text-blue-400 font-mono">Phase {selectedPhase.num}</span>
                <h3 className="text-xs font-bold text-white truncate">{selectedPhase.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPhase(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#142036]/60">
                <span className="text-slate-400">Subcontractor:</span>
                <span className="font-semibold text-white">{selectedPhase.assignee}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#142036]/60">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">{selectedPhase.dates} ({selectedPhase.duration})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#142036]/60">
                <span className="text-slate-400">Critical Path:</span>
                <span className={`font-bold ${selectedPhase.isCritical ? 'text-amber-400' : 'text-slate-400'}`}>
                  {selectedPhase.isCritical ? 'Yes (Critical Path)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#142036]/60">
                <span className="text-slate-400">Progress:</span>
                <span className="font-bold text-blue-400">{selectedPhase.progress}% Completed</span>
              </div>
              {selectedPhase.milestone && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Key Milestone:</span>
                  <span className="font-semibold text-cyan-300 text-right">{selectedPhase.milestone}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPhase(null)}
              className="mt-1 w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
