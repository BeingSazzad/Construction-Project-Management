import React, { useState } from 'react';
import { Project, GanttItem } from '../../types';
import { 
  CalendarDays, Layers, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, Plus, BarChart2, Flag,
  AlertTriangle, ShieldCheck, HardHat, Calendar,
  ArrowRight, Sparkles, Check
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectScheduleTabProps {
  project: Project;
  ganttItems: GanttItem[];
  onCreateTask?: () => void;
}

interface EnrichedPhaseItem {
  id: string;
  phaseCode: string;
  name: string;
  assignee: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'At Risk';
  isCriticalPath: boolean;
  milestoneTitle?: string;
  trade: string;
}

const MOCK_PHASES: EnrichedPhaseItem[] = [
  {
    id: 'ph-1',
    phaseCode: 'Phase 01',
    name: 'Site Preparation & Mass Earthwork',
    assignee: 'Earthworks Pro LLC',
    startDate: 'Jan 10, 2025',
    endDate: 'Feb 15, 2025',
    durationDays: 36,
    progress: 100,
    status: 'Completed',
    isCriticalPath: true,
    milestoneTitle: 'Site Graded & Retention Complete',
    trade: 'Division 31 - Earthwork'
  },
  {
    id: 'ph-2',
    phaseCode: 'Phase 02',
    name: 'Foundation & Deep Pier Drilling',
    assignee: 'Concrete Solutions Inc.',
    startDate: 'Feb 16, 2025',
    endDate: 'Apr 10, 2025',
    durationDays: 53,
    progress: 100,
    status: 'Completed',
    isCriticalPath: true,
    milestoneTitle: 'Subterranean Foundation Approved',
    trade: 'Division 03 - Concrete'
  },
  {
    id: 'ph-3',
    phaseCode: 'Phase 03',
    name: 'Structural Concrete Slabs & Columns',
    assignee: 'Apex Concrete Masters',
    startDate: 'Apr 11, 2025',
    endDate: 'Jul 20, 2025',
    durationDays: 100,
    progress: 68,
    status: 'In Progress',
    isCriticalPath: true,
    milestoneTitle: 'L12 Deck Slab Concrete Pour',
    trade: 'Division 03 - Concrete'
  },
  {
    id: 'ph-4',
    phaseCode: 'Phase 04',
    name: 'MEP Utility Rough-in & Risers',
    assignee: 'Prime Electrical & Mechanical',
    startDate: 'Jun 01, 2025',
    endDate: 'Sep 15, 2025',
    durationDays: 106,
    progress: 35,
    status: 'In Progress',
    isCriticalPath: false,
    trade: 'Division 22/26 - MEP'
  },
  {
    id: 'ph-5',
    phaseCode: 'Phase 05',
    name: 'Curtain Wall Facade & Glazing',
    assignee: 'Apex Glass Architectural',
    startDate: 'Aug 10, 2025',
    endDate: 'Nov 05, 2025',
    durationDays: 87,
    progress: 0,
    status: 'Upcoming',
    isCriticalPath: true,
    milestoneTitle: 'Building Envelope Weathertight',
    trade: 'Division 08 - Openings'
  },
  {
    id: 'ph-6',
    phaseCode: 'Phase 06',
    name: 'Interior Framing, Drywall & Finishes',
    assignee: 'Craft Drywall & Acoustics LLC',
    startDate: 'Oct 01, 2025',
    endDate: 'Jan 20, 2026',
    durationDays: 111,
    progress: 0,
    status: 'Upcoming',
    isCriticalPath: false,
    trade: 'Division 09 - Finishes'
  },
  {
    id: 'ph-7',
    phaseCode: 'Phase 07',
    name: 'Testing, Commissioning & Final Punch',
    assignee: 'Integrated Systems & Commissioning',
    startDate: 'Jan 15, 2026',
    endDate: 'Mar 15, 2026',
    durationDays: 59,
    progress: 0,
    status: 'Upcoming',
    isCriticalPath: true,
    milestoneTitle: 'Certificate of Occupancy (CO)',
    trade: 'Division 01 - General Req'
  }
];

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project,
  ganttItems,
  onCreateTask
}) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'milestones'>('gantt');
  const [filterMode, setFilterMode] = useState<'All' | 'Critical Path' | 'Active' | 'Completed'>('All');

  const filteredPhases = MOCK_PHASES.filter(p => {
    if (filterMode === 'Critical Path') return p.isCriticalPath;
    if (filterMode === 'Active') return p.status === 'In Progress';
    if (filterMode === 'Completed') return p.status === 'Completed';
    return true;
  });

  const completedCount = MOCK_PHASES.filter(p => p.status === 'Completed').length;
  const criticalPathCount = MOCK_PHASES.filter(p => p.isCriticalPath).length;

  return (
    <div className="w-full flex flex-col gap-3.5 pt-1 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HEADER & VIEW TOGGLER ─── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <span>Master Schedule</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {completedCount} of {MOCK_PHASES.length} phases completed
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#070D1A] p-1 rounded-2xl border border-[#142036]">
          <button
            onClick={() => setViewMode('gantt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'gantt'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phases
          </button>
          <button
            onClick={() => setViewMode('milestones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'milestones'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
        </div>
      </div>

      {/* ─── 2. CRITICAL PATH & SCHEDULE HEALTH BANNER ─── */}
      <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Schedule Health</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            On Track (Target: Nov 2025)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-[#050811] p-2 rounded-xl border border-[#142036]">
          <div>
            <span className="text-slate-500 block">Total Duration</span>
            <span className="font-bold text-white mt-0.5 block">420 Days</span>
          </div>
          <div>
            <span className="text-slate-500 block">Critical Path</span>
            <span className="font-bold text-amber-400 mt-0.5 block">{criticalPathCount} Key Phases</span>
          </div>
          <div>
            <span className="text-slate-500 block">Overall Progress</span>
            <span className="font-bold text-blue-400 mt-0.5 block">{project.progress}%</span>
          </div>
        </div>
      </div>

      {/* ─── 3. FILTER PILLS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {(['All', 'Critical Path', 'Active', 'Completed'] as const).map((f) => {
          const isSelected = filterMode === f;
          return (
            <button
              key={f}
              onClick={() => setFilterMode(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-600/25'
                  : 'bg-[#070D1A] border-[#142036] text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ─── 4. GANTT / PHASES DETAILED WORKFLOW ─── */}
      {viewMode === 'gantt' && (
        <div className="flex flex-col gap-3">
          {filteredPhases.map((phase, idx) => {
            const isCompleted = phase.status === 'Completed';
            const isActive = phase.status === 'In Progress';

            return (
              <div
                key={phase.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 shadow-md ${
                  isActive
                    ? 'bg-[#0A1224] border-blue-500/50 ring-1 ring-blue-500/20'
                    : isCompleted
                    ? 'bg-[#070D1A] border-[#142036] opacity-90'
                    : 'bg-[#070D1A] border-[#142036]'
                }`}
              >
                {/* Row 1: Phase Code + Status + Critical Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#050811] border border-[#142036] text-blue-400 font-mono">
                      {phase.phaseCode}
                    </span>
                    {phase.isCriticalPath && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Critical Path
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isActive
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse'
                      : 'bg-[#0E1A33] text-slate-400 border-[#1E2E4A]'
                  }`}>
                    {phase.status}
                  </span>
                </div>

                {/* Row 2: Full Uncut Title */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {phase.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-blue-400" />
                    <span>{phase.assignee}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{phase.trade}</span>
                  </p>
                </div>

                {/* Row 3: Dates & Duration Banner */}
                <div className="flex items-center justify-between text-[11px] bg-[#050811] p-2.5 rounded-xl border border-[#142036]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold">{phase.startDate}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="font-semibold">{phase.endDate}</span>
                  </div>
                  <span className="text-slate-400 font-bold font-mono">
                    {phase.durationDays}d
                  </span>
                </div>

                {/* Row 4: Progress Bar & Milestone Tag */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Phase Completion</span>
                    <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {phase.progress}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>

                  {phase.milestoneTitle && (
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-300 font-medium mt-1 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                      <Flag className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate font-semibold">Milestone: {phase.milestoneTitle}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─── 5. MILESTONES TIMELINE WORKFLOW ─── */}
      {viewMode === 'milestones' && (
        <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#142036] pb-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Major Project Gateways</span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Contractual Milestones
            </span>
          </div>

          <div className="relative pl-6 flex flex-col gap-5">
            {/* Vertical timeline spine */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#142036]" />

            {MOCK_PHASES.filter(p => p.milestoneTitle).map((p, i) => {
              const isDone = p.status === 'Completed';

              return (
                <div key={p.id} className="relative flex items-start gap-3 group">
                  {/* Timeline Dot Node */}
                  <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone 
                      ? 'bg-emerald-500 border-[#070D1A] text-white shadow-md shadow-emerald-950/60' 
                      : 'bg-[#0A111F] border-blue-500 text-blue-400'
                  }`}>
                    {isDone ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div className="flex-1 p-3 rounded-xl bg-[#050811] border border-[#142036] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{p.milestoneTitle}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {p.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">{p.name} · {p.assignee}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
