import React from 'react';
import { Home, FolderKanban, Plus, Sparkles, CalendarDays } from 'lucide-react';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDE1E7] font-sans">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* 1. HOME */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer group ${
            activeTab === 'home' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'home' ? 'text-[#1677FF] stroke-[2.4]' : 'text-[#68707C] stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'home' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Home
          </span>
        </button>

        {/* 2. PROJECTS */}
        <button
          onClick={() => onTabChange('projects')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer group ${
            activeTab === 'projects' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <FolderKanban className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'projects' ? 'text-[#1677FF] stroke-[2.4]' : 'text-[#68707C] stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'projects' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Projects
          </span>
        </button>

        {/* 3. CENTRAL ADD (+) ACTION */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onQuickAction}
            className="w-11 h-11 rounded-full bg-[#1677FF] hover:bg-[#0958D9] text-white flex items-center justify-center shadow-md shadow-blue-500/30 transition-all cursor-pointer active:scale-95 group -mt-2"
            title="Create New (Task, Update, Expense, Photo, Doc)"
          >
            <Plus className="w-6 h-6 text-white stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* 4. SCHEDULE & CALENDAR */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer group ${
            activeTab === 'calendar' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <CalendarDays className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'calendar' ? 'text-[#1677FF] stroke-[2.4]' : 'text-[#68707C] stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'calendar' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Schedule
          </span>
        </button>

        {/* 5. LATTI AI */}
        <button
          onClick={() => onTabChange('latti')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer group ${
            activeTab === 'latti' ? 'text-[#1677FF]' : 'text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <Sparkles className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'latti' ? 'text-[#1677FF] stroke-[2.4]' : 'text-[#68707C] stroke-[1.8]'
          }`} />
          <span className={`text-[10px] tracking-tight mt-1 leading-none ${
            activeTab === 'latti' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#68707C]'
          }`}>
            Latti
          </span>
        </button>

      </div>
    </nav>
  );
};
