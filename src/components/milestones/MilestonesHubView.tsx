import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { 
  Plus, Search, ChevronRight, X
} from 'lucide-react';
import { MilestoneDetailsModal, MilestoneItem } from '../modals/MilestoneDetailsModal';
import { CustomSelect } from '../common/CustomSelect';

interface MilestonesHubViewProps {
  projects: Project[];
  tasks?: Task[];
  onSelectProject?: (project: Project) => void;
  onCreateTask?: () => void;
}

const INITIAL_MILESTONES: (MilestoneItem & { projectId: string; projectName: string })[] = [
  {
    id: 'ms-1',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
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
    id: 'ms-2',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
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
    id: 'ms-3',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
    code: 'MS-03',
    name: 'Structural Concrete Slabs & Columns',
    subcontractor: 'Apex Concrete Masters',
    dates: 'Apr 11 – Jul 20, 2025',
    duration: '100 days',
    progress: 68,
    status: 'In Progress',
    budgetAllocation: 850000,
    inspectionPassed: false
  },
  {
    id: 'ms-4',
    projectId: 'proj-2',
    projectName: '104 Ocean Drive',
    code: 'MS-04',
    name: 'Framing Inspection & Trusses',
    subcontractor: 'Craft Framing LLC',
    dates: 'Sep 15, 2026',
    duration: '24 days',
    progress: 0,
    status: 'Upcoming',
    budgetAllocation: 380000,
    inspectionPassed: false
  },
  {
    id: 'ms-5',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
    code: 'MS-05',
    name: 'MEP Utility Rough-in & Risers',
    subcontractor: 'Prime Electrical & Mechanical',
    dates: 'Jun 01 – Sep 15, 2025',
    duration: '106 days',
    progress: 35,
    status: 'In Progress',
    budgetAllocation: 920000,
    inspectionPassed: false
  },
  {
    id: 'ms-6',
    projectId: 'proj-3',
    projectName: 'Highland Park Modern',
    code: 'MS-06',
    name: 'Curtain Wall Facade & Glazing',
    subcontractor: 'Apex Glass Architectural',
    dates: 'Oct 10 – Nov 30, 2025',
    duration: '51 days',
    progress: 0,
    status: 'Upcoming',
    budgetAllocation: 540000,
    inspectionPassed: false
  }
];

export const MilestonesHubView: React.FC<MilestonesHubViewProps> = ({
  projects,
  tasks = [],
  onCreateTask
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'board'>('milestones');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<(MilestoneItem & { projectName?: string }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [milestonesList, setMilestonesList] = useState(INITIAL_MILESTONES);

  // New Milestone State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-15');
  const [newProjId, setNewProjId] = useState(projects[0]?.id || 'proj-001');

  const upcomingCount = milestonesList.filter(m => m.status !== 'Completed').length;
  const completedCount = milestonesList.filter(m => m.status === 'Completed').length;

  const filteredMilestones = milestonesList.filter(m => {
    if (selectedProjectId !== 'all' && m.projectId !== selectedProjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.projectName.toLowerCase().includes(q) ||
        m.subcontractor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const upcomingMilestones = filteredMilestones.filter(m => m.status !== 'Completed');
  const completedMilestones = filteredMilestones.filter(m => m.status === 'Completed');

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const projObj = projects.find(p => p.id === newProjId) || projects[0];
    const newMs = {
      id: `ms-${Date.now()}`,
      projectId: projObj.id,
      projectName: projObj.name,
      code: `MS-0${milestonesList.length + 1}`,
      name: newTitle.trim(),
      subcontractor: 'Assigned Subcontractor',
      dates: newDate,
      duration: '30 days',
      progress: 0,
      status: 'Upcoming' as const,
      budgetAllocation: 250000,
      inspectionPassed: false
    };

    setMilestonesList(prev => [newMs, ...prev]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const projectSelectOptions = [
    { value: 'all', label: 'All projects' },
    ...projects.map(p => ({ value: p.id, label: p.name }))
  ];

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ─── 1. HEADER ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#171A1F] tracking-tight">
            {activeTab === 'milestones' ? 'Milestones' : 'Tasks'}
          </h1>
          <p className="text-xs text-[#68707C] font-medium mt-0.5">
            {activeTab === 'milestones'
              ? `${upcomingCount} upcoming · ${completedCount} completed`
              : 'Move tasks across your build workflow'}
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'milestones') {
              setIsAddModalOpen(true);
            } else if (onCreateTask) {
              onCreateTask();
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{activeTab === 'milestones' ? 'Add Milestone' : 'Add Task'}</span>
        </button>
      </div>

      {/* ─── 2. TAB SWITCHER TOGGLE ─── */}
      <div className="flex items-center p-1 bg-white border border-[#DDE1E7] rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeTab === 'board'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          Task Board
        </button>
      </div>

      {/* ─── 3. SEARCH & PROJECT FILTER BAR ─── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#68707C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'milestones' ? "Search milestones..." : "Search tasks..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-2xl pl-9 pr-4 text-xs text-[#171A1F] outline-none placeholder-[#9DA5B1] transition-all shadow-xs"
          />
        </div>

        <div className="w-36 flex-shrink-0">
          <CustomSelect
            options={projectSelectOptions}
            value={selectedProjectId}
            onChange={(val) => setSelectedProjectId(val)}
            size="md"
          />
        </div>
      </div>

      {/* ─── 4. MAIN CONTENT AREA ─── */}
      {activeTab === 'milestones' ? (
        <div className="flex flex-col gap-5 mt-1">
          
          {/* UPCOMING SECTION */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-bold text-[#68707C] uppercase tracking-wider">
                UPCOMING ({upcomingMilestones.length})
              </h2>
            </div>

            {upcomingMilestones.length === 0 ? (
              <div className="p-6 text-center bg-white border border-[#DDE1E7] rounded-2xl text-xs text-[#68707C] shadow-xs">
                No upcoming milestones found
              </div>
            ) : (
              upcomingMilestones.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => setSelectedMilestone(ms)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 cursor-pointer transition-all active:scale-[0.99] shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      ms.status === 'In Progress' ? 'bg-[#1677FF]' : 'bg-amber-500'
                    }`} />

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
                        {ms.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[10px] font-bold text-[#1677FF]">
                          {ms.code || 'Milestone'}
                        </span>
                        <span className="text-[11px] text-[#68707C] font-medium truncate">
                          {ms.projectName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-medium text-[#68707C]">
                      {ms.dates}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#9DA5B1] group-hover:text-[#1677FF] transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COMPLETED SECTION */}
          {completedMilestones.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold text-[#68707C] uppercase tracking-wider">
                  COMPLETED ({completedMilestones.length})
                </h2>
              </div>

              {completedMilestones.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => setSelectedMilestone(ms)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-emerald-500/50 cursor-pointer transition-all active:scale-[0.99] shadow-xs group opacity-90"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] truncate group-hover:text-emerald-700 transition-colors">
                        {ms.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                        <span className="text-[11px] text-[#68707C] font-medium truncate">
                          {ms.projectName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-medium text-[#68707C]">
                      {ms.dates}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#9DA5B1] group-hover:text-emerald-700 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* TASK BOARD VIEW MODE */
        <div className="flex flex-col gap-3 mt-1">
          {tasks.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#DDE1E7] rounded-2xl text-xs text-[#68707C] shadow-xs">
              No tasks currently on the board.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 transition-all flex flex-col gap-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] leading-snug">
                    {task.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                    task.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : task.status === 'In Progress'
                      ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/20'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#68707C] font-medium">
                  <span>{task.projectName}</span>
                  <span>Due: {task.dueDate || '2025-06-15'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 5. ADD MILESTONE MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="w-full max-w-[430px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#171A1F]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Add New Milestone</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestoneSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#68707C] block mb-1">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Framing inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-2xl px-4 text-xs text-[#171A1F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#68707C] block mb-1">Target Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-2xl px-4 text-xs text-[#171A1F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#68707C] block mb-1">Assigned Project</label>
                <CustomSelect
                  options={projects.map(p => ({ value: p.id, label: p.name }))}
                  value={newProjId}
                  onChange={(val) => setNewProjId(val)}
                  size="lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-10 rounded-2xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#171A1F] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 6. MILESTONE DETAILS MODAL ─── */}
      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          projectName={selectedMilestone.projectName}
          projectTasks={tasks}
          onClose={() => setSelectedMilestone(null)}
          onUpdateStatus={(id, st) => {
            setMilestonesList(prev => prev.map(m => m.id === id ? { ...m, status: st, progress: st === 'Completed' ? 100 : m.progress } : m));
          }}
        />
      )}

    </div>
  );
};
