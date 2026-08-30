import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'inset';
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
    surface: 'bg-[#0A111F] border border-[#142036] shadow-sm',
    elevated: 'bg-[#0E1A30] border border-[#1E2E4A] shadow-md',
    inset: 'bg-[#050811] border border-[#142036]',
  }[variant];

  return (
    <div
      className={`rounded-2xl flex flex-col transition-all ${variantStyles} ${className}`}
      {...props}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#142036]">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-blue-400 flex-shrink-0">{icon}</span>}
            <div>
              {title && <h3 className="text-xs font-bold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>

      {footer && (
        <div className="p-3.5 bg-black/20 border-t border-[#142036] rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};
