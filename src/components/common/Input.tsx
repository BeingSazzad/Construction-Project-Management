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
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-400 ml-0.5">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full h-11 bg-[#050811] border ${
            error ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#142036] focus:border-[#2563EB]'
          } rounded-xl ${leftIcon ? 'pl-10' : 'pl-3.5'} ${rightIcon ? 'pr-10' : 'pr-3.5'} text-xs font-medium text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3.5 flex items-center text-slate-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className="text-[11px] font-semibold text-rose-400 mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] font-medium text-slate-500 mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
