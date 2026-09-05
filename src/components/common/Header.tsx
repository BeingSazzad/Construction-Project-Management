import React from 'react';
import { User, Project } from '../../types';
import { 
  Bell, ChevronLeft, Menu, Plus, Sparkles 
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  activeProject?: Project | null;
  activeTab?: string;
  customTitle?: string;
  unreadNotifsCount: number;
  unreadMessagesCount?: number;
  onBackToHome?: () => void;
  onBack?: () => void;
  onOpenNotifications: () => void;
  onOpenMessages?: () => void;
  onOpenLatti: () => void;
  onOpenSettings: () => void;
  onOpenDrawer?: () => void;
  onNavigateTab?: (tab: string) => void;
  onQuickAction?: () => void;
  onMarkAllRead?: () => void;
  onOpenEditProject?: () => void;
  onDeleteProject?: (projectId: string) => void;
}

// Geometric Lattice Logo Icon matching Figma
export const LatticeLogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M12 2C12 2 13.5 6.5 17 8C20.5 9.5 22 12 22 12C22 12 17.5 13.5 16 17C14.5 20.5 12 22 12 22C12 22 10.5 17.5 7 16C3.5 14.5 2 12 2 12C2 12 6.5 10.5 8 7C9.5 3.5 12 2 12 2Z" 
      fill="#1677FF" 
    />
    <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeProject,
  activeTab = 'home',
  customTitle,
  unreadNotifsCount,
  onBackToHome,
  onBack,
  onOpenNotifications,
  onOpenLatti,
  onOpenSettings,
  onOpenDrawer,
  onNavigateTab,
  onQuickAction
}) => {
  const handleBackClick = onBack || onBackToHome;

  const getInitials = (name?: string) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(currentUser?.name || 'Avery Scott');

  const navPills = [
    { id: 'home', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Schedule' },
    { id: 'daily-logs', label: 'Daily Logs' },
    { id: 'budgets', label: 'Budgets' },
  ];

  return (
    <header className="w-full flex-shrink-0 z-40 bg-white border-b border-[#DDE1E7] sticky top-0 font-sans shadow-xs">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-3">
        {activeProject ? (
          // Project Workspace Top Bar (Figma Screen 2)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Drawer Toggle */}
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4 text-[#171A1F]" />
                </button>
              )}

              {/* Back to Projects */}
              <button
                onClick={handleBackClick}
                className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95"
                title="Back to Projects"
              >
                <ChevronLeft className="w-5 h-5 text-[#171A1F]" />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-sm md:text-base font-bold text-[#171A1F] truncate tracking-tight">
                  {activeProject.name}
                </h1>
                <p className="text-[10px] text-[#68707C] font-medium truncate hidden sm:block">
                  {activeProject.cityState} · Status: {activeProject.status}
                </p>
              </div>
            </div>

            {/* Right: Quick Action, Bell & Avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onQuickAction && (
                <button
                  onClick={onQuickAction}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Action</span>
                </button>
              )}

              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-xl bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] font-bold text-xs flex items-center justify-center cursor-pointer hover:border-[#1677FF] transition-all active:scale-95"
                title="Account Settings"
              >
                {initials}
              </button>
            </div>
          </div>
        ) : (
          // Global App Header with Hamburger Drawer, Logo, Desktop Pills, & Right Tools
          <div className="flex items-center justify-between w-full">
            {/* Left: Hamburger Drawer + Brand */}
            <div className="flex items-center gap-2.5">
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4 text-[#171A1F]" />
                </button>
              )}

              {/* Logo & Name */}
              <div 
                onClick={() => onNavigateTab ? onNavigateTab('home') : (onBackToHome && onBackToHome())}
                className="flex items-center gap-2 cursor-pointer select-none group"
              >
                <LatticeLogoIcon className="w-7 h-7 flex-shrink-0 group-hover:scale-105 transition-transform" />
                <span className="text-base font-black tracking-wider text-[#171A1F] uppercase font-sans">
                  LATTICE
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation Pills (Visible on md/lg screens) */}
            {onNavigateTab && (
              <nav className="hidden md:flex items-center gap-1 bg-[#F2F2F7] p-1 rounded-2xl border border-[#DDE1E7]">
                {navPills.map((pill) => {
                  const isActive = activeTab === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => onNavigateTab(pill.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1677FF] text-white shadow-xs'
                          : 'text-[#68707C] hover:text-[#171A1F] hover:bg-white/70'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right: Quick Action, Latti AI, Notifications & Avatar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onQuickAction && (
                <button
                  onClick={onQuickAction}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              )}

              {/* Latti AI Assistant trigger */}
              <button
                onClick={onOpenLatti}
                className="w-9 h-9 rounded-xl bg-[#EAF3FF] hover:bg-[#1677FF] text-[#1677FF] hover:text-white border border-[#1677FF]/25 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Latti AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Notifications */}
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              {/* Profile Avatar */}
              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-xl bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] font-bold text-xs flex items-center justify-center cursor-pointer hover:border-[#1677FF] transition-all active:scale-95"
                title="Account Settings"
              >
                {initials}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
