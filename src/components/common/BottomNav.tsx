import React from 'react';
import { Home, FolderKanban, Plus, Sparkles, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction?: () => void;
  onOpenDrawer?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickAction,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEDF1] font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-5xl mx-auto px-3 h-16 flex items-center justify-around relative">
        
        {/* 1. HOME */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all duration-200 cursor-pointer active:scale-95 group ${
            activeTab === 'home' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform duration-200 ${
            activeTab === 'home' ? 'scale-110 text-[#1677FF] stroke-[2.4]' : 'stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'home' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Home
          </span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 bg-[#1677FF] rounded-full mt-1" />
          )}
        </button>

        {/* 2. PROJECTS */}
        <button
          onClick={() => onTabChange('projects')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all duration-200 cursor-pointer active:scale-95 group ${
            activeTab === 'projects' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <FolderKanban className={`w-5 h-5 transition-transform duration-200 ${
            activeTab === 'projects' ? 'scale-110 text-[#1677FF] stroke-[2.4]' : 'stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'projects' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Projects
          </span>
          {activeTab === 'projects' && (
            <span className="w-1 h-1 bg-[#1677FF] rounded-full mt-1" />
          )}
        </button>

        {/* 3. CENTRAL ADD (+) ACTION */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onQuickAction}
            className="w-11 h-11 rounded-full bg-[#1677FF] hover:bg-[#0958D9] text-white flex items-center justify-center shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95 group -mt-1.5"
            title="Create New (Task, Update, Expense, Photo, Doc)"
          >
            <Plus className="w-5 h-5 text-white stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* 4. LATTI AI */}
        <button
          onClick={() => onTabChange('latti')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all duration-200 cursor-pointer active:scale-95 group ${
            activeTab === 'latti' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <Sparkles className={`w-5 h-5 transition-transform duration-200 ${
            activeTab === 'latti' ? 'scale-110 text-[#1677FF] stroke-[2.4]' : 'stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'latti' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Latti
          </span>
          {activeTab === 'latti' && (
            <span className="w-1 h-1 bg-[#1677FF] rounded-full mt-1" />
          )}
        </button>

        {/* 5. MORE */}
        <button
          onClick={() => onTabChange('more')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all duration-200 cursor-pointer active:scale-95 group ${
            activeTab === 'more' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <MoreHorizontal className={`w-5 h-5 transition-transform duration-200 ${
            activeTab === 'more' ? 'scale-110 text-[#1677FF] stroke-[2.4]' : 'stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'more' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            More
          </span>
          {activeTab === 'more' && (
            <span className="w-1 h-1 bg-[#1677FF] rounded-full mt-1" />
          )}
        </button>

      </div>
    </nav>
  );
};
