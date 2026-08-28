import React from 'react';
import { User } from '../../types';
import { 
  X, Users, FileText, Sparkles, TrendingUp,
  Award, Settings, LogOut, Shield, ChevronRight,
  CalendarDays, Camera, AlertCircle, Calendar, CheckSquare, MessageSquare, Ruler, Cpu
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenCreateProject?: () => void;
  onOpenCreateBudget?: () => void;
  onOpenDealAnalyzer?: () => void;
  onSignOut: () => void;
  currentRole?: string;
  onRoleChange?: (role: any) => void;
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
  currentRole = 'admin',
  onRoleChange
}) => {
  if (!isOpen) return null;

  const go = (tab: string) => {
    onNavigateTab(tab);
    onClose();
  };

  const ROLES = [
    { id: 'admin', title: 'Company Owner', name: 'Alex Chen' },
    { id: 'finance', title: 'Finance Director', name: 'Michael Chang' },
    { id: 'pm', title: 'Senior PM', name: 'Sarah Johnson' },
    { id: 'field', title: 'Field Super', name: 'John Smith' },
  ];

  const TOOLS_ITEMS: NavItem[] = [
    {
      id: 'schedule',
      label: 'Calendar',
      icon: CalendarDays,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: '2 New',
      badgeStyle: 'bg-[#3875F6]/15 text-[#3875F6] border-[#3875F6]/30',
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: Camera,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
    },
    {
      id: 'punch',
      label: 'Punch List',
      icon: AlertCircle,
    },
    {
      id: 'daily-logs',
      label: 'Daily Logs',
      icon: Calendar,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: CheckSquare,
    },
  ];

  const EXTRA_ITEMS: NavItem[] = [
    {
      id: 'intelligence-center',
      label: 'AI Intelligence Center',
      icon: Cpu,
      badge: '96.8% Acc',
      badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    {
      id: 'buildscope',
      label: 'BuildScope AI',
      icon: Ruler,
      badge: 'PlanGrid',
      badgeStyle: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: TrendingUp,
      badge: '$3.77M',
      badgeStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'team',
      label: 'Team Directory',
      icon: Users,
    },
  ];

  const ACCOUNT_ITEMS: NavItem[] = [
    {
      id: 'more',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const SectionLabel = ({ label }: { label: string }) => (
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1 block">
      {label}
    </span>
  );

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => go(item.id)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-600/10 text-slate-300 hover:text-white font-medium transition-all text-left cursor-pointer group active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-[#60A5FA]">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold truncate">{item.label}</span>
        </div>
        {item.badge ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeStyle}`}>
            {item.badge}
          </span>
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
        )}
      </button>
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex font-sans overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-[280px] max-w-[85%] bg-[#070D1A] border-r border-[#142036] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-slate-100 animate-slide-in"
      >

        {/* ─── Profile Header ─── */}
        <div className="flex items-center gap-3 p-3.5 border-b border-[#142036] bg-[#0A1020]">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/40 shadow"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A1020]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-blue-400 font-medium truncate mt-0.5">
              {currentUser.roleTitle || 'Company Owner'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#0E1A33] border border-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ─── Role Switcher Selector ─── */}
        {onRoleChange && (
          <div className="mx-3 mt-3 p-2.5 rounded-2xl bg-[#091122] border border-[#142036] flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-0.5">
              Active User Role
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {ROLES.map((r) => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      onClose();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-left truncate cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'bg-[#050811] text-slate-400 hover:text-slate-200 border border-[#142036]'
                    }`}
                  >
                    {r.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Compact Navigation Sections ─── */}
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-3">

          {/* SECTION: TOOLS */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="TOOLS" />
            {TOOLS_ITEMS.map(item => <NavButton key={`${item.id}-${item.label}`} item={item} />)}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#142036] mx-3" />

          {/* SECTION: AI & Intelligence Center */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="AI & INTELLIGENCE CENTER" />
            {EXTRA_ITEMS.map(item => <NavButton key={`${item.id}-${item.label}`} item={item} />)}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#142036] mx-3" />

          {/* SECTION: Account */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Account & Setup" />
            {ACCOUNT_ITEMS.map(item => <NavButton key={`${item.id}-${item.label}`} item={item} />)}
          </div>

        </div>

        {/* ─── Footer ─── */}
        <div className="p-3 border-t border-[#142036] bg-[#050811]">
          <button
            onClick={() => { onSignOut(); onClose(); }}
            className="w-full h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/15 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
