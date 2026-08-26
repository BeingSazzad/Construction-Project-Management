import React, { useState } from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Plus, Search, MapPin, ChevronRight, CheckSquare, DollarSign, Calendar, TrendingUp, Filter } from 'lucide-react';

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
  const [filter, setFilter] = useState<'All' | 'On Schedule' | 'At Risk' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = projects.filter(p => {
    if (filter === 'On Schedule' && p.status !== 'On Schedule') return false;
    if (filter === 'At Risk' && p.status !== 'At Risk' && p.status !== 'Delayed') return false;
    if (filter === 'Completed' && p.status !== 'Completed') return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.cityState.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalValue = projects.reduce((acc, p) => acc + (p.budget?.total || 0), 0);
  const atRiskCount = projects.filter(p => p.status === 'At Risk' || p.status === 'Delayed').length;

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {projects.length} Sites · <span className="text-white font-bold">${(totalValue / 1000000).toFixed(1)}M</span> Total Value
            {atRiskCount > 0 && (
              <span className="ml-1.5 text-amber-400 font-bold">· {atRiskCount} At Risk</span>
            )}
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="h-9 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or location..."
          className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {(['All', 'On Schedule', 'At Risk', 'Completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === f
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
            }`}
          >
            {f === 'All' ? `All (${projects.length})` : f}
          </button>
        ))}
      </div>

      {/* ── Project Cards ── */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center text-slate-400 text-xs">
            No projects match this filter.
          </div>
        ) : (
          filtered.map((project) => {
            const budgetTotalM = (project.budget.total / 1000000).toFixed(2);
            const budgetActualM = (project.budget.actual / 1000000).toFixed(2);
            const isAtRisk = project.status === 'At Risk' || project.status === 'Delayed';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm group overflow-hidden active:scale-[0.99]"
              >
                {/* Hero Thumbnail */}
                <div className="h-28 w-full relative overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-[#070D1A]/30 to-transparent" />

                  {/* Floating status badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={project.status} size="xs" />
                  </div>

                  {/* Location pill */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-[#060913]/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-white font-medium">{project.cityState}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col gap-2.5">
                  {/* Title + PM */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        PM: <span className="text-slate-300 font-semibold">{project.projectManager.name}</span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0 mt-0.5" />
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-[#050811] rounded-xl border border-[#142036] text-center">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Budget</p>
                      <p className="text-xs font-bold text-white mt-0.5">${budgetTotalM}M</p>
                    </div>
                    <div className="p-2 bg-[#050811] rounded-xl border border-[#142036] text-center">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Spent</p>
                      <p className={`text-xs font-bold mt-0.5 ${isAtRisk ? 'text-amber-400' : 'text-emerald-400'}`}>${budgetActualM}M</p>
                    </div>
                    <div className="p-2 bg-[#050811] rounded-xl border border-[#142036] text-center">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Progress</p>
                      <p className="text-xs font-bold text-white mt-0.5">{project.progress}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isAtRisk ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-blue-600 to-emerald-500'}`}
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
