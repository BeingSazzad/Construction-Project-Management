import React, { useState, useRef, useEffect } from 'react';
import { Project, Task } from '../../types';
import { 
  Plus, Search, ChevronRight, ChevronLeft, ChevronDown, Check, X, Calendar, ArrowUpDown
} from 'lucide-react';
import { MilestoneDetailsModal, MilestoneItem } from '../modals/MilestoneDetailsModal';

interface MilestonesHubViewProps {
  projects: Project[];
  tasks?: Task[];
  onSelectProject?: (project: Project) => void;
  onCreateTask?: () => void;
  onBack?: () => void;
}

// Custom icons matching the user's mockup exactly
const SlabsIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#1677FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M5 12h14" />
      <path d="M5 16h14" />
      <path d="M12 3v18" />
    </svg>
  </div>
);

const TrussIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20" />
      <path d="M4 18L12 6l8 12" />
      <path d="M8 18l4-6 4 6" />
    </svg>
  </div>
);

const MepPipeIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#1677FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h5a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h7" />
      <path d="M3 6v4" />
      <path d="M20 14v4" />
    </svg>
  </div>
);

const GlazingIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 12h16" />
      <path d="M12 4v16" />
    </svg>
  </div>
);

const ExcavatorIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#E9F9F3] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h13a2 2 0 0 0 2-2v-3H4v3a2 2 0 0 0-2 2z" />
      <circle cx="5" cy="18" r="1.5" />
      <circle cx="10" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
      <path d="M7 13V8h5l3 5" />
      <path d="M15 8l4-4 2 3-3 3" />
    </svg>
  </div>
);

const PermitFileIcon = () => (
  <div className="w-12 h-12 rounded-2xl bg-[#E9F9F3] flex items-center justify-center flex-shrink-0">
    <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  </div>
);

type MilestoneData = MilestoneItem & {
  projectId: string;
  projectName: string;
  dotColor?: string;
  iconType?: 'slabs' | 'trusses' | 'mep' | 'glazing' | 'excavation' | 'permits';
};

const INITIAL_MILESTONES: MilestoneData[] = [
  {
    id: 'ms-3',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
    code: 'MS-03',
    name: 'Structural Concrete Slabs',
    subcontractor: 'Apex Concrete Masters',
    dates: 'Apr 11 – Jul 20, 2025',
    duration: '100 days',
    progress: 20,
    status: 'In Progress',
    budgetAllocation: 850000,
    inspectionPassed: false,
    dotColor: 'bg-[#1677FF]',
    iconType: 'slabs'
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
    inspectionPassed: false,
    dotColor: 'bg-[#F59E0B]',
    iconType: 'trusses'
  },
  {
    id: 'ms-5',
    projectId: 'proj-001',
    projectName: 'Snell Isle Residence',
    code: 'MS-05',
    name: 'MEP Utility Rough-in & Riser',
    subcontractor: 'Prime Electrical & Mechanical',
    dates: 'Jun 01 – Sep 15, 2025',
    duration: '106 days',
    progress: 35,
    status: 'In Progress',
    budgetAllocation: 920000,
    inspectionPassed: false,
    dotColor: 'bg-[#1677FF]',
    iconType: 'mep'
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
    progress: 15,
    status: 'Upcoming',
    budgetAllocation: 540000,
    inspectionPassed: false,
    dotColor: 'bg-[#F59E0B]',
    iconType: 'glazing'
  },
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
    inspectionPassed: true,
    iconType: 'excavation'
  },
  {
    id: 'ms-2',
    projectId: 'proj-2',
    projectName: '104 Ocean Drive',
    code: 'MS-02',
    name: 'Permits & Approvals',
    subcontractor: 'Metro Building Dept',
    dates: 'Dec 01 – Jan 05, 2025',
    duration: '35 days',
    progress: 100,
    status: 'Completed',
    budgetAllocation: 120000,
    inspectionPassed: true,
    iconType: 'permits'
  }
];

export const MilestonesHubView: React.FC<MilestonesHubViewProps> = ({
  projects,
  tasks = [],
  onCreateTask,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'board'>('milestones');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<(MilestoneItem & { projectName?: string }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [milestonesList, setMilestonesList] = useState<MilestoneData[]>(INITIAL_MILESTONES);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sorting states
  const [sortUpcoming, setSortUpcoming] = useState<'earliest' | 'latest'>('earliest');
  const [sortCompleted, setSortCompleted] = useState<'recent' | 'oldest'>('recent');

  // New Milestone Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-15');
  const [newProjId, setNewProjId] = useState(projects[0]?.id || 'proj-001');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const upcomingCount = milestonesList.filter(m => m.status !== 'Completed').length;
  const completedCount = milestonesList.filter(m => m.status === 'Completed').length;

  const filteredMilestones = milestonesList.filter(m => {
    if (selectedProjectId !== 'all' && m.projectId !== selectedProjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.projectName.toLowerCase().includes(q) ||
        (m.code && m.code.toLowerCase().includes(q)) ||
        m.subcontractor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const upcomingMilestones = filteredMilestones.filter(m => m.status !== 'Completed');
  const completedMilestones = filteredMilestones.filter(m => m.status === 'Completed');

  const sortedUpcoming = [...upcomingMilestones].sort((a, b) => {
    if (sortUpcoming === 'latest') {
      return b.id.localeCompare(a.id);
    }
    return a.id.localeCompare(b.id);
  });

  const sortedCompleted = [...completedMilestones].sort((a, b) => {
    if (sortCompleted === 'oldest') {
      return a.id.localeCompare(b.id);
    }
    return b.id.localeCompare(a.id);
  });

  const renderMilestoneIcon = (item: MilestoneData) => {
    if (item.status === 'Completed') {
      if (item.iconType === 'permits' || item.name.toLowerCase().includes('permit') || item.name.toLowerCase().includes('approval')) {
        return <PermitFileIcon />;
      }
      return <ExcavatorIcon />;
    }
    if (item.iconType === 'slabs' || item.name.toLowerCase().includes('concrete') || item.name.toLowerCase().includes('slab')) {
      return <SlabsIcon />;
    }
    if (item.iconType === 'trusses' || item.name.toLowerCase().includes('framing') || item.name.toLowerCase().includes('truss')) {
      return <TrussIcon />;
    }
    if (item.iconType === 'mep' || item.name.toLowerCase().includes('mep') || item.name.toLowerCase().includes('utility')) {
      return <MepPipeIcon />;
    }
    return <GlazingIcon />;
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const projObj = projects.find(p => p.id === newProjId) || projects[0];
    const newMs: MilestoneData = {
      id: `ms-${Date.now()}`,
      projectId: projObj.id,
      projectName: projObj.name,
      code: `MS-0${milestonesList.length + 1}`,
      name: newTitle.trim(),
      subcontractor: 'Assigned Subcontractor',
      dates: newDate,
      duration: '30 days',
      progress: 0,
      status: 'Upcoming',
      budgetAllocation: 250000,
      inspectionPassed: false,
      dotColor: 'bg-[#F59E0B]',
      iconType: 'trusses'
    };

    setMilestonesList(prev => [newMs, ...prev]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const selectedProjectName = selectedProjectId === 'all' 
    ? 'All projects' 
    : (projects.find(p => p.id === selectedProjectId)?.name || 'All projects');

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-4 sm:px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ─── 0. TOP HEADER BAR WITH BACK BUTTON, TITLES & ADD MILESTONE ─── */}
      <div className="flex items-start justify-between gap-2.5 pt-1">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-xs active:scale-95 flex-shrink-0 mt-0.5"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Milestone Tracker
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Track key project milestones
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'milestones') {
              setIsAddModalOpen(true);
            } else if (onCreateTask) {
              onCreateTask();
            }
          }}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 cursor-pointer active:scale-95 flex-shrink-0 mt-0.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{activeTab === 'milestones' ? 'Add Milestone' : 'Add Task'}</span>
        </button>
      </div>

      {/* ─── 1. SEGMENTED TABS: MILESTONES & TASK BOARD ─── */}
      <div className="flex items-center p-1 bg-white border border-slate-200/90 rounded-2xl shadow-xs mt-1">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-center cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-center cursor-pointer ${
            activeTab === 'board'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          Task Board
        </button>
      </div>

      {/* ─── 2. SEARCH & PROJECT FILTER BAR ─── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={activeTab === 'milestones' ? "Search milestones..." : "Search tasks..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1677FF] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Project Select Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="h-11 px-3.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2 cursor-pointer shadow-xs hover:border-slate-300 transition-all"
          >
            <span className="truncate max-w-[105px] sm:max-w-[130px]">
              {selectedProjectName}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-1 text-xs">
              <button
                type="button"
                onClick={() => { setSelectedProjectId('all'); setIsProjectDropdownOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 font-medium flex items-center justify-between hover:bg-slate-50 ${selectedProjectId === 'all' ? 'text-[#1677FF] font-bold bg-blue-50/50' : 'text-slate-700'}`}
              >
                <span>All projects</span>
                {selectedProjectId === 'all' && <Check className="w-3.5 h-3.5 text-[#1677FF]" />}
              </button>
              {projects.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setSelectedProjectId(p.id); setIsProjectDropdownOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 font-medium flex items-center justify-between hover:bg-slate-50 ${selectedProjectId === p.id ? 'text-[#1677FF] font-bold bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span className="truncate">{p.name}</span>
                  {selectedProjectId === p.id && <Check className="w-3.5 h-3.5 text-[#1677FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. MAIN CONTENT AREA ─── */}
      {activeTab === 'milestones' ? (
        <div className="flex flex-col gap-4 mt-1">
          
          {/* ─── UPCOMING SECTION ─── */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Upcoming ({upcomingMilestones.length})
              </h2>
              <button
                type="button"
                onClick={() => setSortUpcoming(prev => prev === 'earliest' ? 'latest' : 'earliest')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{sortUpcoming === 'earliest' ? 'Earliest first' : 'Latest first'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {sortedUpcoming.length === 0 ? (
              <div className="p-6 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-500 shadow-xs">
                No upcoming milestones found
              </div>
            ) : (
              sortedUpcoming.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => setSelectedMilestone(ms)}
                  className="bg-white rounded-2xl border border-slate-100 p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3.5">
                    {renderMilestoneIcon(ms)}

                    <div className="flex-1 min-w-0">
                      {/* Row 1: dot + title + date */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ms.dotColor || (ms.status === 'In Progress' ? 'bg-[#1677FF]' : 'bg-[#F59E0B]')}`} />
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#1677FF] transition-colors">
                            {ms.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-500 text-xs font-normal">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ms.dates}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Row 2: code badge + project name */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#EAF3FF] text-[#1677FF] text-[11px] font-bold">
                          {ms.code || 'MS-00'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {ms.projectName}
                        </span>
                      </div>

                      {/* Row 3: progress bar */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1677FF] transition-all duration-300"
                            style={{ width: `${ms.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-medium flex-shrink-0">
                          {ms.progress}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ─── COMPLETED SECTION ─── */}
          {completedMilestones.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Completed ({completedMilestones.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setSortCompleted(prev => prev === 'recent' ? 'oldest' : 'recent')}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sortCompleted === 'recent' ? 'Most recent' : 'Oldest first'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {sortedCompleted.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => setSelectedMilestone(ms)}
                  className="bg-white rounded-2xl border border-slate-100 p-3.5 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3.5">
                    {renderMilestoneIcon(ms)}

                    <div className="flex-1 min-w-0">
                      {/* Row 1: check + title + date */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {ms.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-500 text-xs font-normal">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ms.dates}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Row 2: completed badge + project name */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#E9F9F3] text-[#10B981] text-[11px] font-bold">
                          Completed
                        </span>
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {ms.projectName}
                        </span>
                      </div>

                      {/* Row 3: progress bar */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#10B981] transition-all duration-300"
                            style={{ width: `100%` }}
                          />
                        </div>
                        <span className="text-xs text-[#10B981] font-semibold flex-shrink-0">
                          100% complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* ─── TASK BOARD VIEW MODE ─── */
        <div className="flex flex-col gap-3 mt-1">
          {tasks.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-500 shadow-xs">
              No tasks currently on the board.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#1677FF]/50 transition-all flex flex-col gap-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
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

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{task.projectName}</span>
                  <span>Due: {task.dueDate || '2025-06-15'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 4. ADD MILESTONE MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="w-full max-w-[430px] bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Add New Milestone</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestoneSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Framing inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 bg-white border border-slate-200 focus:border-[#1677FF] rounded-xl px-4 text-xs text-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Target Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full h-10 bg-white border border-slate-200 focus:border-[#1677FF] rounded-xl px-4 text-xs text-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Assigned Project</label>
                <select
                  value={newProjId}
                  onChange={(e) => setNewProjId(e.target.value)}
                  className="w-full h-10 bg-white border border-slate-200 focus:border-[#1677FF] rounded-xl px-3 text-xs text-slate-900 outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 5. MILESTONE DETAILS MODAL ─── */}
      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          projectName={selectedMilestone.projectName}
          projectTasks={tasks}
          onClose={() => setSelectedMilestone(null)}
          onUpdateStatus={(id, st) => {
            setMilestonesList(prev => prev.map(m => m.id === id ? { ...m, status: st, progress: st === 'Completed' ? 100 : m.progress } : m));
          }}
          onDeleteMilestone={(id) => {
            setMilestonesList(prev => prev.filter(m => m.id !== id));
            setSelectedMilestone(null);
          }}
        />
      )}

    </div>
  );
};
