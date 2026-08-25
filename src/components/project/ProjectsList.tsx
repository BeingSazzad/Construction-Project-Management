import React, { useState } from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Plus, Search, MapPin, ChevronRight, CheckSquare } from 'lucide-react';

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
  const [filter, setFilter] = useState<'All' | 'Active' | 'At Risk' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = projects.filter(p => {
    if (filter === 'Active' && p.status !== 'On Schedule' && p.status !== 'At Risk') return false;
    if (filter === 'At Risk' && p.status !== 'At Risk') return false;
    if (filter === 'Completed' && p.status !== 'Completed') return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.cityState.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalValue = projects.reduce((acc, p) => acc + (p.budget?.total || 0), 0);

  return (
    <div className="flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Projects Portfolio</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {projects.length} Active Sites · ${(totalValue / 1000000).toFixed(1)}M Total Value
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="h-10 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name or location..."
          className="w-full h-10 bg-[#0D1424] border border-[#1E2C48] rounded-xl pl-9 pr-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] transition-colors"
        />
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1 p-1 bg-[#0D1424] rounded-xl border border-[#1A263E]">
        {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Project Cards List */}
      <div className="flex flex-col gap-3">
        {filtered.map((project) => {
          const budgetTotalM = (project.budget.total / 1000000).toFixed(2);
          const budgetActualM = (project.budget.actual / 1000000).toFixed(2);
          const remainingM = ((project.budget.total - project.budget.actual) / 1000000).toFixed(2);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group flex flex-col gap-3"
            >
              {/* Top Banner Row with Image, Title and Status */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#090E1A] border border-[#1E2C48] flex-shrink-0 relative">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} size="xs" />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{project.cityState}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                    <span>PM: {project.projectManager.name}</span>
                    <span>•</span>
                    <span>{project.metrics.totalTasks} Tasks</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Progress</span>
                  <span className="font-bold text-slate-200">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#141F33] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* 3-Column Metrics (Clean 12px/14px fonts, no tiny illegible text) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#162238] text-center">
                <div className="p-2 rounded-xl bg-[#090E1A] border border-[#141F33]">
                  <span className="text-xs font-semibold text-slate-400 block">Budget</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">${budgetTotalM}M</span>
                </div>

                <div className="p-2 rounded-xl bg-[#090E1A] border border-[#141F33]">
                  <span className="text-xs font-semibold text-slate-400 block">Spent</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">${budgetActualM}M</span>
                </div>

                <div className="p-2 rounded-xl bg-[#090E1A] border border-[#141F33]">
                  <span className="text-xs font-semibold text-slate-400 block">Remaining</span>
                  <span className="text-sm font-bold text-blue-400 mt-0.5 block">${remainingM}M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
