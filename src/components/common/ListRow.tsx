import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface ListRowProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  metadata?: React.ReactNode;
  status?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
  isLast?: boolean;
}

/**
 * Standard Lattice List Row per Rule 20 of the Master Design System:
 * 56–72px height, clear hierarchy:
 * [Leading Identifier] ➔ [Primary Info] ➔ [Secondary Metadata] ➔ [Status] ➔ [Trailing Action]
 * Hairline bottom divider, zero unnecessary card nesting.
 */
export const ListRow: React.FC<ListRowProps> = ({
  leading,
  title,
  subtitle,
  metadata,
  status,
  trailing,
  showChevron = false,
  onClick,
  className = '',
  isLast = false,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`min-h-[56px] py-3.5 px-1 flex items-center justify-between gap-3 transition-colors ${
        isClickable ? 'cursor-pointer hover:bg-[#F1F5F9]/60 active:scale-[0.99]' : ''
      } ${!isLast ? 'border-b border-[#E2E8F0]' : ''} ${className}`}
    >
      {/* Leading & Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {leading && (
          <div className="shrink-0 flex items-center justify-center">
            {leading}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#0F172A] truncate leading-tight">
            {title}
          </p>
          {(subtitle || metadata) && (
            <div className="flex items-center gap-2 mt-0.5">
              {subtitle && (
                <span className="text-xs text-[#475569] truncate">
                  {subtitle}
                </span>
              )}
              {metadata && (
                <span className="shrink-0 text-xs text-[#64748B]">
                  {metadata}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trailing & Status */}
      <div className="flex items-center gap-2.5 shrink-0">
        {status && <div className="shrink-0">{status}</div>}
        {trailing && <div className="shrink-0">{trailing}</div>}
        {showChevron && (
          <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
        )}
      </div>
    </div>
  );
};
