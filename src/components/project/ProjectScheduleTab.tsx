import React, { useState } from 'react';
import { Project, GanttItem, Task, TaskStatus } from '../../types';
import { Check, ChevronRight, Plus, X, Calendar, DollarSign, Users, Clock, ShieldCheck, Flag, CheckSquare } from 'lucide-react';
import { MilestoneDetailsModal, MilestoneItem } from '../modals/MilestoneDetailsModal';
import { DEFAULT_PROJECT_MILESTONES } from '../../data/projectMilestones';

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
  name: string;
  subcontractor: string;
  dates: string;
  duration: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  budgetAllocation?: number;
}

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project,
  tasks = [],
  onUpdateTaskStatus,
  onAddTask,
  isMilestoneView = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Upcoming'>('All');
  const [selectedMilestone, setSelectedMilestone] = useState<PhaseItem | null>(null);
  
  // Dynamic Project Milestones State initialized from standard gates
  const [phases, setPhases] = useState<PhaseItem[]>([
    {
      id: `${project.id}-ms-1`,
      code: 'MS-01',
      name: 'Site Preparation & Excavation',
      subcontractor: 'Earthworks Pro LLC',
      dates: 'Jan 10 – Feb 15, 2025',
      duration: '36 days',
      progress: 100,
      status: 'Completed',
      budgetAllocation: 450000,
      inspectionPassed: true
    },
    {
      id: `${project.id}-ms-2`,
      code: 'MS-02',
      name: 'Foundation & Deep Pier Drilling',
      subcontractor: 'Concrete Solutions Inc.',
      dates: 'Feb 16 – Apr 10, 2025',
      duration: '53 days',
      progress: 100,
      status: 'Completed',
      budgetAllocation: 620000,
      inspectionPassed: true
    },
    {
      id: `${project.id}-ms-3`,
      code: 'MS-03',
      name: 'Structural Framing & Concrete Slabs',
      subcontractor: 'Apex Concrete Masters',
      dates: 'Apr 11 – Jul 20, 2025',
      duration: '100 days',
      progress: 68,
      status: 'In Progress',
      budgetAllocation: 850000,
      inspectionPassed: false
    },
    {
      id: `${project.id}-ms-4`,
      code: 'MS-04',
      name: 'MEP Utility Rough-in (Mech, Elec, Plumb)',
      subcontractor: 'Prime Electrical & Mechanical',
      dates: 'Jun 01 – Sep 15, 2025',
      duration: '106 days',
      progress: 35,
      status: 'In Progress',
      budgetAllocation: 920000,
      inspectionPassed: false
    },
    {
      id: `${project.id}-ms-5`,
      code: 'MS-05',
      name: 'Curtain Wall Facade & Building Envelope',
      subcontractor: 'Apex Glass Architectural',
      dates: 'Aug 10 – Nov 05, 2025',
      duration: '87 days',
      progress: 0,
      status: 'Upcoming',
      budgetAllocation: 540000,
      inspectionPassed: false
    },
    {
      id: `${project.id}-ms-6`,
      code: 'MS-06',
      name: 'Insulation, Drywall & Interior Finishes',
      subcontractor: 'Craft Drywall LLC',
      dates: 'Oct 01 – Jan 20, 2026',
      duration: '111 days',
      progress: 0,
      status: 'Upcoming',
      budgetAllocation: 480000,
      inspectionPassed: false
    },
    {
      id: `${project.id}-ms-7`,
      code: 'MS-07',
      name: 'Testing, Commissioning & Final Punch',
      subcontractor: 'Integrated Systems LLC',
      dates: 'Jan 15 – Mar 15, 2026',
      duration: '59 days',
      progress: 0,
      status: 'Upcoming',
      budgetAllocation: 320000,
      inspectionPassed: false
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

  // Compute live task metrics for each milestone
  const getMilestoneTaskMetrics = (phase: PhaseItem) => {
    const matching = tasks.filter(t => 
      t.milestone === phase.name || 
      (phase.code && t.milestone?.includes(phase.code)) ||
      (phase.name.toLowerCase().includes('foundation') && t.milestone?.toLowerCase().includes('foundation')) ||
      (phase.name.toLowerCase().includes('framing') && t.milestone?.toLowerCase().includes('framing')) ||
      (phase.name.toLowerCase().includes('excavation') && t.milestone?.toLowerCase().includes('prep')) ||
      (phase.name.toLowerCase().includes('mep') && t.milestone?.toLowerCase().includes('mep'))
    );

    if (matching.length === 0) {
      return {
        totalTasks: phase.status === 'Completed' ? 5 : 4,
        completedTasks: phase.status === 'Completed' ? 5 : phase.status === 'In Progress' ? Math.round(4 * (phase.progress / 100)) : 0,
        progress: phase.progress
      };
    }

    const completed = matching.filter(t => t.status === 'Completed').length;
    const progress = Math.round((completed / matching.length) * 100);
    return {
      totalTasks: matching.length,
      completedTasks: completed,
      progress
    };
  };

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

    const newMilestone: PhaseItem = {
      id: `${project.id}-ms-${Date.now()}`,
      code: newCode.trim() || `MS-0${phases.length + 1}`,
      name: newName.trim(),
      subcontractor: newSubcontractor.trim() || 'General Contractor Lead',
      dates: newDates.trim() || 'TBD',
      duration: newDuration.trim() || '30 days',
      progress: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 25 : 0,
      status: newStatus,
      budgetAllocation: parseFloat(newBudget) || 0,
      inspectionPassed: newStatus === 'Completed'
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
        return {
          ...p,
          status,
          progress: status === 'Completed' ? 100 : status === 'In Progress' ? Math.max(25, p.progress) : 0,
          inspectionPassed: status === 'Completed'
        };
      }
      return p;
    }));
    if (selectedMilestone && selectedMilestone.id === milestoneId) {
      setSelectedMilestone(prev => prev ? {
        ...prev,
        status,
        progress: status === 'Completed' ? 100 : status === 'In Progress' ? Math.max(25, prev.progress) : 0,
        inspectionPassed: status === 'Completed'
      } : null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. CLEAN HEADER WITH ADD MILESTONE BUTTON ─── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              {isMilestoneView ? 'Milestone Gates' : 'Master Schedule'}
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              ({completedCount} of {phases.length} complete)
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">{project.name}</p>
        </div>

        <button
          onClick={() => {
            setNewCode(`MS-0${phases.length + 1}`);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-900/30 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Gate</span>
        </button>
      </div>

      {/* ─── 2. CLEAN FILTER PILLS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {(['All', 'In Progress', 'Completed', 'Upcoming'] as const).map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-sm'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border-[#142036]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ─── 3. REAL CONSTRUCTION SCHEDULE / MILESTONE CARDS (Live Task Count & Progress) ─── */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((phase) => {
          const isDone = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';
          const taskMetrics = getMilestoneTaskMetrics(phase);

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedMilestone(phase)}
              className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] hover:border-blue-500/50 cursor-pointer transition-all active:scale-[0.99] flex flex-col gap-2.5 shadow-sm group"
            >
              {/* Row 1: Code + Phase Title + Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {phase.code && (
                      <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {phase.code}
                      </span>
                    )}
                    <span className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {phase.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate">{phase.subcontractor}</p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1 border ${
                  isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : isInProgress
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-[#0A1328] text-slate-500 border-[#142036]'
                }`}>
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{isDone ? 'Completed' : isInProgress ? `${taskMetrics.progress}%` : 'Upcoming'}</span>
                </span>
              </div>

              {/* Row 2: Dates, Tasks Count, Draw Allocation */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#142036]/60">
                <span className="text-slate-300 font-medium">{phase.dates}</span>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium bg-[#0A1328] px-1.5 py-0.5 rounded border border-[#142036]">
                    {taskMetrics.completedTasks}/{taskMetrics.totalTasks} Tasks
                  </span>
                  {phase.budgetAllocation && (
                    <span className="text-emerald-400 font-bold tabular-nums">
                      ${phase.budgetAllocation.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Progress Bar */}
              <div className="w-full h-1.5 bg-[#0A1328] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500'
                      : isInProgress
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${taskMetrics.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 4. ADD NEW MILESTONE INPUT MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in font-sans">
          <div className="w-full max-w-[430px] bg-[#070C18] border border-[#142036] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-blue-400" />
                  <span>Add Project Milestone Gate</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Define schedule gate, trade subcontractor & draw value</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0A1328] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="flex flex-col gap-3 text-xs">
              {/* Code + Milestone Name */}
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="MS-08"
                    className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Milestone Title</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Dry-In & Roofing Inspection"
                    className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Subcontractor / Lead Trade */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Responsible Subcontractor / Trade</label>
                <input
                  type="text"
                  value={newSubcontractor}
                  onChange={e => setNewSubcontractor(e.target.value)}
                  placeholder="e.g. Apex Roofing & Glazing LLC"
                  className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date Span / Target</label>
                  <input
                    type="text"
                    value={newDates}
                    onChange={e => setNewDates(e.target.value)}
                    placeholder="e.g. Nov 01 – Nov 25, 2025"
                    className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    placeholder="e.g. 25 days"
                    className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Budget / Draw Allocation */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Draw Budget Allocation ($)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  placeholder="e.g. 350000"
                  className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none font-mono"
                />
              </div>

              {/* Initial Status */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Initial Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Upcoming', 'In Progress', 'Completed'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`h-9 rounded-xl text-center font-bold text-[11px] transition-all border cursor-pointer ${
                        newStatus === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-[#060B17] border-[#142036] text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1328] border border-[#142036] text-slate-400 font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-md shadow-blue-900/30"
                >
                  Save Milestone Gate
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
