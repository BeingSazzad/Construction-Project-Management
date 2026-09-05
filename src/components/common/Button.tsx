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
    primary: 'bg-[#1677FF] hover:bg-[#0958D9] text-white shadow-xs',
    gradient: 'bg-[#1677FF] hover:bg-[#0958D9] text-white shadow-xs',
    secondary: 'bg-[#F2F2F7] text-[#171A1F] hover:bg-[#EAEDF1] border border-[#DDE1E7]',
    outline: 'bg-white text-[#1677FF] border border-[#1677FF] hover:bg-[#EAF3FF]',
    ghost: 'bg-transparent text-[#68707C] hover:bg-[#F2F2F7] hover:text-[#171A1F]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
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
