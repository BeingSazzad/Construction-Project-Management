import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, Search, MapPin, ChevronRight, Layers, ArrowUpDown
} from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onSelectProject,
  onCreateProject
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'active') {
      if (p.status === 'Completed' || p.status === 'Warranty') return false;
    } else if (activeFilter === 'completed') {
      if (p.status !== 'Completed' && p.status !== 'Warranty') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCity = p.cityState.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ── 1. Top Header with New Project CTA ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#171A1F] tracking-tight">
            Projects
          </h2>
          <p className="text-xs text-[#68707C] font-medium mt-0.5">
            {filteredProjects.length} active construction jobsite{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* ── 2. Search & Segmented Filter Pills ── */}
      <div className="flex flex-col gap-2.5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#68707C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project name, code, or city..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-2xl text-xs text-[#171A1F] placeholder-[#68707C] outline-none transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1 bg-[#EAEDF1] rounded-xl">
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'active' 
                ? 'bg-white text-[#1677FF] shadow-sm' 
                : 'text-[#68707C] hover:text-[#171A1F]'
            }`}
          >
            Active ({projects.filter(p => p.status !== 'Completed' && p.status !== 'Warranty').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'completed' 
                ? 'bg-white text-[#1677FF] shadow-sm' 
                : 'text-[#68707C] hover:text-[#171A1F]'
            }`}
          >
            Completed ({projects.filter(p => p.status === 'Completed' || p.status === 'Warranty').length})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-white text-[#1677FF] shadow-sm' 
                : 'text-[#68707C] hover:text-[#171A1F]'
            }`}
          >
            All ({projects.length})
          </button>
        </div>
      </div>

      {/* ── 3. Projects List Feed ── */}
      <div className="flex flex-col gap-3.5">
        {filteredProjects.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-[#DDE1E7] text-center text-[#68707C] text-xs flex flex-col items-center gap-2 shadow-sm">
            <Layers className="w-8 h-8 text-[#DDE1E7]" />
            <p className="font-bold text-[#171A1F]">No projects found</p>
            <p className="text-[11px]">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const budgetTotalM = (project.budget.total / 1000000).toFixed(2);
            const currentPhase = project.stages?.find(s => s.status === 'In Progress')?.name || 'Construction';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-4 rounded-3xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 transition-all cursor-pointer shadow-sm group active:scale-[0.99] flex flex-col gap-3"
              >
                {/* Header Row: Code/Phase + Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-md uppercase">
                      {project.code}
                    </span>
                    <span className="text-xs text-[#68707C] font-semibold">
                      Phase: {currentPhase}
                    </span>
                  </div>
                  <StatusBadge status={project.status} size="xs" />
                </div>

                {/* Title & Location */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#68707C] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#68707C] flex-shrink-0" />
                      <span className="truncate">{project.location || project.cityState}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                </div>

                {/* Progress & Budget Bar */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[#EAEDF1]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1677FF]">
                      {project.progress}% Complete
                    </span>
                    <span className="font-semibold text-[#171A1F]">
                      ${budgetTotalM}M Budget
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#EAEDF1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1677FF] rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer: PM & Assigned Team */}
                <div className="flex items-center justify-between text-[11px] text-[#68707C] pt-0.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={project.projectManager.avatar}
                      alt={project.projectManager.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#DDE1E7]"
                    />
                    <span>PM: <strong className="text-[#171A1F]">{project.projectManager.name}</strong></span>
                  </div>
                  <span>Target: {project.targetEndDate}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
