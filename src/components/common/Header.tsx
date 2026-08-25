import React from 'react';
import { User, Project } from '../../types';
import { LatticeLogo } from './LatticeLogo';
import { Search, Bell, ChevronLeft } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  currentUser: User;
  activeProject?: Project | null;
  unreadNotifsCount: number;
  onBackToHome?: () => void;
  onOpenNotifications: () => void;
  onOpenLatti: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeProject,
  unreadNotifsCount,
  onBackToHome,
  onOpenNotifications,
  onOpenSettings
}) => {
  // Get initials from user name
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AM';

  return (
    <header className="w-full flex-shrink-0 z-40 bg-[#070A12] border-b border-[#121A2A]/80 sticky top-0">
      <div className="px-5 py-3.5 flex items-center justify-between gap-3 max-w-[420px] mx-auto">
        {activeProject ? (
          // Inside Project Workspace Header
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={onBackToHome}
              className="w-8 h-8 rounded-xl bg-[#0E1524] border border-[#1A263B] flex items-center justify-center text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              title="Back to Home"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-white truncate tracking-tight">
                {activeProject.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="truncate">{activeProject.cityState}</span>
                <span>•</span>
                <StatusBadge status={activeProject.status} size="xs" />
              </div>
            </div>
          </div>
        ) : (
          // Top Level Header (Matching Exact Screenshot)
          <>
            {/* Left Greeting & User Name */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                Good morning <span className="text-xs">👋</span>
              </span>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                {currentUser?.name || 'Alex Morgan'}
              </h1>
            </div>

            {/* Right Notification Bell and Avatar Initials */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-full bg-[#0E1524] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#070A12]"></span>
              </button>

              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
                title="Profile & Settings"
              >
                {initials}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

