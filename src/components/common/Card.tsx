import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'summary' | 'compact' | 'elevated' | 'inset';
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  title,
  subtitle,
  action,
  icon,
  footer,
  noPadding = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-white border border-[#E2E8F0] rounded-2xl shadow-xs',
    summary: 'bg-white border border-[#E2E8F0] rounded-[20px] shadow-xs',
    compact: 'bg-white border border-[#E2E8F0] rounded-xl',
    elevated: 'bg-white border border-[#CBD5E1] rounded-2xl shadow-sm',
    inset: 'bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl',
  }[variant];

  const defaultPadding = variant === 'summary' ? 'p-5' : variant === 'compact' ? 'p-3.5' : 'p-4';

  return (
    <div
      className={`flex flex-col transition-all ${variantStyles} ${className}`}
      {...props}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-[#1677FF] flex-shrink-0">{icon}</span>}
            <div>
              {title && <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-[#475569] font-normal">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div className={noPadding ? '' : defaultPadding}>
        {children}
      </div>

      {footer && (
        <div className="p-3.5 bg-[#F1F5F9] border-t border-[#E2E8F0] rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

