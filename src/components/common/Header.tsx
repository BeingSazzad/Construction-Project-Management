import React, { useState, useRef, useEffect } from 'react';
import { User, Project } from '../../types';
import { Bell, ChevronLeft, Sparkles, Menu, MessageSquare, MoreVertical, Edit3, Trash2 } from 'lucide-react';
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

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Alex';
  const avatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'projects': return 'Active Projects';
      case 'tasks': return 'Task Management';
      case 'punch': return 'Punch List Items';
      case 'budgets': return 'Budgets & Financials';
      case 'draws': return 'Financing Draws';
      case 'lien-waivers': return 'Lien Waivers';
      case 'opportunities': return 'Opportunities & Deals';
      case 'team': return 'Company Team';
      case 'messages': return 'Messages & Team Chat';
      case 'notifications': return 'Notifications';
      case 'more': return 'Settings & Profile';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  return (
    <header className="w-full flex-shrink-0 z-40 bg-[#060913] border-b border-[#142036] sticky top-0 font-sans">
      <div className="px-5 py-3 flex items-center justify-between gap-3 max-w-[430px] mx-auto">
        {activeProject ? (
          // Inside Project Workspace Header (Has Back Button & 3-Dots Action Menu)
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={handleBackClick}
                className="w-10 h-10 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] flex items-center justify-center text-slate-300 hover:text-white transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-sm"
                title="Back"
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

            {/* 3-Dots Action Menu (Edit Info / Delete) */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm ml-2"
                title="Project Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-11 w-44 bg-[#0A111F] border border-[#1E2E4A] rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50 animate-fade-in backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenEditProject) onOpenEditProject();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-[#141F33] hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Project Info</span>
                  </button>

                  <div className="h-px bg-[#142036] my-1" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onDeleteProject) {
                        if (window.confirm(`Are you sure you want to permanently delete "${activeProject.name}"?`)) {
                          onDeleteProject(activeProject.id);
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Project</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : activeTab !== 'home' ? (
          // Sub-pages / Non-Home Top Header with Back to Home button
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleBackClick}
                className="w-10 h-10 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] flex items-center justify-center text-slate-300 hover:text-white transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-sm"
                title="Back to Home"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                  {customTitle || getTabTitle(activeTab)}
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Lattice Construction</p>
              </div>
            </div>

            <div 
              onClick={onOpenSettings}
              className="cursor-pointer"
            >
              <img
                src={avatarUrl}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/30 hover:border-blue-500/60 transition-colors shadow-sm"
              />
            </div>
          </div>
        ) : (
          // Home Dashboard Header with Hamburger Drawer Button
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Drawer Hamburger Button */}
              <button
                onClick={onOpenDrawer}
                className="w-10 h-10 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
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
                    Lattice Construction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {onOpenMessages && (
                <button
                  onClick={onOpenMessages}
                  className="w-9 h-9 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4 text-slate-300" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#3875F6] ring-2 ring-[#060913]" />
                  )}
                </button>
              )}

              <button
                onClick={onOpenNotifications}
                className="w-9 h-9 rounded-full bg-[#131C2E] hover:bg-[#1C2A44] border border-[#1E293B] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative active:scale-95 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-[#060913]" />
                )}
              </button>

              <button
                onClick={onOpenLatti}
                className="w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 relative"
                title="Latti AI Assistant"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#2563EB]" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
