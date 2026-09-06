import React from 'react';
import { User, Project } from '../../types';
import { 
  X, Users, Settings, LogOut, Building2, Calendar, 
  Home, FileText, DollarSign, CheckSquare, ChevronRight, Sparkles
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
  onNavigateTab,
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

  const NAV_ITEMS = [
    {
      id: 'home',
      label: 'Home Dashboard',
      description: 'Executive overview & KPIs',
      icon: Home,
    },
    {
      id: 'projects',
      label: 'Projects',
      description: `${projects.length} Active jobsites`,
      icon: Building2,
      badge: `${projects.length}`,
    },
    {
      id: 'schedule',
      label: 'Master Schedule',
      description: 'Gantt & milestones',
      icon: Calendar,
    },
    {
      id: 'daily-logs',
      label: 'Daily Logs',
      description: 'Site updates & field reports',
      icon: FileText,
    },
    {
      id: 'budgets',
      label: 'Budgets & Financials',
      description: 'Cost codes & expenses',
      icon: DollarSign,
    },
    {
      id: 'punch',
      label: 'Punch List',
      description: 'Deficiency tracking & QA',
      icon: CheckSquare,
    },
    {
      id: 'team',
      label: 'Team Directory',
      description: 'Subcontractors & staff',
      icon: Users,
    },
    {
      id: 'latti',
      label: 'Latti AI Intelligence',
      description: 'AI site copilot & analysis',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'more',
      label: 'Settings & Account',
      description: 'Preferences & system info',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex font-sans overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Minimal MVP Drawer Panel */}
      <div
        className="relative w-[320px] max-w-[85%] bg-white border-r border-[#DDE1E7] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-[#171A1F] animate-slide-in"
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

        {/* ─── Clean Navigation Menu (No Cluttered Project List) ─── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C] px-2 py-1 block">
            Navigation Hub
          </span>

          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-[0.99] group border ${
                    item.highlight 
                      ? 'bg-blue-50/60 border-blue-200/60 hover:bg-blue-100/50' 
                      : 'border-transparent hover:bg-[#F2F2F7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      item.highlight 
                        ? 'bg-[#1677FF] text-white' 
                        : 'bg-[#EAF3FF] text-[#1677FF] group-hover:bg-[#1677FF] group-hover:text-white'
                    }`}>
                      <IconComp className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-[#68707C] truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1677FF] text-white">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-[#9DA5B1] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
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
