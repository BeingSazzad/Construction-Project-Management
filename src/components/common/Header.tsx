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
  return (
    <header className="w-full flex-shrink-0 z-40 bg-[#070A12] border-b border-[#121A2A] sticky top-0">
      <div className="px-5 py-3 flex items-center justify-between gap-3">
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
          // Top Level Header (Matching Exact Reference Layout)
          <>
            {/* Left User Profile Avatar */}
            <div 
              className="cursor-pointer flex-shrink-0 relative" 
              onClick={onOpenSettings} 
              title="View Profile & Settings"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#1E2B42]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#070A12]"></span>
            </div>

            {/* Center LATTICE Brand Logo */}
            <div className="flex items-center justify-center flex-1">
              <LatticeLogo size="sm" layout="horizontal" showTagline={false} />
            </div>

            {/* Right Search and Notification Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-8 h-8 rounded-xl bg-[#0E1524] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer relative"
                title="Search & Notifications"
              >
                <Search className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
