import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOptionObject {
  value: string;
  label: string;
  count?: number;
  badge?: string;
  icon?: React.ReactNode;
}

export type SelectOption = string | SelectOptionObject;

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  label,
  required,
  disabled = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  icon,
  size = 'md',
  fullWidth = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: SelectOptionObject[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-[10px] rounded-xl',
    md: 'h-10 px-3.5 text-xs rounded-xl',
    lg: 'h-12 px-4 text-xs rounded-2xl'
  }[size];

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${sizeClasses} bg-[#0A111F] border border-[#142036] hover:border-slate-600 focus:border-[#2563EB] text-slate-200 flex items-center justify-between gap-2 transition-all cursor-pointer outline-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'border-[#2563EB] ring-1 ring-[#2563EB]/40' : ''
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-slate-400 flex-shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate font-semibold ${selectedOption ? 'text-white' : 'text-slate-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.count !== undefined && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 font-bold flex-shrink-0">
              {selectedOption.count}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {/* Floating Custom DOM Menu (Figma-Capturable) */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 min-w-[180px] max-h-60 overflow-y-auto rounded-2xl bg-[#0A111F] border border-[#1E2D4A] p-1.5 shadow-2xl shadow-black/90 backdrop-blur-xl z-50 flex flex-col gap-0.5 animate-fade-in scrollbar-thin scrollbar-thumb-[#142036] ${menuClassName}`}
        >
          {normalizedOptions.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#2563EB]/20 text-blue-400 font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {opt.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        opt.count > 0 ? 'bg-blue-500/10 text-blue-400' : 'text-slate-600'
                      }`}
                    >
                      {opt.count}
                    </span>
                  )}
                  {opt.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
