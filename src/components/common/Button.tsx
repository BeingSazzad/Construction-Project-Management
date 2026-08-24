import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  disabled,
  children,
  ...props
}) => {
  // Height strictly 48px, font size 16px bold for default
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl cursor-pointer';

  const sizeStyles = {
    default: 'h-12 px-5 text-[16px] leading-tight', // 48px height, 16px bold
    sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg',
    lg: 'h-14 px-7 text-lg font-bold rounded-2xl',
    icon: 'h-11 w-11 p-0 rounded-xl'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-white hover:brightness-110 shadow-[0_4px_16px_-2px_rgba(0,102,255,0.45)] hover:shadow-[0_6px_20px_-2px_rgba(0,210,255,0.55)]',
    gradient: 'bg-gradient-to-r from-[#0052CC] via-[#0088FF] to-[#00E5FF] text-white hover:brightness-110 shadow-[0_4px_18px_rgba(0,136,255,0.4)]',
    secondary: 'bg-[#172238] text-slate-100 hover:bg-[#1E2E4B] border border-[#23334F] hover:border-[#384F75]',
    outline: 'bg-transparent text-cyan-400 border-[1.5px] border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]',
    ghost: 'bg-transparent text-slate-300 hover:bg-navy-800/80 hover:text-white',
    danger: 'bg-red-600/90 text-white hover:bg-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.4)]'
  };

  const widthStyle = fullWidth && size !== 'icon' ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="inline-flex mr-2 flex-shrink-0">{leftIcon}</span>
      ) : null}
      
      {children}

      {!isLoading && rightIcon && (
        <span className="inline-flex ml-2 flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
