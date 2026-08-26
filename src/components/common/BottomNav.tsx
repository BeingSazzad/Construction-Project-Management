import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, FolderKanban, DollarSign, Settings, Plus, Sparkles
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onQuickAction
}) => {
  // Owner Role: Home, Projects, Budgets, More
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'budgets', label: 'Budgets', icon: DollarSign },
    { id: 'more', label: 'More', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060913]/95 backdrop-blur-md border-t border-[#142036]">
      <div className="max-w-[430px] mx-auto px-5 py-2 flex items-center justify-between relative">
        
        {/* Left 2 Items: Home & Projects */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#3875F6] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button (+) */}
        <div className="flex items-center justify-center px-2">
          <button
            onClick={onQuickAction}
            className="w-12 h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            title="Create New (Project, Budget, Deal, Task)"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right 2 Items: Budgets & More */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#3875F6] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};
