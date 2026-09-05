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
    xs: 'px-2.5 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none',
    sm: 'px-3 py-1 text-[11px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none',
    md: 'px-3.5 py-1 text-xs font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-2 leading-none'
  };

  const getStyle = () => {
    switch (status) {
      // Success / On Schedule / Completed / Warranty
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';

      case 'Warranty':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      
      // Warning / At Risk / On Hold
      case 'At Risk':
      case 'High':
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200';

      case 'On Hold':
        return 'bg-amber-50/80 text-amber-700 border border-amber-200';

      // Danger / Critical / Overdue
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border border-rose-200';

      // Active / In Progress
      case 'In Progress':
        return 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/25';

      // Pre-Construction
      case 'Pre-Construction':
        return 'bg-cyan-50 text-cyan-700 border border-cyan-200';

      // Planning / Open
      case 'Planning':
      case 'Not Started':
      case 'Open':
        return 'bg-[#F2F2F7] text-[#68707C] border border-[#DDE1E7]';

      // Resolved / Purple
      case 'Resolved':
        return 'bg-purple-50 text-purple-700 border border-purple-200';

      // Neutral / Low
      case 'Low':
        return 'bg-[#F2F2F7] text-[#68707C] border border-[#DDE1E7]';

      default:
        return 'bg-[#F2F2F7] text-[#171A1F] border border-[#DDE1E7]';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-500';
      case 'Warranty':
        return 'bg-teal-500';
      case 'At Risk':
      case 'High':
      case 'Medium':
      case 'On Hold':
        return 'bg-amber-500';
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-500';
      case 'In Progress':
        return 'bg-[#1677FF]';
      case 'Pre-Construction':
        return 'bg-cyan-500';
      case 'Planning':
        return 'bg-slate-400';
      case 'Resolved':
        return 'bg-purple-500';
      default:
        return 'bg-[#1677FF]';
    }
  };

  return (
    <span className={`${sizeClasses[size]} ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} shrink-0`} />
      <span className="tracking-tight">{status}</span>
    </span>
  );
};
