import React, { useState, useRef, useEffect } from 'react';
import { User, Project } from '../../types';
import { 
  Bell, ChevronLeft, Sparkles, Menu, MessageSquare, MoreVertical, Edit3, Trash2 
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

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

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeProject,
  activeTab = 'home',
  customTitle,
  unreadNotifsCount,
  unreadMessagesCount = 2,
  onBackToHome,
  onBack,
  onOpenNotifications,
  onOpenMessages,
  onOpenLatti,
  onOpenSettings,
  onOpenDrawer,
  onOpenEditProject,
  onDeleteProject
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleBackClick = onBack || onBackToHome;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Avery';
  const avatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'projects': return 'Active Projects';
      case 'calendar': return 'Master Calendar';
      case 'schedule': return 'Master Schedule';
      case 'tasks': return 'Task Management';
      case 'punch': return 'Punch List Items';
      case 'budgets': return 'Budgets & Financials';
      case 'daily-logs': return 'Daily Field Logs';
      case 'photos': return 'Site Photos';
      case 'documents': return 'Plans & Permits';
      case 'team': return 'Company Team';
      case 'messages': return 'Messages & Team Chat';
      case 'notifications': return 'Notifications';
      case 'more': return 'Settings & Profile';
      case 'latti': return 'Latti AI Assistant';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <header className="w-full flex-shrink-0 z-40 bg-white border-b border-[#DDE1E7] sticky top-0 font-sans shadow-xs">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-3">
        {activeProject ? (
          // Inside Project Workspace Header (Has Back Button & 3-Dots Action Menu)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-xs"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleBackClick}
                className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-xs"
                title="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col min-w-0">
                <h1 className="text-sm md:text-base font-bold text-[#171A1F] truncate tracking-tight leading-tight">
                  {activeProject.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[#68707C] mt-0.5 font-medium">
                  <span className="truncate">{activeProject.cityState}</span>
                  <StatusBadge status={activeProject.status} size="xs" />
                </div>
              </div>
            </div>

            {/* 3-Dots Action Menu (Edit Info / Delete) */}
            <div className="relative flex-shrink-0 flex items-center gap-2" ref={menuRef}>
              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Project Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white border border-[#DDE1E7] rounded-2xl shadow-xl overflow-hidden py-1.5 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenEditProject) onOpenEditProject();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#171A1F] hover:bg-[#F2F2F7] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#1677FF]" />
                    <span>Edit Project Info</span>
                  </button>

                  <div className="h-px bg-[#EAEDF1] my-1" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onDeleteProject) {
                        if (window.confirm(`Are you sure you want to permanently delete "${activeProject.name}"?`)) {
                          onDeleteProject(activeProject.id);
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete Project</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab !== 'home' ? (
          // Sub-pages / Non-Home Top Header with Back to Home button
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-xs"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleBackClick}
                className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-xs"
                title="Back to Home"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm md:text-base font-bold text-[#171A1F] tracking-tight leading-tight">
                  {customTitle || getTabTitle(activeTab)}
                </h1>
                <p className="text-[10px] text-[#68707C] font-medium">Lattice Construction</p>
              </div>
            </div>

            <div 
              onClick={onOpenSettings}
              className="cursor-pointer flex items-center gap-2"
            >
              <img
                src={avatarUrl}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#1677FF]/30 hover:border-[#1677FF] transition-colors shadow-xs"
              />
            </div>
          </div>
        ) : (
          // Home Dashboard Header with Hamburger Drawer Button, Avatar Profile, and Right Actions (Light Mode)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Drawer Hamburger Button */}
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-xs"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              <div 
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              >
                <img
                  src={avatarUrl}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#1677FF]/30 group-hover:border-[#1677FF] transition-colors shadow-xs flex-shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-bold text-[#171A1F] tracking-tight leading-tight truncate group-hover:text-[#1677FF] transition-colors">
                    Good morning, {firstName}
                  </h1>
                  <p className="text-xs text-[#525866] mt-0.5 font-medium truncate">
                    Avery &amp; Marsh Construction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {onOpenMessages && (
                <button
                  onClick={onOpenMessages}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-xs"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4 text-[#171A1F]" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                  )}
                </button>
              )}

              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#171A1F]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1677FF]" />
                )}
              </button>

              <button
                onClick={onOpenLatti}
                className="w-9 h-9 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 relative"
                title="Latti AI Assistant"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#1677FF]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
