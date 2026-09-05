import React from 'react';
import { User, Project } from '../../types';
import { 
  X, Users, Settings, LogOut, Plus, Check, ArrowRight, Building2
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

      {/* Minimal MVP Drawer Panel */}
      <div
        className="relative w-[310px] max-w-[85%] bg-white border-r border-[#DDE1E7] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-[#171A1F] animate-slide-in"
      >
        {/* ─── Profile Header ─── */}
        <div className="flex items-center gap-3 p-4 border-b border-[#EAEDF1] bg-[#F7F8FA]">
          <div className="w-10 h-10 rounded-full bg-[#1677FF] text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#171A1F] truncate leading-tight">
              {currentUser.name || 'Avery Scott'}
            </p>
            <p className="text-[11px] text-[#68707C] font-medium truncate mt-0.5">
              {currentUser.roleTitle || 'Managing Principal'}
            </p>
            <p className="text-[10px] text-[#1677FF] font-semibold truncate mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Avery &amp; Marsh Construction
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 active:scale-95 shadow-2xs"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Body Content ─── */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-4">

          {/* 1. PROJECTS SWITCHER (Primary Core Feature) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">
                  Projects
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2F2F7] text-[#68707C]">
                  {projects.length}
                </span>
              </div>
              {onOpenCreateProject && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateProject();
                  }}
                  className="text-[11px] font-semibold text-[#1677FF] hover:text-[#0958D9] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>New Project</span>
                </button>
              )}
            </div>

            {/* Clean Project Items */}
            <div className="flex flex-col gap-1.5">
              {projects.map((p) => {
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
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-[0.99] group ${
                      isActive 
                        ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs' 
                        : 'hover:bg-[#F2F2F7] text-[#171A1F] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        isActive ? 'bg-[#1677FF] ring-2 ring-blue-200' : 'bg-[#DDE1E7] group-hover:bg-[#68707C]'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold leading-snug break-words ${
                          isActive ? 'text-[#1677FF]' : 'text-[#171A1F] group-hover:text-[#1677FF]'
                        }`}>
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#68707C]">
                          <span className="truncate">{p.status || 'In Progress'}</span>
                          <span>•</span>
                          <span className="font-medium text-[#171A1F]">{p.progress}%</span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View All Projects Link */}
            <button
              onClick={() => go('projects')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-[#68707C] hover:text-[#1677FF] transition-colors cursor-pointer mt-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Projects Overview</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-px bg-[#EAEDF1] mx-1" />

          {/* 2. ESSENTIAL QUICK SHORTCUTS */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C] px-1 pb-1 block">
              Quick Shortcuts
            </span>

            {/* Team Directory */}
            <button
              onClick={() => go('team')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 text-[#1677FF]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Team Directory
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#68707C]">
                12
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => go('more')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#F2F2F7] border border-[#DDE1E7] flex items-center justify-center flex-shrink-0 text-[#68707C] group-hover:text-[#171A1F]">
                  <Settings className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                  Settings &amp; App Info
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* ─── Minimal Footer ─── */}
        <div className="p-3.5 border-t border-[#EAEDF1] bg-[#F7F8FA] flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#68707C]">
            Lattice MVP • v1.0
          </span>
          <button
            onClick={() => { onSignOut(); onClose(); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-rose-600 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
