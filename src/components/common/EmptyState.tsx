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
      className={`p-8 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col items-center justify-center text-center gap-3 animate-fade-in ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
        {icon}
      </div>

      <div className="max-w-xs">
        <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{description}</p>
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
