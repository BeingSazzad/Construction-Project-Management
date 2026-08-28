import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, Search, MapPin, ChevronRight, Check, 
  ArrowUpDown, ChevronDown, CheckSquare, DollarSign, 
  Calendar, Layers, Clock
} from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
}

export type ProjectSortOption = 'Newest Created' | 'Status' | 'Tasks Complete' | 'Budget (High to Low)';

export const STATUS_FILTER_OPTIONS: Array<'All Status' | ProjectStatus> = [
  'All Status',
  'Planning',
  'Pre-Construction',
  'In Progress',
  'On Hold',
  'Completed',
  'Warranty'
];

export const SORT_OPTIONS: ProjectSortOption[] = [
  'Newest Created',
  'Status',
  'Tasks Complete',
  'Budget (High to Low)'
];

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onSelectProject,
  onCreateProject
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'All Status' | ProjectStatus>('All Status');
  const [selectedSort, setSelectedSort] = useState<ProjectSortOption>('Newest Created');
  const [searchQuery, setSearchQuery] = useState('');

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter logic
  const filteredProjects = projects.filter(p => {
    // Status Filter
    if (selectedStatus !== 'All Status' && p.status !== selectedStatus) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCity = p.cityState.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchPM = p.projectManager.name.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCode && !matchPM) return false;
    }
    return true;
  });

  // Sort logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (selectedSort === 'Newest Created') {
      return new Date(b.startDate || '2024-01-01').getTime() - new Date(a.startDate || '2024-01-01').getTime();
    }
    if (selectedSort === 'Status') {
      const order: Record<string, number> = {
        'Planning': 1,
        'Pre-Construction': 2,
        'In Progress': 3,
        'On Hold': 4,
        'Completed': 5,
        'Warranty': 6
      };
      return (order[a.status] || 99) - (order[b.status] || 99);
    }
    if (selectedSort === 'Tasks Complete') {
      const aDone = a.metrics?.completedTasks || 0;
      const bDone = b.metrics?.completedTasks || 0;
      return bDone - aDone;
    }
    if (selectedSort === 'Budget (High to Low)') {
      return (b.budget?.total || 0) - (a.budget?.total || 0);
    }
    return 0;
  });

  const totalValue = projects.reduce((acc, p) => acc + (p.budget?.total || 0), 0);
  const activeCount = projects.filter(p => p.status === 'In Progress' || p.status === 'Pre-Construction').length;

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ─── 1. HEADER ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {projects.length} total projects · <span className="text-emerald-400 font-bold">${(totalValue / 1000000).toFixed(1)}M</span> Portfolio
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* ─── 2. SEARCH BAR ─── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white bg-[#0A1424] px-1.5 py-0.5 rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ─── 3. WEB-ALIGNED CONTROLS: STATUS & SORT DROPDOWNS ─── */}
      <div className="grid grid-cols-2 gap-2 relative z-30">
        
        {/* Status Dropdown */}
        <div ref={statusDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsSortDropdownOpen(false);
            }}
            className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedStatus !== 'All Status'
                ? 'bg-[#091E33] border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-[#070D1A] border-[#142036] hover:border-slate-600 text-white'
            }`}
          >
            <span className="truncate">{selectedStatus}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          {/* Status Dropdown Menu (Exact Web Reference Style) */}
          {isStatusDropdownOpen && (
            <div className="absolute top-12 left-0 right-0 bg-[#0A111F] border border-[#1E2E4A] rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-fade-in backdrop-blur-xl">
              {STATUS_FILTER_OPTIONS.map((opt) => {
                const isSelected = selectedStatus === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(opt);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold' 
                        : 'text-slate-300 hover:bg-[#101B2E] hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div ref={sortDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSortDropdownOpen(!isSortDropdownOpen);
              setIsStatusDropdownOpen(false);
            }}
            className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedSort !== 'Newest Created'
                ? 'bg-[#0D1830] border-blue-500/50 text-blue-300 shadow-sm'
                : 'bg-[#070D1A] border-[#142036] hover:border-slate-600 text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{selectedSort}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
          </button>

          {/* Sort Dropdown Menu (Exact Web Reference Style) */}
          {isSortDropdownOpen && (
            <div className="absolute top-12 left-0 right-0 bg-[#0A111F] border border-[#1E2E4A] rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-fade-in backdrop-blur-xl">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = selectedSort === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedSort(opt);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-500/20 text-blue-300 font-bold' 
                        : 'text-slate-300 hover:bg-[#101B2E] hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ─── 4. RESULTS COUNT PILL ─── */}
      <div className="flex items-center justify-between text-[12px] text-slate-400 font-medium px-0.5">
        <span>Showing {sortedProjects.length} of {projects.length} sites</span>
        {selectedStatus !== 'All Status' && (
          <button
            onClick={() => setSelectedStatus('All Status')}
            className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* ─── 5. PROJECT CARDS FEED ─── */}
      <div className="flex flex-col gap-4">
        {sortedProjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Layers className="w-8 h-8 text-slate-600" />
            <p className="font-semibold text-slate-300">No projects found</p>
            <p className="text-[12px] text-slate-500">Try changing your search term or status filter.</p>
          </div>
        ) : (
          sortedProjects.map((project) => {
            const budgetTotalM = (project.budget.total / 1000000).toFixed(2);
            const budgetActualM = (project.budget.actual / 1000000).toFixed(2);
            const isAtRisk = project.status === 'On Hold' || project.budget.variance > 0;

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="rounded-3xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 transition-all cursor-pointer shadow-md group overflow-hidden active:scale-[0.99]"
              >
                {/* Hero Thumbnail Banner */}
                <div className="h-32 w-full relative overflow-hidden bg-[#050811]">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/40 to-transparent" />

                  {/* Floating Status Badge (Web Aligned Status) */}
                  <div className="absolute top-3 right-3 z-10">
                    <StatusBadge status={project.status} size="xs" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-3">
                  
                  {/* Title + Location & PM */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors leading-tight">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium min-w-0">
                        <div className="flex items-center gap-1 min-w-0 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-slate-300 font-semibold truncate">{project.cityState}</span>
                        </div>
                        <span className="text-slate-600 flex-shrink-0">•</span>
                        <span className="truncate text-slate-400">PM: <strong className="text-slate-200 font-semibold">{project.projectManager.name}</strong></span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                    <div className="p-2.5 bg-[#050811] rounded-2xl border border-[#142036] text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Budget</p>
                      <p className="text-xs font-bold text-white mt-0.5">${budgetTotalM}M</p>
                    </div>
                    <div className="p-2.5 bg-[#050811] rounded-2xl border border-[#142036] text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Spent</p>
                      <p className={`text-xs font-bold mt-0.5 ${isAtRisk ? 'text-amber-400' : 'text-emerald-400'}`}>${budgetActualM}M</p>
                    </div>
                    <div className="p-2.5 bg-[#050811] rounded-2xl border border-[#142036] text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Progress</p>
                      <p className="text-xs font-bold text-white mt-0.5">{project.progress}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#142036] mt-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.status === 'Completed' || project.status === 'Warranty'
                          ? 'bg-emerald-500'
                          : isAtRisk
                          ? 'bg-gradient-to-r from-amber-500 to-red-500'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
