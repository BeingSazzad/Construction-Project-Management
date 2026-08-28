import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabSelectorProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ 
  options, 
  activeId, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 p-1 bg-[#070D1A] rounded-xl border border-[#142036] ${className}`}>
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none active:scale-[0.98] ${
              isActive
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-400 hover:text-white font-semibold'
            }`}
          >
            {option.label}
            {option.count !== undefined && option.count > 0 ? ` (${option.count})` : ''}
          </button>
        );
      })}
    </div>
  );
};
