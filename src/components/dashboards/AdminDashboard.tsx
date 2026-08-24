import React from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Plus, ChevronRight, Sparkles, MapPin, TrendingUp, DollarSign, FolderKanban } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onOpenLatti: () => void;
  onOpenReports: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onOpenLatti
}) => {
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans">
      {/* 1. Company Overview Card (Matching Exact Inspiration Board) */}
      <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Company Overview</span>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Portfolio Health 94%
          </span>
        </div>

        {/* 4 KPIs (24, 12, 8, 2) */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-[#080D18] p-2.5 rounded-xl border border-[#151F30] text-center">
            <div className="text-lg font-black text-white">24</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Projects</div>
          </div>
          <div className="bg-[#080D18] p-2.5 rounded-xl border border-[#151F30] text-center">
            <div className="text-lg font-black text-blue-400">12</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Active</div>
          </div>
          <div className="bg-[#080D18] p-2.5 rounded-xl border border-amber-500/30 text-center">
            <div className="text-lg font-black text-amber-400">8</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">At Risk</div>
          </div>
          <div className="bg-[#080D18] p-2.5 rounded-xl border border-emerald-500/30 text-center">
            <div className="text-lg font-black text-emerald-400">2</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Completed</div>
          </div>
        </div>

        {/* Financial Line: Total Budget $24.65M, Total Cost $18.45M, Budget Variance +$2.35M */}
        <div className="pt-2.5 border-t border-[#182338] grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Total Budget</span>
            <div className="font-extrabold text-white mt-0.5">$24.65M</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Total Cost</span>
            <div className="font-extrabold text-slate-200 mt-0.5">$18.45M</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Budget Variance</span>
            <div className="font-extrabold text-emerald-400 mt-0.5">+$2.35M <span className="text-[9px] font-normal text-emerald-500">(+9.5%)</span></div>
          </div>
        </div>
      </div>

      {/* 2. Latti Risk Alert */}
      <div 
        onClick={onOpenLatti}
        className="p-3 rounded-xl bg-[#0D1422] border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Latti AI Risk Radar</div>
            <p className="text-xs text-slate-200 truncate font-medium">
              2 tasks in Riverside Complex are at risk of missing milestone
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 flex-shrink-0 ml-1" />
      </div>

      {/* 3. Recent Projects with Rich Thumbnails (Matching Inspiration Board) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Recent Projects
          </h2>
          <button 
            onClick={onCreateProject}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="card-dark p-3 hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 bg-[#0D1422] border-[#1A263B] group shadow-sm"
            >
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#1E293B] flex-shrink-0 group-hover:scale-105 transition-transform"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <StatusBadge status={project.status} size="xs" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                  <span>{project.cityState}</span>
                  <span className="font-bold text-slate-200">${(project.budget.total / 1000000).toFixed(2)}M</span>
                </div>

                <div className="w-full h-1.5 bg-[#172238] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Button (Strict 48px height, 16px bold) */}
      <div className="pt-1">
        <Button
          variant="primary"
          onClick={onCreateProject}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Project
        </Button>
      </div>
    </div>
  );
};
