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
        label: '• Completed',
        classes: 'bg-[#E9F9F3] text-[#10A976]'
      };
    }
    if (s.includes('attention') || s.includes('risk') || s.includes('hold') || project.id === 'proj-2') {
      return {
        label: '• Needs Attention',
        classes: 'bg-[#FFF7E6] text-[#F59E0B]'
      };
    }
    return {
      label: '• On Schedule',
      classes: 'bg-[#E9F9F3] text-[#10A976]'
    };
  };

  const statusBadge = getStatusBadge();
  const fallbackThumbnail = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80";

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99] font-sans ${className}`}
    >
      {/* Left: Thumbnail & Project Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img 
          src={project.thumbnail || project.coverImage || fallbackThumbnail}
          alt={project.name}
          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E2E8F0]"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-xs md:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate leading-tight">
            {project.name}
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 truncate font-normal">
            {project.cityState || 'Tampa, FL'} • {activeStage}
          </p>

          {/* Progress bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#1677FF] shrink-0">
              {project.progress}% complete
            </span>
            <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div 
                className="h-full bg-[#1677FF] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(project.progress, 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Status, Budget & Chevron */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex flex-col items-end shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge.classes}`}>
            {statusBadge.label}
          </span>
          <span className="text-xs font-bold text-[#0F172A] mt-1.5 block">
            {formatBudget(project.budget?.total)}
          </span>
          <span className="text-[10px] text-[#64748B] font-medium block">
            Budget
          </span>
        </div>

        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </div>
  );
};
