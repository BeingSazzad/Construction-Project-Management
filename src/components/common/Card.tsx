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
    surface: 'bg-white border border-[#DDE1E7] shadow-xs',
    elevated: 'bg-white border border-[#DDE1E7] shadow-sm',
    inset: 'bg-[#F7F8FA] border border-[#EAEDF1]',
  }[variant];

  return (
    <div
      className={`rounded-2xl flex flex-col transition-all ${variantStyles} ${className}`}
      {...props}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-[#1677FF] flex-shrink-0">{icon}</span>}
            <div>
              {title && <h3 className="text-xs font-bold text-[#171A1F] tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[11px] text-[#68707C] font-medium">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>

      {footer && (
        <div className="p-3.5 bg-[#F7F8FA] border-t border-[#EAEDF1] rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

