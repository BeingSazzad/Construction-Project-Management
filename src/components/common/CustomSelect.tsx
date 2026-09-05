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
    sm: 'h-8 px-3 text-[11px] rounded-lg',
    md: 'h-10 px-3.5 text-xs rounded-xl',
    lg: 'h-12 px-4 text-sm rounded-2xl'
  }[size];

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-bold text-[#171A1F] uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${sizeClasses} bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 focus:border-[#1677FF] text-[#171A1F] flex items-center justify-between gap-2 transition-all cursor-pointer outline-none active:scale-[0.99] disabled:opacity-50 disabled:bg-[#F2F2F7] disabled:cursor-not-allowed ${
          isOpen ? 'border-[#1677FF] ring-2 ring-[#1677FF]/15' : ''
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-[#68707C] flex-shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate font-semibold ${selectedOption ? 'text-[#171A1F]' : 'text-[#8F95B2]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.count !== undefined && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAF3FF] text-[#1677FF] font-bold flex-shrink-0">
              {selectedOption.count}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#68707C] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#1677FF]' : ''
          }`}
        />
      </button>

      {/* Floating Custom DOM Menu (Figma-Capturable) */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 min-w-[180px] max-h-60 overflow-y-auto rounded-2xl bg-white border border-[#DDE1E7] p-1.5 shadow-xl z-50 flex flex-col gap-0.5 animate-fade-in scrollbar-thin ${menuClassName}`}
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
                    ? 'bg-[#EAF3FF] text-[#1677FF] font-bold'
                    : 'text-[#171A1F] hover:bg-[#F2F2F7]'
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
                        opt.count > 0 ? 'bg-[#EAF3FF] text-[#1677FF]' : 'text-[#8F95B2]'
                      }`}
                    >
                      {opt.count}
                    </span>
                  )}
                  {opt.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2F2F7] text-[#68707C] font-medium border border-[#DDE1E7]">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1677FF] stroke-[2.5]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
