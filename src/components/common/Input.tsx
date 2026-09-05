import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  required,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs md:text-sm font-medium text-[#0F172A] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-[#E5484D] ml-0.5">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-4 flex items-center pointer-events-none text-[#64748B]">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full h-12 bg-white border ${
            error ? 'border-[#E5484D] focus:border-[#E5484D]' : 'border-[#E2E8F0] focus:border-[#1677FF]'
          } rounded-xl ${leftIcon ? 'pl-11' : 'px-4'} ${rightIcon ? 'pr-11' : 'pr-4'} text-[16px] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all focus:ring-1 focus:ring-[#1677FF] disabled:opacity-50 disabled:bg-[#F1F5F9] disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-4 flex items-center text-[#64748B]">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className="text-xs font-medium text-[#E5484D] mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#64748B] mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
