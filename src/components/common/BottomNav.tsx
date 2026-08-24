import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, FolderKanban, CheckSquare, MoreHorizontal, 
  Layers, Plus, FileEdit, MoreVertical, Compass 
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="w-full flex-shrink-0 bg-[#070A12] border-t border-[#121A2A] py-2.5 px-4 z-40 sticky bottom-0">
      <div className="flex items-center justify-around max-w-[390px] mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#0066FF] font-bold' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
