import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Level 2 Section Header per Rule 12 of the Master Design System:
 * Provides semantic hierarchy without wrapping every section in a card.
 * 16–20px Semibold title, optional subtitle, trailing action/badge.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 mb-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-semibold text-[#0F172A] tracking-tight">
            {title}
          </h2>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-xs text-[#475569] mt-0.5 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center">
          {action}
        </div>
      )}
    </div>
  );
};
