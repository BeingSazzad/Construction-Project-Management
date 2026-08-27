import React, { useState } from 'react';
import { Project, GanttItem } from '../../types';
import { 
  CalendarDays, Flag, Sparkles, Check, 
  ChevronRight, HardHat, Calendar, Clock, Filter,
  Truck, Layers, Building2, Zap, LayoutGrid, Paintbrush, ShieldCheck
} from 'lucide-react';

interface ProjectScheduleTabProps {
  project: Project;
  ganttItems?: GanttItem[];
  onCreateTask?: () => void;
}

interface PhaseItem {
  id: string;
  num: string;
  name: string;
  trade: string;
  assignee: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'At Risk';
  isCritical: boolean;
  milestone?: string;
  icon: any;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
}

const PHASES_DATA: PhaseItem[] = [
  {
    id: 'ph-1',
    num: '01',
    name: 'Site Preparation & Mass Earthwork',
    trade: 'Earthwork & Civil',
    assignee: 'Earthworks Pro',
    dates: 'Jan 10 – Feb 15',
    duration: '36d',
    progress: 100,
    status: 'Completed',
    isCritical: true,
    milestone: 'Site Graded & Retention Complete',
    icon: Truck,
    colorTheme: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/25',
      badgeBg: 'bg-amber-500/15 text-amber-300'
    }
  },
  {
    id: 'ph-2',
    num: '02',
    name: 'Foundation & Deep Pier Drilling',
    trade: 'Subterranean Concrete',
    assignee: 'Concrete Solutions',
    dates: 'Feb 16 – Apr 10',
    duration: '53d',
    progress: 100,
    status: 'Completed',
    isCritical: true,
    milestone: 'Subterranean Foundation Approved',
    icon: Layers,
    colorTheme: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/25',
      badgeBg: 'bg-emerald-500/15 text-emerald-300'
    }
  },
  {
    id: 'ph-3',
    num: '03',
    name: 'Structural Concrete Slabs & Columns',
    trade: 'Superstructure',
    assignee: 'Apex Concrete',
    dates: 'Apr 11 – Jul 20',
    duration: '100d',
    progress: 68,
    status: 'In Progress',
    isCritical: true,
    milestone: 'L12 Deck Slab Concrete Pour',
    icon: Building2,
    colorTheme: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/25',
      badgeBg: 'bg-cyan-500/15 text-cyan-300'
    }
  },
  {
    id: 'ph-4',
    num: '04',
    name: 'MEP Utility Rough-in & Risers',
    trade: 'Mechanical & Electric',
    assignee: 'Prime MEP & Electric',
    dates: 'Jun 01 – Sep 15',
    duration: '106d',
    progress: 35,
    status: 'In Progress',
    isCritical: false,
    icon: Zap,
    colorTheme: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/25',
      badgeBg: 'bg-purple-500/15 text-purple-300'
    }
  },
  {
    id: 'ph-5',
    num: '05',
    name: 'Curtain Wall Facade & Glazing',
    trade: 'Exterior Envelope',
    assignee: 'Apex Glass',
    dates: 'Aug 10 – Nov 05',
    duration: '87d',
    progress: 0,
    status: 'Upcoming',
    isCritical: true,
    milestone: 'Envelope Weathertight Enclosure',
    icon: LayoutGrid,
    colorTheme: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-400',
      border: 'border-teal-500/25',
      badgeBg: 'bg-teal-500/15 text-teal-300'
    }
  },
  {
    id: 'ph-6',
    num: '06',
    name: 'Interior Framing, Drywall & Finishes',
    trade: 'Architectural Finishes',
    assignee: 'Craft Drywall LLC',
    dates: 'Oct 01 – Jan 20',
    duration: '111d',
    progress: 0,
    status: 'Upcoming',
    isCritical: false,
    icon: Paintbrush,
    colorTheme: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/25',
      badgeBg: 'bg-indigo-500/15 text-indigo-300'
    }
  },
  {
    id: 'ph-7',
    num: '07',
    name: 'Testing, Commissioning & Final Punch',
    trade: 'QA/QC & Handover',
    assignee: 'Integrated Systems',
    dates: 'Jan 15 – Mar 15',
    duration: '59d',
    progress: 0,
    status: 'Upcoming',
    isCritical: true,
    milestone: 'Certificate of Occupancy (CO)',
    icon: ShieldCheck,
    colorTheme: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/25',
      badgeBg: 'bg-rose-500/15 text-rose-300'
    }
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
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">Master Schedule</h2>
          <span className="text-[11px] font-semibold text-slate-400 bg-[#0A1224] px-2 py-0.5 rounded-full border border-[#142036]">
            {completedCount}/{PHASES_DATA.length} done
          </span>
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

      {/* ─── 3. BALANCED, ICON-ENRICHED PHASE CARDS ─── */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((phase) => {
          const isDone = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';
          const Icon = phase.icon;

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedPhase(phase)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 shadow-sm group active:scale-[0.99] ${
                isInProgress
                  ? 'bg-[#081226] border-blue-500/40 hover:border-blue-500/70'
                  : isDone
                  ? 'bg-[#060B16] border-[#142036] opacity-85 hover:opacity-100'
                  : 'bg-[#070D1A] border-[#142036] hover:border-slate-700'
              }`}
            >
              {/* Left: Trade / Discipline Icon Badge */}
              <div className={`w-11 h-11 rounded-2xl ${phase.colorTheme.bg} border ${phase.colorTheme.border} flex items-center justify-center ${phase.colorTheme.text} flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Middle: Content Block */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Title & Phase No */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    #{phase.num}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {phase.name}
                  </h3>
                </div>

                {/* Subcontractor & Date Span */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
                  <span className="text-slate-300 font-semibold truncate">{phase.assignee}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 truncate">{phase.dates}</span>
                  <span className="text-slate-500 font-mono text-[10px]">({phase.duration})</span>
                </div>

                {/* Progress Bar & Milestone */}
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex-1 h-1.5 bg-[#050811] rounded-full overflow-hidden">
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

                  {phase.milestone && (
                    <span className="text-[9px] font-semibold text-blue-300/90 truncate flex items-center gap-0.5 flex-shrink-0 max-w-[120px]">
                      <Flag className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                      <span className="truncate">{phase.milestone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Progress Pill & Critical Path Indicator */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : isInProgress
                    ? 'bg-blue-500/15 text-blue-400'
                    : 'bg-[#0E1728] text-slate-500'
                }`}>
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{phase.progress}%</span>
                </span>

                {phase.isCritical && (
                  <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Critical
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ─── 4. PHASE DETAIL MODAL (TAP TO EXPAND) ─── */}
      {selectedPhase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl ${selectedPhase.colorTheme.bg} border ${selectedPhase.colorTheme.border} flex items-center justify-center ${selectedPhase.colorTheme.text} flex-shrink-0`}>
                  <selectedPhase.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-400 font-mono">Phase {selectedPhase.num} · {selectedPhase.trade}</span>
                  <h3 className="text-xs font-bold text-white truncate">{selectedPhase.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPhase(null)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#142036]/60">
                <span className="text-slate-400">Trade Lead:</span>
                <span className="font-semibold text-white">{selectedPhase.assignee}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#142036]/60">
                <span className="text-slate-400">Target Duration:</span>
                <span className="font-semibold text-white">{selectedPhase.dates} ({selectedPhase.duration})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#142036]/60">
                <span className="text-slate-400">Critical Path:</span>
                <span className={`font-bold ${selectedPhase.isCritical ? 'text-amber-400' : 'text-slate-400'}`}>
                  {selectedPhase.isCritical ? '⚡ Yes (Critical Path)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#142036]/60">
                <span className="text-slate-400">Execution Progress:</span>
                <span className="font-bold text-blue-400">{selectedPhase.progress}% Completed</span>
              </div>
              {selectedPhase.milestone && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Gateway Milestone:</span>
                  <span className="font-semibold text-cyan-300 text-right">{selectedPhase.milestone}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPhase(null)}
              className="mt-2 w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
