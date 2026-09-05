import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-8 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col items-center justify-center text-center gap-3 animate-fade-in ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center">
        {icon}
      </div>

      <div className="max-w-xs">
        <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">{title}</h3>
        <p className="text-xs text-[#68707C] font-medium mt-1 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="mt-1"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

