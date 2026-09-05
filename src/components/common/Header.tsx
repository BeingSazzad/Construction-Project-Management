import React from 'react';
import { User, Project } from '../../types';
import { Bell, ChevronLeft } from 'lucide-react';

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
  onOpenSettings
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

  return (
    <header className="w-full flex-shrink-0 z-40 bg-white border-b border-[#DDE1E7] sticky top-0 font-sans">
      <div className="px-5 py-3 flex items-center justify-between gap-3 max-w-[430px] mx-auto">
        {activeProject ? (
          // Project Workspace Top Bar (Figma Screen 2)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                onClick={handleBackClick}
                className="w-9 h-9 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95"
                title="Back to Projects"
              >
                <ChevronLeft className="w-5 h-5 text-[#171A1F]" />
              </button>
              <h1 className="text-base font-bold text-[#171A1F] truncate tracking-tight">
                {activeProject.name}
              </h1>
            </div>

            {/* Right: Bell & Avatar */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] font-bold text-xs flex items-center justify-center cursor-pointer hover:border-[#1677FF] transition-all active:scale-95"
                title="Account Settings"
              >
                {initials}
              </button>
            </div>
          </div>
        ) : activeTab === 'home' ? (
          // Home Top Bar (Figma Screen 1)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <LatticeLogoIcon className="w-7 h-7 flex-shrink-0" />
              <span className="text-base font-black tracking-wider text-[#171A1F] uppercase font-sans">
                LATTICE
              </span>
            </div>

            {/* Right: Bell & Avatar */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] font-bold text-xs flex items-center justify-center cursor-pointer hover:border-[#1677FF] transition-all active:scale-95"
                title="Account Settings"
              >
                {initials}
              </button>
            </div>
          </div>
        ) : (
          // Subpage Top Bar (Latti AI, More, Projects List)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              {handleBackClick && (
                <button
                  onClick={handleBackClick}
                  className="w-9 h-9 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95"
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5 text-[#171A1F]" />
                </button>
              )}
              <h1 className="text-base font-bold text-[#171A1F] tracking-tight">
                {customTitle || (activeTab === 'latti' ? 'Latti AI' : activeTab === 'projects' ? 'Projects' : activeTab === 'more' ? 'More' : activeTab)}
              </h1>
            </div>

            {/* Right: Bell & Avatar */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] font-bold text-xs flex items-center justify-center cursor-pointer hover:border-[#1677FF] transition-all active:scale-95"
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
