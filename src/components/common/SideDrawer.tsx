import React from 'react';
import { User } from '../../types';
import { 
  X, Users, FileText, Sparkles, 
  Award, Settings, LogOut, Shield,
  ChevronRight
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

  const TOOLS_ITEMS: NavItem[] = [
    {
      id: 'team',
      label: 'Team Directory',
      icon: Users,
    },
    {
      id: 'reports',
      label: 'Field Reports',
      icon: FileText,
    },
    {
      id: 'latti',
      label: 'Latti AI Copilot',
      icon: Sparkles,
      badge: 'Active',
      badgeStyle: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    },
  ];

  const ACCOUNT_ITEMS: NavItem[] = [
    {
      id: 'more',
      label: 'Builder Score',
      icon: Award,
      badge: '40/100',
      badgeStyle: 'bg-[#101D38] text-blue-400 border-[#1E325A]',
    },
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
    <div className="fixed inset-0 z-50 flex font-sans overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-[270px] max-w-[80%] bg-[#070D1A] border-r border-[#142036] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-slate-100 animate-slide-in"
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

        {/* ─── Company Badge ─── */}
        <div className="mx-3 mt-3 p-2 rounded-xl bg-[#091122] border border-[#142036] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Company</p>
            <p className="text-xs font-bold text-white truncate">Avery Marsh Builders</p>
          </div>
        </div>

        {/* ─── Compact Navigation Sections ─── */}
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-3">

          {/* SECTION: Tools */}
          <div className="flex flex-col gap-0.5">
            <SectionLabel label="Operations & Tools" />
            {TOOLS_ITEMS.map(item => <NavButton key={`${item.id}-${item.label}`} item={item} />)}
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
