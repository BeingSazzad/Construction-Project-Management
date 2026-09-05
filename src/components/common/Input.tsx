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
        <label htmlFor={inputId} className="text-xs font-semibold text-[#171A1F] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3.5 flex items-center pointer-events-none text-[#68707C]">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full h-11 bg-white border ${
            error ? 'border-rose-500 focus:border-rose-500' : 'border-[#DDE1E7] focus:border-[#1677FF]'
          } rounded-xl ${leftIcon ? 'pl-10' : 'pl-3.5'} ${rightIcon ? 'pr-10' : 'pr-3.5'} text-xs font-medium text-[#171A1F] placeholder-[#8F95B2] outline-none transition-all focus:ring-2 focus:ring-[#1677FF]/15 disabled:opacity-50 disabled:bg-[#F2F2F7] disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3.5 flex items-center text-[#68707C]">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className="text-[11px] font-semibold text-rose-500 mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] font-medium text-[#68707C] mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
