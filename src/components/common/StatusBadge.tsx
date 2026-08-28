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
    xs: 'px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none backdrop-blur-md shadow-sm',
    sm: 'px-3 py-1 text-[12px] font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none backdrop-blur-md shadow-sm',
    md: 'px-3.5 py-1.5 text-xs font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-2 leading-none backdrop-blur-md shadow-sm'
  };

  const getStyle = () => {
    switch (status) {
      // Success / On Schedule / Completed / Warranty
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-[#061F14]/95 text-emerald-300 border border-emerald-500/50 shadow-emerald-950/40';

      case 'Warranty':
        return 'bg-[#062121]/95 text-teal-300 border border-teal-500/50 shadow-teal-950/40';
      
      // Warning / At Risk / On Hold
      case 'At Risk':
      case 'High':
      case 'Medium':
        return 'bg-[#291704]/95 text-amber-300 border border-amber-500/50 shadow-amber-950/40';

      case 'On Hold':
        return 'bg-[#241A0A]/95 text-amber-200 border border-amber-600/40 shadow-amber-950/30';

      // Danger / Critical / Overdue
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-[#2B080E]/95 text-rose-300 border border-rose-500/50 shadow-rose-950/40 animate-pulse';

      // Active / In Progress
      case 'In Progress':
        return 'bg-[#0A1B38]/95 text-blue-300 border border-blue-500/50 shadow-blue-950/40';

      // Pre-Construction
      case 'Pre-Construction':
        return 'bg-[#0A1E2B]/95 text-cyan-300 border border-cyan-500/40 shadow-cyan-950/40';

      // Planning / Open
      case 'Planning':
      case 'Not Started':
      case 'Open':
        return 'bg-[#0A1A33]/95 text-blue-300 border border-blue-400/40 shadow-blue-950/40';

      // Resolved / Purple
      case 'Resolved':
        return 'bg-[#1D0C30]/95 text-purple-200 border border-purple-400/50 shadow-purple-950/40';

      // Neutral / Low
      case 'Low':
        return 'bg-[#0F172A]/95 text-slate-300 border border-slate-600/60 shadow-slate-950/40';

      default:
        return 'bg-[#0E1726]/95 text-slate-200 border border-[#1E2E48] shadow-sm';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]';
      case 'Warranty':
        return 'bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.9)]';
      case 'At Risk':
      case 'High':
      case 'Medium':
      case 'On Hold':
        return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]';
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]';
      case 'In Progress':
        return 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]';
      case 'Pre-Construction':
        return 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]';
      case 'Planning':
        return 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]';
      case 'Resolved':
        return 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]';
      default:
        return 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]';
    }
  };

  return (
    <span className={`${sizeClasses[size]} ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} shrink-0`} />
      <span className="tracking-tight">{status}</span>
    </span>
  );
};
