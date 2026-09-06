import React from 'react';
import { Project } from '../../types';
import { ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  className = ''
}) => {
  // Determine active stage name
  const activeStage = 
    project.stages?.find(s => s.status === 'In Progress')?.name || 
    (project.id === 'proj-1' ? 'Construction' : project.id === 'proj-2' ? 'Foundation' : project.type || 'Construction');

  // Format budget total
  const formatBudget = (amount?: number) => {
    if (!amount) return '$4.65M';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}k`;
  };

  // Status badge logic
  const getStatusBadge = () => {
    const s = project.status?.toLowerCase() || '';
    if (s.includes('complete')) {
      return {
        label: '● Completed',
        classes: 'bg-[#E9F9F3] text-[#10A976]'
      };
    }
    if (s.includes('attention') || s.includes('risk') || s.includes('hold') || s.includes('delay')) {
      return {
        label: '● Needs Attention',
        classes: 'bg-[#FFF7E6] text-[#F59E0B]'
      };
    }
    return {
      label: '● On Schedule',
      classes: 'bg-[#E9F9F3] text-[#10A976]'
    };
  };

  const statusBadge = getStatusBadge();
  const fallbackThumbnail = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80";

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center gap-3 group active:scale-[0.99] font-sans ${className}`}
    >
      {/* Thumbnail */}
      <img 
        src={project.thumbnail || project.coverImage || fallbackThumbnail}
        alt={project.name}
        className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E2E8F0]"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackThumbnail;
        }}
      />

      {/* Main Info */}
      <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
        {/* Row 1: Name and Budget */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate leading-tight">
            {project.name}
          </h3>
          <span className="text-xs sm:text-sm font-bold text-[#0F172A] shrink-0 leading-tight">
            {formatBudget(project.budget?.total)}
          </span>
        </div>

        {/* Row 2: Location · Stage · Progress % and Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-[#64748B] truncate font-normal leading-tight">
            {project.cityState || 'Tampa, FL'} · {activeStage} · <span className="text-[#1677FF] font-semibold">{project.progress}%</span>
          </p>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap shrink-0 ${statusBadge.classes}`}>
            {statusBadge.label}
          </span>
        </div>
      </div>
    </div>
  );
};
