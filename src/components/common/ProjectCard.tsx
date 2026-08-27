import React from 'react';
import { MapPin } from 'lucide-react';
import { Project } from '../../types';
import { StatusBadge } from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const spentM = (project.budget.actual / 1000000).toFixed(2);
  const totalM = (project.budget.total / 1000000).toFixed(2);

  return (
    <div
      onClick={onClick}
      className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm group active:scale-[0.99]"
    >
      {/* Top Header Row: Thumbnail + Full-Width Title & Status Badge */}
      <div className="flex items-start gap-3">
        <img
          src={project.thumbnail || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'}
          alt={project.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-10 h-10 rounded-xl object-cover border border-[#1E2C48] flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5 shadow-sm"
        />

        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {/* Line 1: Title + Status Badge */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h3 className="text-sm font-bold text-[#3875F6] group-hover:underline leading-tight min-w-0 flex-1 truncate whitespace-nowrap">
              {project.name}
            </h3>
            <StatusBadge status={project.status} size="xs" />
          </div>

          {/* Line 2: Location & PM */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{project.cityState}</span>
            <span className="text-slate-500">•</span>
            <span className="truncate font-semibold text-slate-200">{project.projectManager.name}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Budget Spent + Gold Accent + Raw Percentage */}
      <div className="flex flex-col gap-1.5 pt-0.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-300 truncate">
            Spent <strong className="text-amber-400 font-bold">${spentM}M</strong> of <strong className="text-white font-bold">${totalM}M</strong>
          </span>

          <span className="text-xs font-bold text-white flex-shrink-0">
            {project.progress}%
          </span>
        </div>

        {/* Linear Progress Bar Track */}
        <div className="w-full h-1 bg-[#121B2D] rounded-full overflow-hidden border border-[#162238]">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
