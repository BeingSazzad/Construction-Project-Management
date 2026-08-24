import React, { useState } from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Plus, Search, MapPin, Layers, Clock, ArrowRight } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-4 px-5 py-4 pb-24">
      {/* Header & New Project Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white">All Projects</h2>
          <p className="text-xs text-slate-400">Total Portfolio Value: $24.65M</p>
        </div>

        <button
          onClick={onCreateProject}
          className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, locations..."
          className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] overflow-x-auto">
        {(['All', 'Active', 'At Risk', 'Completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="card-dark overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer group bg-gradient-to-b from-[#111827] to-[#0D1322]"
          >
            {/* Thumbnail banner */}
            <div className="h-28 w-full relative overflow-hidden bg-[#0A0D18]">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/30 to-transparent"></div>
              
              <div className="absolute top-2.5 right-2.5">
                <StatusBadge status={project.status} size="xs" />
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-sm font-black text-white truncate tracking-tight drop-shadow-md">
                    {project.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{project.cityState}</span>
                  </p>
                </div>
                <span className="text-xs font-black text-cyan-300 drop-shadow-md">{project.progress}%</span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-3">
              <div className="w-full h-1.5 bg-[#172238] rounded-full overflow-hidden mb-3 flex">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-[#1A263D]">
                <div>
                  <span className="text-[10px] text-slate-400">Budget</span>
                  <p className="font-bold text-white mt-0.5">${(project.budget.total / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Actual</span>
                  <p className="font-bold text-cyan-400 mt-0.5">${(project.budget.actual / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Tasks</span>
                  <p className="font-bold text-slate-200 mt-0.5">{project.metrics.completedTasks}/{project.metrics.totalTasks}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
