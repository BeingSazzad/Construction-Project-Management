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
  // Height strictly 48px, font size 15px semibold, radius 12px (rounded-xl)
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl cursor-pointer';

  const sizeStyles = {
    default: 'h-12 px-5 text-base leading-tight', // 48px height, 15px semibold
    sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg',
    lg: 'h-12 px-6 text-base font-semibold rounded-xl',
    icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-xl' // 44x44px minimum touch area
  };

  const variantStyles = {
    primary: 'bg-[#1677FF] hover:bg-[#0F5FD7] text-white shadow-xs',
    gradient: 'bg-[#1677FF] hover:bg-[#0F5FD7] text-white shadow-xs',
    secondary: 'bg-white text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]',
    outline: 'bg-white text-[#1677FF] border border-[#1677FF] hover:bg-[#EAF3FF]',
    ghost: 'bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]',
    danger: 'bg-[#E5484D] text-white hover:bg-[#D03A3F] shadow-xs'
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
