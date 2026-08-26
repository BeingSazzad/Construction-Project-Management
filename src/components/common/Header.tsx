import React from 'react';
import { User, Project } from '../../types';
import { Bell, ChevronLeft, Sparkles, Menu } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  currentUser: User;
  activeProject?: Project | null;
  activeTab?: string;
  unreadNotifsCount: number;
  onBackToHome?: () => void;
  onOpenNotifications: () => void;
  onOpenLatti: () => void;
  onOpenSettings: () => void;
  onOpenDrawer?: () => void;
  onMarkAllRead?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeProject,
  activeTab = 'home',
  unreadNotifsCount,
  onBackToHome,
  onOpenNotifications,
  onOpenLatti,
  onOpenSettings,
  onOpenDrawer
}) => {
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex';
  const avatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  // If on top-level non-home pages (Projects, Tasks, Budgets, Settings, etc.), omit header to prevent double titles
  if (!activeProject && activeTab !== 'home') {
    return null;
  }

  return (
    <header className="w-full flex-shrink-0 z-40 bg-[#060913] border-b border-[#142036] sticky top-0 font-sans">
      <div className="px-5 py-3 flex items-center justify-between gap-3 max-w-[430px] mx-auto">
        {activeProject ? (
          // Inside Project Workspace Header (Has Back Button)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={onBackToHome}
                className="w-10 h-10 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center justify-center text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer active:scale-95 shadow-sm"
                title="Back to Home"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col min-w-0">
                <h1 className="text-sm font-bold text-white truncate tracking-tight leading-tight">
                  {activeProject.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                  <span className="truncate">{activeProject.cityState}</span>
                  <StatusBadge status={activeProject.status} size="xs" />
                </div>
              </div>
            </div>

            {/* Workspace Action Icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-10 h-10 rounded-2xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-[#0D1424]" />
                )}
              </button>

              <button
                onClick={onOpenLatti}
                className="w-10 h-10 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 relative"
                title="Latti AI Assistant"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#2563EB]" />
              </button>
            </div>
          </div>
        ) : (
          // Home Dashboard Header with Hamburger Drawer Button
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Drawer Hamburger Button */}
              <button
                onClick={onOpenDrawer}
                className="w-10 h-10 rounded-2xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div 
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              >
                <img
                  src={avatarUrl}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/30 group-hover:border-blue-500/60 transition-colors shadow-sm flex-shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight truncate group-hover:text-[#3875F6] transition-colors">
                    Good morning, {firstName}! 👋
                  </h1>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                    Avery & Marsh Construction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-10 h-10 rounded-2xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-[#0D1424]" />
                )}
              </button>

              <button
                onClick={onOpenLatti}
                className="w-10 h-10 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 relative"
                title="Latti AI Assistant"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#2563EB]" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
