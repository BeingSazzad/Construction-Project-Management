import React, { useState } from 'react';
import { Project, GanttItem, Task, TaskStatus } from '../../types';
import { Check, Plus, X, Flag, ChevronRight, Wrench } from 'lucide-react';
import { MilestoneDetailsModal, MilestoneItem } from '../modals/MilestoneDetailsModal';

interface ProjectScheduleTabProps {
  project: Project;
  tasks?: Task[];
  ganttItems?: GanttItem[];
  onCreateTask?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTask?: (task: Partial<Task>) => void;
  isMilestoneView?: boolean;
}

export interface PhaseItem extends MilestoneItem {
  id: string;
  code?: string;
  phaseNumber: string;
  name: string;
  subcontractor: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  budgetAllocation?: number;
  totalTasks: number;
  completedTasks: number;
  colorTheme: {
    bg: string;
    text: string;
  };
}

// ── 7 Precise Architectural / Phase SVGs matching spec ──
const PhaseExcavatorIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18h20" />
    <circle cx="5" cy="18" r="1.5" />
    <circle cx="19" cy="18" r="1.5" />
    <path d="M5 16.5l4-7 5 3-2 4" />
    <path d="M14 12.5l4 2.5-1.5 3" />
    <circle cx="9" cy="9.5" r="1" fill="currentColor" />
    <circle cx="14" cy="12.5" r="1" fill="currentColor" />
  </svg>
);

const PhaseFoundationIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19h16" />
    <path d="M7 19V5" />
    <path d="M12 19V5" />
    <path d="M17 19V5" />
    <path d="M5 9h14" />
    <path d="M5 14h14" />
  </svg>
);

const PhaseFramingIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18" />
    <path d="M4 20V9l8-6 8 6v11" />
    <path d="M12 3v17" />
    <path d="M8 20V12" />
    <path d="M16 20V12" />
  </svg>
);

const PhaseEnvelopeIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
  </svg>
);

const PhaseFinishesIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="13" height="6" rx="2" />
    <path d="M16 6h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-9v8" />
  </svg>
);

const PhaseCloseoutIcon = () => (
  <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project,
  tasks = [],
  onUpdateTaskStatus,
  onAddTask,
  isMilestoneView = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Upcoming'>('All');
  const [selectedMilestone, setSelectedMilestone] = useState<PhaseItem | null>(null);
  
  // ── 7 Standard Project Phases matching spec ──
  const [phases, setPhases] = useState<PhaseItem[]>([
    {
      id: `${project.id}-ms-1`,
      code: 'MS-01',
      phaseNumber: '01',
      name: '01.  Site Preparation & Excavation',
      subcontractor: 'Earthworks Pro LLC',
      dates: 'Jan 10 – Feb 15, 2025',
      duration: '36 days',
      progress: 100,
      status: 'Completed',
      totalTasks: 5,
      completedTasks: 5,
      budgetAllocation: 450000,
      inspectionPassed: true,
      colorTheme: {
        bg: 'bg-[#EAF3FF]',
        text: 'text-[#1677FF]'
      }
    },
    {
      id: `${project.id}-ms-2`,
      code: 'MS-02',
      phaseNumber: '02',
      name: '02.  Foundation & Deep Pier Drilling',
      subcontractor: 'Concrete Solutions Inc.',
      dates: 'Feb 16 – Apr 10, 2025',
      duration: '53 days',
      progress: 100,
      status: 'Completed',
      totalTasks: 5,
      completedTasks: 5,
      budgetAllocation: 620000,
      inspectionPassed: true,
      colorTheme: {
        bg: 'bg-[#E6F7F0]',
        text: 'text-[#10A976]'
      }
    },
    {
      id: `${project.id}-ms-3`,
      code: 'MS-03',
      phaseNumber: '03',
      name: '03.  Structural Framing & Concrete Slabs',
      subcontractor: 'Apex Concrete Masters',
      dates: 'Apr 11 – Jul 20, 2025',
      duration: '100 days',
      progress: 0,
      status: 'In Progress',
      totalTasks: 2,
      completedTasks: 0,
      budgetAllocation: 850000,
      inspectionPassed: false,
      colorTheme: {
        bg: 'bg-[#FFF7E6]',
        text: 'text-[#D97706]'
      }
    },
    {
      id: `${project.id}-ms-4`,
      code: 'MS-04',
      phaseNumber: '04',
      name: '04.  MEP Utility Rough-In (Mech, Elec, Plumb)',
      subcontractor: 'Prime Electrical & Mechanical',
      dates: 'Jun 01 – Sep 15, 2025',
      duration: '106 days',
      progress: 0,
      status: 'In Progress',
      totalTasks: 2,
      completedTasks: 0,
      budgetAllocation: 920000,
      inspectionPassed: false,
      colorTheme: {
        bg: 'bg-[#F5EEFF]',
        text: 'text-[#9333EA]'
      }
    },
    {
      id: `${project.id}-ms-5`,
      code: 'MS-05',
      phaseNumber: '05',
      name: '05.  Building Envelope & Exterior Glass',
      subcontractor: 'GlassCraft Facades',
      dates: 'Aug 10 – Nov 30, 2025',
      duration: '112 days',
      progress: 0,
      status: 'Upcoming',
      totalTasks: 4,
      completedTasks: 0,
      budgetAllocation: 540000,
      inspectionPassed: false,
      colorTheme: {
        bg: 'bg-[#E0F7F6]',
        text: 'text-[#0D9488]'
      }
    },
    {
      id: `${project.id}-ms-6`,
      code: 'MS-06',
      phaseNumber: '06',
      name: '06.  Insulation, Drywall & Interior Finishes',
      subcontractor: 'FinishRight Interiors',
      dates: 'Oct 01 – Jan 20, 2026',
      duration: '111 days',
      progress: 0,
      status: 'Upcoming',
      totalTasks: 4,
      completedTasks: 0,
      budgetAllocation: 480000,
      inspectionPassed: false,
      colorTheme: {
        bg: 'bg-[#FFEBF2]',
        text: 'text-[#E11D48]'
      }
    },
    {
      id: `${project.id}-ms-7`,
      code: 'MS-07',
      phaseNumber: '07',
      name: '07.  Final Inspections & Closeout',
      subcontractor: 'Lattice Construction',
      dates: 'Jan 15 – Mar 15, 2026',
      duration: '59 days',
      progress: 0,
      status: 'Upcoming',
      totalTasks: 3,
      completedTasks: 0,
      budgetAllocation: 320000,
      inspectionPassed: false,
      colorTheme: {
        bg: 'bg-[#F0EEFF]',
        text: 'text-[#6366F1]'
      }
    }
  ]);

  // Add Milestone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState(`MS-0${phases.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newSubcontractor, setNewSubcontractor] = useState('');
  const [newDates, setNewDates] = useState('Oct 15 – Nov 20, 2025');
  const [newDuration, setNewDuration] = useState('35 days');
  const [newBudget, setNewBudget] = useState('350000');
  const [newStatus, setNewStatus] = useState<'Upcoming' | 'In Progress' | 'Completed'>('Upcoming');

  const filtered = phases.filter(p => {
    if (activeFilter === 'In Progress') return p.status === 'In Progress';
    if (activeFilter === 'Completed') return p.status === 'Completed';
    if (activeFilter === 'Upcoming') return p.status === 'Upcoming';
    return true;
  });

  const completedCount = phases.filter(p => p.status === 'Completed').length;

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const phaseNum = (phases.length + 1).toString().padStart(2, '0');
    const newMilestone: PhaseItem = {
      id: `${project.id}-ms-${Date.now()}`,
      code: newCode.trim() || `MS-${phaseNum}`,
      phaseNumber: phaseNum,
      name: `${phaseNum}.  ${newName.trim()}`,
      subcontractor: newSubcontractor.trim() || 'General Contractor Lead',
      dates: newDates.trim() || 'TBD',
      duration: newDuration.trim() || '30 days',
      progress: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 25 : 0,
      status: newStatus,
      totalTasks: 4,
      completedTasks: newStatus === 'Completed' ? 4 : 0,
      budgetAllocation: parseFloat(newBudget) || 0,
      inspectionPassed: newStatus === 'Completed',
      colorTheme: {
        bg: 'bg-[#EAF3FF]',
        text: 'text-[#1677FF]'
      }
    };

    setPhases(prev => [...prev, newMilestone]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewSubcontractor('');
    setNewCode(`MS-0${phases.length + 2}`);
  };

  const handleUpdateStatus = (milestoneId: string, status: 'Completed' | 'In Progress' | 'Upcoming') => {
    setPhases(prev => prev.map(p => {
      if (p.id === milestoneId) {
        const isDone = status === 'Completed';
        return {
          ...p,
          status,
          completedTasks: isDone ? p.totalTasks : 0,
          progress: isDone ? 100 : status === 'In Progress' ? Math.max(25, p.progress) : 0,
          inspectionPassed: isDone
        };
      }
      return p;
    }));
    if (selectedMilestone && selectedMilestone.id === milestoneId) {
      setSelectedMilestone(prev => prev ? {
        ...prev,
        status,
        completedTasks: status === 'Completed' ? prev.totalTasks : 0,
        progress: status === 'Completed' ? 100 : status === 'In Progress' ? Math.max(25, prev.progress) : 0,
        inspectionPassed: status === 'Completed'
      } : null);
    }
  };

  const renderPhaseIcon = (phaseNumber: string) => {
    switch (phaseNumber) {
      case '01': return <PhaseExcavatorIcon />;
      case '02': return <PhaseFoundationIcon />;
      case '03': return <PhaseFramingIcon />;
      case '04': return <Wrench className="w-5 h-5 stroke-current" />;
      case '05': return <PhaseEnvelopeIcon />;
      case '06': return <PhaseFinishesIcon />;
      case '07': return <PhaseCloseoutIcon />;
      default: return <Flag className="w-5 h-5 stroke-current" />;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] animate-fade-in">
      
      {/* ─── 1. MASTER SCHEDULE HEADER WITH ADD GATE ─── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Master Schedule
          </h2>
          <p className="text-xs text-[#64748B] font-normal mt-0.5">
            {completedCount} of {phases.length} phases completed
          </p>
        </div>

        <button
          onClick={() => {
            const nextNum = (phases.length + 1).toString().padStart(2, '0');
            setNewCode(`MS-${nextNum}`);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Gate</span>
        </button>
      </div>

      {/* ─── 2. CLEAN FILTER PILLS ─── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {(['All', 'In Progress', 'Completed', 'Upcoming'] as const).map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#0F172A] border border-[#E5E7EB] hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ─── 3. SCHEDULE PHASE CARDS ─── */}
      <div className="flex flex-col gap-3">
        {filtered.map((phase) => {
          const isDone = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';
          const totalTasks = phase.totalTasks || 5;
          const completedTasks = phase.completedTasks || (isDone ? totalTasks : 0);
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedMilestone(phase)}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#1677FF]/40 cursor-pointer transition-all active:scale-[0.99] text-left shadow-xs hover:shadow-sm flex items-start gap-3 group"
            >
              {/* Left Phase Icon */}
              <div className={`w-10 h-10 rounded-xl ${phase.colorTheme.bg} ${phase.colorTheme.text} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                {renderPhaseIcon(phase.phaseNumber)}
              </div>

              {/* Right Content Area */}
              <div className="flex-1 min-w-0">
                {/* Top Line: Title + Badge + Chevron */}
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight">
                    {phase.name}
                  </h3>

                  <div className="flex items-center gap-1 shrink-0 mt-[-1px]">
                    {isDone ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F7F0] text-[#10A976] flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Done</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF3FF] text-[#1677FF]">
                        {progress}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#64748B]">
                        Upcoming
                      </span>
                    )}

                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Subcontractor / Lead Trade */}
                <p className="text-[11px] text-[#64748B] font-medium mt-1 truncate">
                  {phase.subcontractor}
                </p>

                {/* Progress Bar & Task Count */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex-1 h-1.5 bg-[#EAEDF1] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-[#10A976]' : isInProgress ? 'bg-[#1677FF]' : 'bg-transparent'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#64748B] shrink-0 font-mono">
                    {completedTasks} / {totalTasks}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 4. ADD NEW MILESTONE GATE MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in font-sans">
          <div className="w-full max-w-[430px] bg-white border border-[#E5E7EB] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-[#1677FF]" />
                  <span>Add Project Schedule Gate</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Define schedule phase, trade subcontractor & draw value</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="flex flex-col gap-3 text-xs">
              {/* Code + Milestone Name */}
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="MS-08"
                    className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-2.5 text-xs text-[#0F172A] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Phase Title</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Dry-In & Roofing Inspection"
                    className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#0F172A] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Subcontractor / Lead Trade */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Responsible Subcontractor / Trade</label>
                <input
                  type="text"
                  value={newSubcontractor}
                  onChange={e => setNewSubcontractor(e.target.value)}
                  placeholder="e.g. Apex Roofing & Glazing LLC"
                  className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#0F172A] outline-none"
                />
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Date Span / Target</label>
                  <input
                    type="text"
                    value={newDates}
                    onChange={e => setNewDates(e.target.value)}
                    placeholder="e.g. Nov 01 – Nov 25, 2025"
                    className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#0F172A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    placeholder="e.g. 25 days"
                    className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#0F172A] outline-none"
                  />
                </div>
              </div>

              {/* Budget / Draw Allocation */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Draw Budget Allocation ($)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  placeholder="e.g. 350000"
                  className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#0F172A] outline-none font-mono"
                />
              </div>

              {/* Initial Status */}
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Initial Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Upcoming', 'In Progress', 'Completed'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`h-9 rounded-xl text-center font-bold text-xs transition-all border cursor-pointer ${
                        newStatus === s
                          ? 'bg-[#1677FF] border-[#1677FF] text-white'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#EAEDF1] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] font-bold hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1677FF] text-white font-bold hover:bg-[#0958D9] disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  Save Schedule Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 5. MILESTONE DETAILS & LIVE CONNECTED TASKS MODAL ─── */}
      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          projectName={project.name}
          projectTasks={tasks}
          onClose={() => setSelectedMilestone(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onAddTask={onAddTask}
        />
      )}

    </div>
  );
};
