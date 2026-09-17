import React from 'react';
import {
  Folder, Sparkles, User, Plus, ClipboardList, Users, Home
} from 'lucide-react';
import { User as AppUser } from '../../types';

interface AppSidebarProps {
  activeTab: string;
  currentUser: AppUser;
  onTabChange: (tab: string) => void;
  onQuickAction?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  currentUser,
  onTabChange,
  onQuickAction,
}) => {
  const go = (tab: string) => onTabChange(tab);
  const isActive = (tab: string, extra?: string[]) =>
    activeTab === tab || (extra ? extra.includes(activeTab) : false);

  const itemClass = (on: boolean) =>
    `w-full h-10 px-3 rounded-xl flex items-center gap-3 text-sm cursor-pointer transition-colors ${
      on
        ? 'bg-[#EAF3FF] text-[#1677FF] font-semibold'
        : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-medium'
    }`;

  return (
    <aside className="hidden md:flex w-52 shrink-0 h-full flex-col bg-white border border-[#E2E8F0] border-r-0">
      <div className="px-4 h-14 flex items-center gap-2 border-b border-[#E2E8F0]">
        <div className="w-2 h-2 rounded-full bg-[#1677FF]" />
        <span className="text-xs font-bold tracking-wider text-[#0F172A]">LATTICE</span>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onQuickAction}
          className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <button type="button" onClick={() => go('home')} className={itemClass(isActive('home'))}>
          <Home className="w-4 h-4" />
          Home
        </button>
        <button type="button" onClick={() => go('projects')} className={itemClass(isActive('projects'))}>
          <Folder className="w-4 h-4" />
          Projects
        </button>
        <button type="button" onClick={() => go('daily-logs')} className={itemClass(isActive('daily-logs'))}>
          <ClipboardList className="w-4 h-4" />
          Daily Logs
        </button>
        <button type="button" onClick={() => go('team')} className={itemClass(isActive('team'))}>
          <Users className="w-4 h-4" />
          Team
        </button>
        <button type="button" onClick={() => go('latti')} className={itemClass(isActive('latti'))}>
          <Sparkles className="w-4 h-4" />
          Latti AI
        </button>
        <button
          type="button"
          onClick={() => go('account')}
          className={itemClass(isActive('account', ['more']))}
        >
          <User className="w-4 h-4" />
          Account
        </button>
      </nav>

      <div className="p-3 border-t border-[#E2E8F0]">
        <p className="text-xs font-semibold text-[#0F172A] truncate">{currentUser.name}</p>
        <p className="text-[11px] text-[#64748B] truncate mt-0.5">{currentUser.roleTitle}</p>
      </div>
    </aside>
  );
};
