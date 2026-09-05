import React, { useState } from 'react';
import { Project } from '../../types';
import { Plus, Search, Layers } from 'lucide-react';
import { ProjectCard } from '../common/ProjectCard';

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
      const matchCity = (p.cityState || '').toLowerCase().includes(q);
      const matchCode = (p.code || '').toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ── 1. Top Header with New Project CTA ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Projects
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            {filteredProjects.length} active construction jobsite{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="h-10 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-card active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* ── 2. Search & Segmented Filter Pills ── */}
      <div className="flex flex-col gap-2.5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project name, code, or city..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl">
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'active' 
                ? 'bg-white text-[#1677FF] shadow-xs' 
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Active ({projects.filter(p => p.status !== 'Completed' && p.status !== 'Warranty').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'completed' 
                ? 'bg-white text-[#1677FF] shadow-xs' 
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Completed ({projects.filter(p => p.status === 'Completed' || p.status === 'Warranty').length})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-white text-[#1677FF] shadow-xs' 
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All ({projects.length})
          </button>
        </div>
      </div>

      {/* ── 3. Standard Projects List Feed ── */}
      <div className="flex flex-col gap-3">
        {filteredProjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center text-[#64748B] text-xs flex flex-col items-center gap-2 shadow-xs">
            <Layers className="w-8 h-8 text-[#CBD5E1]" />
            <p className="font-bold text-[#0F172A]">No projects found</p>
            <p className="text-xs">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project)}
            />
          ))
        )}
      </div>

    </div>
  );
};
