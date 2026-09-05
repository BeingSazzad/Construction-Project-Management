import React from 'react';
import { User } from '../../types';
import { 
  X, Users, FileText, Sparkles, TrendingUp,
  Settings, LogOut, ChevronRight,
  CalendarDays, Camera, AlertCircle, Calendar, CheckSquare, MessageSquare, 
  FolderKanban, LayoutDashboard, DollarSign
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenCreateProject?: () => void;
  onOpenCreateBudget?: () => void;
  onSignOut: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeStyle?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateTab,
  onSignOut,
}) => {
  if (!isOpen) return null;

  const go = (tab: string) => {
    onNavigateTab(tab);
    onClose();
  };

  const CORE_ITEMS: NavItem[] = [
    {
      id: 'home',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'projects',
      label: 'Projects Portfolio',
      icon: FolderKanban,
      badge: '3 Active',
      badgeStyle: 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/30',
    },
    {
      id: 'calendar',
      label: 'Schedule & Calendar',
      icon: CalendarDays,
      badge: 'May 16',
      badgeStyle: 'bg-[#F2F2F7] text-[#171A1F] border-[#DDE1E7]',
    },
    {
      id: 'tasks',
      label: 'Tasks & Inspections',
      icon: CheckSquare,
      badge: '4 Today',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const FIELD_ITEMS: NavItem[] = [
    {
      id: 'daily-logs',
      label: 'Daily Field Logs',
      icon: Calendar,
      badge: 'Rain Alert',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'photos',
      label: 'Jobsite Photos',
      icon: Camera,
    },
    {
      id: 'documents',
      label: 'Plans & Permits',
      icon: FileText,
      badge: '28 Files',
      badgeStyle: 'bg-[#F2F2F7] text-[#68707C] border-[#DDE1E7]',
    },
    {
      id: 'punch',
      label: 'Punch List & Quality',
      icon: AlertCircle,
    },
  ];

  const FINANCE_ITEMS: NavItem[] = [
    {
      id: 'budgets',
      label: 'Project Budgets & Costs',
      icon: DollarSign,
      badge: '$1.84M',
      badgeStyle: 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/30',
    },
    {
      id: 'change-orders',
      label: 'Change Orders & Draws',
      icon: TrendingUp,
    },
  ];

  const COLLAB_ITEMS: NavItem[] = [
    {
      id: 'team',
      label: 'Team Directory',
      icon: Users,
    },
    {
      id: 'messages',
      label: 'Messages & Updates',
      icon: MessageSquare,
      badge: '2 New',
      badgeStyle: 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/30',
    },
    {
      id: 'latti',
      label: 'Latti AI Assistant',
      icon: Sparkles,
      badge: 'Active',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'more',
      label: 'Company & Settings',
      icon: Settings,
    },
  ];

  const SectionLabel = ({ label }: { label: string }) => (
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#68707C] px-3 pb-1 pt-1.5 block">
      {label}
    </span>
  );

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => go(item.id)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F2F7] text-[#171A1F] font-medium transition-all text-left cursor-pointer group active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-[#1677FF]">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold truncate text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
            {item.label}
          </span>
        </div>
        {item.badge ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeStyle}`}>
            {item.badge}
          </span>
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
        )}
      </button>
    );
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
              {currentUser.roleTitle || 'Owner & General Contractor'}
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

        {/* ─── Navigation Sections ─── */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 flex flex-col gap-2.5">

          {/* SECTION 1: CORE WORKSPACES */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Core Workspaces" />
            {CORE_ITEMS.map(item => <NavButton key={item.id} item={item} />)}
          </div>

          <div className="h-px bg-[#EAEDF1] mx-2" />

          {/* SECTION 2: FIELD OPERATIONS */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Field Operations" />
            {FIELD_ITEMS.map(item => <NavButton key={item.id} item={item} />)}
          </div>

          <div className="h-px bg-[#EAEDF1] mx-2" />

          {/* SECTION 3: FINANCIAL CONTROL */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Financial Control" />
            {FINANCE_ITEMS.map(item => <NavButton key={item.id} item={item} />)}
          </div>

          <div className="h-px bg-[#EAEDF1] mx-2" />

          {/* SECTION 4: COLLABORATION & SYSTEM */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Collaboration & System" />
            {COLLAB_ITEMS.map(item => <NavButton key={item.id} item={item} />)}
          </div>

        </div>

        {/* ─── Footer ─── */}
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
