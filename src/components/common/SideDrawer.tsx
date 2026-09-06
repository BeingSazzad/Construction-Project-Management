import React from 'react';
import { User, Project } from '../../types';
import { 
  X, Users, Settings, LogOut, FileText, Bell, 
  ChevronRight, ShieldCheck, HelpCircle, Wallet, Flag
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  projects?: Project[];
  activeProject?: Project | null;
  onSelectProject?: (project: Project) => void;
  onNavigateTab: (tab: string, subView?: string) => void;
  onOpenCreateProject?: () => void;
  onSignOut: () => void;
  unreadNotifsCount?: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateTab,
  onSignOut,
  unreadNotifsCount = 0,
}) => {
  if (!isOpen) return null;

  const go = (tab: string, subView?: string) => {
    onNavigateTab(tab, subView);
    onClose();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const OPERATIONS_ITEMS = [
    {
      id: 'budgets',
      label: 'Portfolio Budgets',
      icon: Wallet,
      iconColor: 'bg-blue-50 text-[#1677FF]',
    },
    {
      id: 'team',
      label: 'Team Directory',
      icon: Users,
      iconColor: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'milestones',
      label: 'Milestone Tracker',
      icon: Flag,
      iconColor: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'daily-logs',
      label: 'Daily Field Logs',
      icon: FileText,
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'notifications',
      label: 'Notifications & Alerts',
      icon: Bell,
      iconColor: 'bg-sky-50 text-sky-600',
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : undefined,
    },
  ];

  const ACCOUNT_ITEMS = [
    {
      id: 'company',
      label: 'Company Profile',
      icon: ShieldCheck,
      iconColor: 'bg-slate-100 text-slate-600',
      subView: 'company',
    },
    {
      id: 'account',
      label: 'Account & Settings',
      icon: Settings,
      iconColor: 'bg-slate-100 text-slate-600',
      subView: 'main',
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: HelpCircle,
      iconColor: 'bg-slate-100 text-slate-600',
      subView: 'support',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex font-sans overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity"
      />

      {/* Clean, Clutter-Free Drawer Panel */}
      <div
        className="relative w-[300px] max-w-[85%] bg-white border-r border-slate-200 h-full shadow-2xl flex flex-col z-10 overflow-hidden text-[#0F172A] animate-slide-in"
      >
        {/* ─── Profile Header ─── */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="w-10 h-10 rounded-full bg-[#1677FF] text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate leading-tight">
              {currentUser.name || 'Avery Scott'}
            </p>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {currentUser.roleTitle || 'Managing Principal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 active:scale-95 shadow-xs"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── Clutter-Free, Single-Line Menu Items ─── */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-4">
          
          {/* Group 1: Company Operations */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 block">
              Company Operations
            </span>

            {OPERATIONS_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-[0.99] group hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${item.iconColor} group-hover:bg-[#1677FF] group-hover:text-white`}>
                      <IconComp className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-800 group-hover:text-[#1677FF] transition-colors truncate">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {item.badge && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1677FF] text-white">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-slate-100 mx-1" />

          {/* Group 2: Account & System */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5 block">
              Account &amp; System
            </span>

            {ACCOUNT_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id, item.subView)}
                  className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-[0.99] group hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${item.iconColor} group-hover:bg-[#1677FF] group-hover:text-white`}>
                      <IconComp className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-800 group-hover:text-[#1677FF] transition-colors truncate">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Minimal Footer ─── */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            Lattice MVP • v1.0
          </span>
          <button
            onClick={() => { onSignOut(); onClose(); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
