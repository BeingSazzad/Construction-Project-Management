import React, { useState } from 'react';
import { Project, GanttItem } from '../../types';
import { Check } from 'lucide-react';

interface ProjectScheduleTabProps {
  project: Project;
  ganttItems?: GanttItem[];
  onCreateTask?: () => void;
}

interface PhaseItem {
  id: string;
  name: string;
  subcontractor: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

const PHASES_DATA: PhaseItem[] = [
  {
    id: 'ph-1',
    name: 'Site Preparation & Mass Excavation',
    subcontractor: 'Earthworks Pro LLC',
    dates: 'Jan 10 – Feb 15, 2025',
    duration: '36 days',
    progress: 100,
    status: 'Completed'
  },
  {
    id: 'ph-2',
    name: 'Foundation & Deep Pier Drilling',
    subcontractor: 'Concrete Solutions Inc.',
    dates: 'Feb 16 – Apr 10, 2025',
    duration: '53 days',
    progress: 100,
    status: 'Completed'
  },
  {
    id: 'ph-3',
    name: 'Structural Concrete Slabs & Columns',
    subcontractor: 'Apex Concrete Masters',
    dates: 'Apr 11 – Jul 20, 2025',
    duration: '100 days',
    progress: 68,
    status: 'In Progress'
  },
  {
    id: 'ph-4',
    name: 'MEP Utility Rough-in & Risers',
    subcontractor: 'Prime Electrical & Mechanical',
    dates: 'Jun 01 – Sep 15, 2025',
    duration: '106 days',
    progress: 35,
    status: 'In Progress'
  },
  {
    id: 'ph-5',
    name: 'Curtain Wall Facade & Glazing',
    subcontractor: 'Apex Glass Architectural',
    dates: 'Aug 10 – Nov 05, 2025',
    duration: '87 days',
    progress: 0,
    status: 'Upcoming'
  },
  {
    id: 'ph-6',
    name: 'Interior Framing, Drywall & Finishes',
    subcontractor: 'Craft Drywall LLC',
    dates: 'Oct 01 – Jan 20, 2026',
    duration: '111 days',
    progress: 0,
    status: 'Upcoming'
  },
  {
    id: 'ph-7',
    name: 'Testing, Commissioning & Final Punch',
    subcontractor: 'Integrated Systems',
    dates: 'Jan 15 – Mar 15, 2026',
    duration: '59 days',
    progress: 0,
    status: 'Upcoming'
  }
];

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Upcoming'>('All');

  const filtered = PHASES_DATA.filter(p => {
    if (activeFilter === 'In Progress') return p.status === 'In Progress';
    if (activeFilter === 'Completed') return p.status === 'Completed';
    if (activeFilter === 'Upcoming') return p.status === 'Upcoming';
    return true;
  });

  const completedCount = PHASES_DATA.filter(p => p.status === 'Completed').length;

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. CLEAN HEADER ─── */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">Master Schedule</h2>
          <span className="text-[11px] text-slate-400">
            ({completedCount} of {PHASES_DATA.length} complete)
          </span>
        </div>

        <span className="text-[11px] font-semibold text-emerald-400">
          Target: Nov 2025
        </span>
      </div>

      {/* ─── 2. CLEAN FILTER PILLS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {(['All', 'In Progress', 'Completed', 'Upcoming'] as const).map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ─── 3. REAL, NO-FLUFF CONSTRUCTION SCHEDULE CARDS ─── */}
      <div className="flex flex-col gap-2">
        {filtered.map((phase) => {
          const isDone = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';

          return (
            <div
              key={phase.id}
              className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-[#1E325A] transition-colors flex flex-col gap-2 shadow-sm"
            >
              {/* Row 1: Phase Title + Status Pill */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-white truncate">
                  {phase.name}
                </h3>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1 ${
                  isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : isInProgress
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-[#0E1728] text-slate-500 border border-[#142036]'
                }`}>
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{isDone ? 'Completed' : isInProgress ? `${phase.progress}%` : 'Upcoming'}</span>
                </span>
              </div>

              {/* Row 2: Subcontractor & Date Span */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium truncate">{phase.subcontractor}</span>
                <span className="text-slate-400 font-medium flex-shrink-0">{phase.dates}</span>
              </div>

              {/* Row 3: Simple Progress Bar */}
              <div className="w-full h-1 bg-[#050811] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500'
                      : isInProgress
                      ? 'bg-blue-500'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
