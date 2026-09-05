import React from 'react';
import { User, Project } from '../../types';
import { 
  X, Users, Settings, LogOut, ChevronRight,
  FolderKanban, LayoutDashboard, Plus, Bell
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  projects?: Project[];
  activeProject?: Project | null;
  onSelectProject?: (project: Project) => void;
  onNavigateTab: (tab: string) => void;
  onOpenCreateProject?: () => void;
  onSignOut: () => void;
  unreadNotifsCount?: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  projects = [],
  activeProject,
  onSelectProject,
  onNavigateTab,
  onOpenCreateProject,
  onSignOut,
  unreadNotifsCount = 0,
}) => {
  if (!isOpen) return null;

  const go = (tab: string) => {
    onNavigateTab(tab);
    onClose();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex font-sans overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel (Apple Light Theme) */}
      <div
        className="relative w-[300px] max-w-[85%] bg-white border-r border-[#DDE1E7] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-[#171A1F] animate-slide-in"
      >
        {/* ─── Profile Header ─── */}
        <div className="flex items-center gap-3 p-4 border-b border-[#EAEDF1] bg-[#F7F8FA]">
          <div className="w-10 h-10 rounded-full bg-[#1677FF] text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#171A1F] truncate leading-tight">
              {currentUser.name || 'Avery Scott'}
            </p>
            <p className="text-[11px] text-[#68707C] font-medium truncate mt-0.5">
              {currentUser.roleTitle || 'Managing Principal'}
            </p>
            <p className="text-[10px] text-[#1677FF] font-semibold truncate">
              Avery &amp; Marsh Construction
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 active:scale-95 shadow-2xs"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Navigation Body ─── */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-4">

          {/* 1. WORKSPACES */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C] px-2.5 pb-1 block">
              Workspaces
            </span>

            {/* Overview */}
            <button
              onClick={() => go('home')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Overview
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Projects */}
            <button
              onClick={() => go('projects')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <FolderKanban className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Projects
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30">
                {projects.length > 0 ? `${projects.length} Active` : 'All'}
              </span>
            </button>
          </div>

          <div className="h-px bg-[#EAEDF1] mx-1" />

          {/* 2. ACTIVE PROJECTS SWITCHER */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2.5 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
                Active Projects
              </span>
              {onOpenCreateProject && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateProject();
                  }}
                  className="text-[10px] font-bold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {projects.slice(0, 4).map((p) => {
                const isActive = activeProject?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (onSelectProject) {
                        onSelectProject(p);
                      } else {
                        go('projects');
                      }
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all active:scale-[0.99] group ${
                      isActive 
                        ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF]' 
                        : 'hover:bg-[#F2F2F7] text-[#171A1F] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isActive ? 'bg-[#1677FF] shadow-xs shadow-blue-500/50' : 'bg-[#DDE1E7] group-hover:bg-[#68707C]'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${
                          isActive ? 'text-[#1677FF]' : 'text-[#171A1F] group-hover:text-[#1677FF]'
                        }`}>
                          {p.name}
                        </p>
                        <p className="text-[10px] text-[#68707C] truncate">
                          {p.status || 'In Progress'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#68707C] ml-2 flex-shrink-0">
                      {p.progress}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[#EAEDF1] mx-1" />

          {/* 3. COMPANY & ADMIN */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C] px-2.5 pb-1 block">
              Company
            </span>

            {/* Team */}
            <button
              onClick={() => go('team')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Team
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => go('notifications')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Notifications
                </span>
              </div>
              {unreadNotifsCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  {unreadNotifsCount} New
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => go('more')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Settings
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </div>

        {/* ─── Footer: Sign Out ─── */}
        <div className="p-3 border-t border-[#EAEDF1] bg-[#F7F8FA]">
          <button
            onClick={() => { onSignOut(); onClose(); }}
            className="w-full h-9 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
