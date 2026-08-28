import React from 'react';

interface FilterPillsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  className?: string;
}

export const FilterPills: React.FC<FilterPillsProps> = ({ 
  options, 
  selected, 
  onSelect,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 w-full ${className}`}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border select-none active:scale-95 ${
              isActive
                ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-sm'
                : 'bg-[#070D1A] text-slate-400 hover:text-white border-[#142036]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
