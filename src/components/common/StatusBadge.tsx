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
    xs: 'px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none',
    sm: 'px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none',
    md: 'px-3.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 inline-flex items-center gap-2 leading-none'
  };

  const getStyle = () => {
    switch (status) {
      // Success / On Schedule / Completed / Verified
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
        return 'bg-[#E9F9F3] text-[#10A976] border border-[#10A976]/25';

      case 'Warranty':
        return 'bg-[#E9F9F3] text-[#10A976] border border-[#10A976]/25';
      
      // Warning / At Risk / High / Medium / On Hold
      case 'At Risk':
      case 'High':
      case 'Medium':
      case 'On Hold':
        return 'bg-[#FFF7E6] text-[#F59E0B] border border-[#F59E0B]/25';

      // Danger / Critical / Delayed / Blocked / Overdue
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-[#FFF0F0] text-[#E5484D] border border-[#E5484D]/25';

      // Active / In Progress
      case 'In Progress':
        return 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/25';

      // Pre-Construction / Planning / Open
      case 'Pre-Construction':
      case 'Planning':
      case 'Not Started':
      case 'Open':
      case 'Low':
        return 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]';

      default:
        return 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'On Schedule':
      case 'Completed':
      case 'Verified':
      case 'Warranty':
        return 'bg-[#10A976]';
      case 'At Risk':
      case 'High':
      case 'Medium':
      case 'On Hold':
        return 'bg-[#F59E0B]';
      case 'Critical':
      case 'Delayed':
      case 'Blocked':
      case 'Overdue':
        return 'bg-[#E5484D]';
      case 'In Progress':
        return 'bg-[#1677FF]';
      default:
        return 'bg-[#94A3B8]';
    }
  };

  return (
    <span className={`${sizeClasses[size]} ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} shrink-0`} />
      <span className="tracking-tight">{status}</span>
    </span>
  );
};
