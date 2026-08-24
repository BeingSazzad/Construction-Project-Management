import React from 'react';
import { ProjectStatus, TaskStatus, Priority, PunchStatus } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus | Priority | PunchStatus | string;
  type?: 'project' | 'task' | 'priority' | 'punch' | 'custom';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'custom',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] font-bold rounded-md tracking-wider',
    sm: 'px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide',
    md: 'px-3 py-1.5 text-xs font-bold rounded-full'
  };

  const getStyle = () => {
    switch (status) {
      // Project statuses
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      
      case 'At Risk':
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';

      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse';

      case 'In Progress':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';

      case 'Planning':
      case 'Not Started':
      case 'Open':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';

      case 'Resolved':
        return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';

      case 'Medium':
        return 'bg-amber-400/10 text-amber-300 border border-amber-400/20';

      case 'Low':
        return 'bg-slate-500/15 text-slate-300 border border-slate-500/30';

      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const renderDot = () => {
    switch (status) {
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 flex-shrink-0"></span>;
      case 'At Risk':
      case 'High':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 flex-shrink-0"></span>;
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 flex-shrink-0 animate-ping"></span>;
      case 'In Progress':
        return <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 flex-shrink-0"></span>;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center justify-center select-none ${sizeClasses[size]} ${getStyle()} ${className}`}>
      {renderDot()}
      <span>{status}</span>
    </span>
  );
};
