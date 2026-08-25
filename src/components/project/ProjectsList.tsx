import React, { useState } from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Plus, Search, MapPin, Building2, Calendar, DollarSign, ChevronRight, CheckSquare, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white tracking-tight">Projects Portfolio</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {projects.length} Active Sites · ${(totalValue / 1000000).toFixed(1)}M Total Value
          </p>
        </div>

        <button
          onClick={onCreateProject}
          className="h-9 px-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Input (Compact with clean border) */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name or location..."
          className="w-full h-9 bg-[#0B1120] border border-[#162238] rounded-xl pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      {/* Segmented Filter Pills (Compact Property Style) */}
      <div className="flex items-center gap-1 p-1 bg-[#0B1120] rounded-xl border border-[#162238]">
        {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Compact High-Density Project Cards List */}
      <div className="flex flex-col gap-3">
        {filtered.map((project) => {
          const budgetTotalM = (project.budget.total / 1000000).toFixed(2);
          const budgetActualM = (project.budget.actual / 1000000).toFixed(2);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="p-3.5 rounded-2xl bg-[#0B1120] border border-[#162238] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group flex flex-col gap-2.5"
            >
              {/* Top Banner Row with Image, Title and Status */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#070A12] border border-[#182438] flex-shrink-0 relative">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} size="xs" />
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{project.cityState}</span>
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span className="font-semibold text-slate-400">PM: {project.projectManager.name}</span>
                    <span>•</span>
                    <span>{project.metrics.totalTasks} Tasks</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Row */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Construction Progress</span>
                  <span className="font-bold text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#121E36] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-[#00D2B4] rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Compact 3-Column Metrics (Matching Compact Property Style) */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#141F33] text-center">
                <div className="p-1.5 rounded-lg bg-[#0E1626]">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Budget</span>
                  <span className="text-xs font-extrabold text-white mt-0.5 block">${budgetTotalM}M</span>
                </div>

                <div className="p-1.5 rounded-lg bg-[#0E1626]">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Spent</span>
                  <span className="text-xs font-extrabold text-[#00D2B4] mt-0.5 block">${budgetActualM}M</span>
                </div>

                <div className="p-1.5 rounded-lg bg-[#0E1626]">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Remaining</span>
                  <span className="text-xs font-extrabold text-blue-400 mt-0.5 block">
                    ${((project.budget.total - project.budget.actual) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
