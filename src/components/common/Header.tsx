import React from 'react';
import { User, Project } from '../../types';
import { Bell, ChevronLeft } from 'lucide-react';
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
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AM';

  return (
    <header className="w-full flex-shrink-0 z-40 bg-[#070B14] border-b border-[#141C2E] sticky top-0">
      <div className="px-5 py-3.5 flex items-center justify-between gap-3 max-w-[430px] mx-auto">
        {activeProject ? (
          // Inside Project Workspace Header
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={onBackToHome}
              className="w-9 h-9 rounded-xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-center text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              title="Back to Home"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-white truncate tracking-tight">
                {activeProject.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="truncate">{activeProject.cityState}</span>
                <span>•</span>
                <StatusBadge status={activeProject.status} size="xs" />
              </div>
            </div>
          </div>
        ) : (
          // Top Level Dashboard Header
          <>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <span>Good morning</span>
                <span className="text-xs">👋</span>
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {currentUser?.name || 'Alex Morgan'}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-10 h-10 rounded-full bg-[#0D1424] border border-[#1E2C48] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-[#070B14]"></span>
              </button>

              <button
                onClick={onOpenSettings}
                className="w-10 h-10 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
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
