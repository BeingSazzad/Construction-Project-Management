import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, LayoutGrid, CheckSquare, Menu, Plus, 
  FolderKanban, Layers 
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickAction
}) => {
  return (
    <nav className="w-full flex-shrink-0 bg-[#070A12] border-t border-[#121A2A] py-2 px-3 z-40 sticky bottom-0">
      <div className="flex items-center justify-between max-w-[400px] mx-auto relative">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' 
              ? 'text-[#0066FF] font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 font-semibold tracking-tight">Home</span>
        </button>

        {/* 2. Projects */}
        <button
          onClick={() => onTabChange('projects')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'projects' 
              ? 'text-[#0066FF] font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 transition-transform ${activeTab === 'projects' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 font-semibold tracking-tight">Projects</span>
        </button>

        {/* 3. Center Floating Plus Button */}
        <button
          onClick={onQuickAction}
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,102,255,0.5)] border-2 border-[#070A12] transition-transform hover:scale-110 cursor-pointer flex-shrink-0"
          title="Quick Add"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Tasks */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'tasks' 
              ? 'text-[#0066FF] font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className={`w-5 h-5 transition-transform ${activeTab === 'tasks' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 font-semibold tracking-tight">Tasks</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => onTabChange('more')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'more' 
              ? 'text-[#0066FF] font-bold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className={`w-5 h-5 transition-transform ${activeTab === 'more' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 font-semibold tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};

