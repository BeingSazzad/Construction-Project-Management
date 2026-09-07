import React, { useState, useRef, useEffect } from 'react';
import { User, Project } from '../../types';
import { 
  Bell, ChevronLeft, Menu, MessageSquare, MoreVertical, Edit3, Trash2, Search 
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
  onOpenLatti?: () => void;
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
  onNavigateTab,
  onOpenEditProject,
  onDeleteProject
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleBackClick = onBack || onBackToHome;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Do not close if clicking Figma Chrome extension UI or outside document
      if (
        !target ||
        target.tagName === 'HTML' ||
        target.closest?.('[id*="figma"], [class*="figma"], [id*="html-to-design"], [class*="html-to-design"], [id*="h2d"], [class*="h2d"], [data-figma], [data-h2d], [data-extension], [id*="extension"], [class*="extension"]')
      ) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
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
      case 'projects': return 'Projects';
      case 'calendar': return 'Master Calendar';
      case 'schedule': return 'Master Schedule';
      case 'tasks': return 'Task Management';
      case 'punch': return 'Punch List Items';
      case 'budgets': return 'Budgets & Financials';
      case 'daily-logs': return 'Daily Logs';
      case 'photos': return 'Site Photos';
      case 'documents': return 'Plans & Permits';
      case 'team': return 'Team Directory';
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
            <div className="relative flex-shrink-0 flex items-center" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Project Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Options */}
              {isMenuOpen && (
                <div className="absolute right-0 top-11 w-44 rounded-2xl bg-white border border-[#DDE1E7] shadow-xl z-50 py-1.5 overflow-hidden animate-fade-in divide-y divide-[#EAEDF1]">
                  {onOpenEditProject && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenEditProject();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#171A1F] hover:bg-[#F2F2F7] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#68707C]" />
                      <span>Edit Project</span>
                    </button>
                  )}

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
          // Sub-pages / Non-Home Top Header with Back to Home button (Clean: NO hamburger, NO avatar)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 min-w-0">
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
              </div>
            </div>
          </div>
        ) : (
          // Home Dashboard Header with Hamburger Drawer Button, Avatar Profile, and Right Actions (Light Mode)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              {/* Drawer Hamburger Button */}
              {onOpenDrawer && (
                <button
                  onClick={onOpenDrawer}
                  className="w-10 h-10 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-xs"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-[#0F172A]" />
                </button>
              )}

              <div 
                onClick={onOpenSettings}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              >
                <img
                  src={avatarUrl}
                  alt={currentUser?.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] group-hover:border-[#1677FF] transition-colors shadow-xs flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[11px] text-[#64748B] font-medium leading-none block">
                    Good morning,
                  </span>
                  <h1 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight leading-snug truncate group-hover:text-[#1677FF] transition-colors mt-0.5">
                    {currentUser?.name || 'Avery Scott'}
                  </h1>
                  <p className="text-[11px] text-[#64748B] font-medium truncate leading-none mt-0.5">
                    {currentUser?.company || 'Avery & Marsh Construction'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => (onNavigateTab ? onNavigateTab('projects') : null)}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Search"
              >
                <Search className="w-4 h-4 text-[#0F172A]" />
              </button>

              <button
                onClick={() => (onOpenMessages ? onOpenMessages() : onNavigateTab ? onNavigateTab('messages') : null)}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-xs"
                title="Messages"
              >
                <MessageSquare className="w-4 h-4 text-[#0F172A]" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#1677FF] ring-2 ring-white" />
                )}
              </button>

              <button
                onClick={onOpenNotifications}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#0F172A]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#1677FF] ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
