import React from 'react';
import { Folder, Plus, User, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction?: () => void;
  onOpenDrawer?: () => void;
}

// 1. Home Icon (Filled house when active, outline when inactive)
const HomeNavIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-105' : ''}`}
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={active ? '0' : '1.9'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 20v-9.5z" />
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickAction,
}) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white/95 backdrop-blur-md border-t border-x border-[#E2E8F0] font-sans shadow-[0_-4px_24px_rgba(15,23,42,0.06)]">
      <div className="w-full px-2 h-16 flex items-center justify-around relative">

        {/* 1. HOME */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 h-full flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-95 group ${activeTab === 'home' ? 'text-[#1677FF]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          {/* Active Top Line Indicator */}
          {activeTab === 'home' && (
            <span className="absolute top-0 w-11 h-[3px] bg-[#1677FF] rounded-full animate-fade-in" />
          )}

          <HomeNavIcon active={activeTab === 'home'} />
          <span className={`text-[11px] tracking-tight mt-1 leading-none ${activeTab === 'home' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#64748B]'
            }`}>
            Home
          </span>
        </button>

        {/* 2. PROJECTS */}
        <button
          onClick={() => onTabChange('projects')}
          className={`flex-1 h-full flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-95 group ${activeTab === 'projects' ? 'text-[#1677FF]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          {/* Active Top Line Indicator */}
          {activeTab === 'projects' && (
            <span className="absolute top-0 w-11 h-[3px] bg-[#1677FF] rounded-full animate-fade-in" />
          )}

          <Folder className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'projects' ? 'scale-105 text-[#1677FF] stroke-[2.2]' : 'stroke-[1.8]'
            }`} />
          <span className={`text-[11px] tracking-tight mt-1 leading-none ${activeTab === 'projects' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#64748B]'
            }`}>
            Projects
          </span>
        </button>

        {/* 3. CENTRAL SQUIRCLE (+) ACTION BUTTON */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onQuickAction}
            className="w-12 h-12 rounded-[16px] bg-[#1677FF] hover:bg-[#0958D9] text-white flex items-center justify-center shadow-md shadow-[#1677FF]/35 transition-all cursor-pointer active:scale-95 group -mt-2"
            title="Create New (Task, Daily Log, Photo, Expense)"
          >
            <Plus className="w-5 h-5 text-white stroke-[2.2] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* 4. LATTI AI */}
        <button
          onClick={() => onTabChange('latti')}
          className={`flex-1 h-full flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-95 group ${activeTab === 'latti' ? 'text-[#1677FF]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          {/* Active Top Line Indicator */}
          {activeTab === 'latti' && (
            <span className="absolute top-0 w-11 h-[3px] bg-[#1677FF] rounded-full animate-fade-in" />
          )}

          <Sparkles className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'latti' ? 'scale-105 text-[#1677FF] stroke-[2.2]' : 'stroke-[1.8]'
            }`} />
          <span className={`text-[11px] tracking-tight mt-1 leading-none ${activeTab === 'latti' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#64748B]'
            }`}>
            Latti AI
          </span>
        </button>

        {/* 5. ACCOUNT */}
        <button
          onClick={() => onTabChange('account')}
          className={`flex-1 h-full flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-95 group ${activeTab === 'account' || activeTab === 'more' ? 'text-[#1677FF]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          {/* Active Top Line Indicator */}
          {(activeTab === 'account' || activeTab === 'more') && (
            <span className="absolute top-0 w-11 h-[3px] bg-[#1677FF] rounded-full animate-fade-in" />
          )}

          <User className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'account' || activeTab === 'more' ? 'scale-105 text-[#1677FF] stroke-[2.2]' : 'stroke-[1.8]'
            }`} />
          <span className={`text-[11px] tracking-tight mt-1 leading-none ${activeTab === 'account' || activeTab === 'more' ? 'font-bold text-[#1677FF]' : 'font-medium text-[#64748B]'
            }`}>
            Account
          </span>
        </button>

      </div>
    </nav>
  );
};
