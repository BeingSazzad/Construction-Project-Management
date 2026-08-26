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
  size = 'xs',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1 leading-none',
    sm: 'px-2.5 py-1 text-[11px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1 leading-none',
    md: 'px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1 leading-none'
  };

  const getStyle = () => {
    switch (status) {
      // Project statuses
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      
      case 'At Risk':
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse';

      case 'In Progress':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';

      case 'Planning':
      case 'Not Started':
      case 'Open':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

      case 'Resolved':
        return 'bg-purple-500/10 text-purple-300 border border-purple-500/20';

      case 'Medium':
        return 'bg-amber-400/10 text-amber-300 border border-amber-400/20';

      case 'Low':
        return 'bg-slate-500/10 text-slate-300 border border-slate-500/20';

      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-400';
      case 'At Risk':
      case 'High':
      case 'Medium':
        return 'bg-amber-400';
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-400';
      case 'In Progress':
        return 'bg-cyan-400';
      default:
        return 'bg-blue-400';
    }
  };

  return (
    <span className={`${sizeClasses[size]} ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} shrink-0`} />
      <span>{status}</span>
    </span>
  );
};
