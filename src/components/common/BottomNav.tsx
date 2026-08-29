import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, FolderKanban, DollarSign, TrendingUp, Plus, 
  CalendarDays, Users, FileSpreadsheet, CreditCard, MessageSquare
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAction?: () => void;
}

const ROLE_NAV_ITEMS: Record<UserRole, { 
  left: { id: string; label: string; icon: React.ElementType }[]; 
  right: { id: string; label: string; icon: React.ElementType }[] 
}> = {
  admin: {
    left: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
    ],
    right: [
      { id: 'opportunities', label: 'Deals', icon: TrendingUp },
      { id: 'budgets', label: 'Budgets', icon: DollarSign },
    ]
  },
  finance: {
    left: [
      { id: 'home', label: 'Finance', icon: Home },
      { id: 'budgets', label: 'Budgets', icon: FileSpreadsheet },
    ],
    right: [
      { id: 'finance', label: 'Draws', icon: CreditCard },
      { id: 'opportunities', label: 'Deals', icon: TrendingUp },
    ]
  },
  pm: {
    left: [
      { id: 'home', label: 'PM Home', icon: Home },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
    ],
    right: [
      { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      { id: 'team', label: 'Team', icon: Users },
    ]
  },
  field: {
    left: [
      { id: 'home', label: 'Field', icon: Home },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
    ],
    right: [
      { id: 'calendar', label: 'Schedule', icon: CalendarDays },
      { id: 'messages', label: 'Chat', icon: MessageSquare },
    ]
  }
};

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole = 'admin',
  activeTab,
  onTabChange,
  onQuickAction,
}) => {
  const roleNav = ROLE_NAV_ITEMS[currentRole] || ROLE_NAV_ITEMS.admin;
  const leftItems = roleNav.left;
  const rightItems = roleNav.right;

  // STYLE 3: Precision Linear-Grade Command Bar with Top Laser Line & Elevated Obsidian Ring FAB
  const NavBtn = ({ id, label, icon: Icon }: { id: string; label: string; icon: React.ElementType }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => onTabChange(id)}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-150 cursor-pointer group ${
          isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {/* Top Laser Line Active Indicator */}
        {isActive && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]" />
        )}

        <div className="relative pt-0.5">
          <Icon className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${
            isActive ? 'text-[#38BDF8] stroke-[2.4]' : 'text-slate-400 stroke-[1.8]'
          }`} />
        </div>

        <span className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors leading-none ${
          isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-300'
        }`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050813]/98 backdrop-blur-xl border-t border-[#131D31]">
      <div 
        className="max-w-[430px] mx-auto px-3 flex items-center justify-between relative" 
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)', paddingTop: '4px' }}
      >

        {/* Left Role Tabs */}
        <div className="flex items-center flex-1 justify-around">
          {leftItems.map(item => <NavBtn key={item.id} {...item} />)}
        </div>

        {/* Center: Elevated Ring Floating Action Button */}
        <div className="flex items-center justify-center px-2 flex-shrink-0">
          <button
            onClick={onQuickAction}
            className="w-[46px] h-[46px] -mt-5 rounded-2xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] ring-4 ring-[#050813] border border-blue-400/40 text-white flex items-center justify-center shadow-xl shadow-blue-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Create: Project · Budget · Deal · Task"
          >
            <Plus className="w-5 h-5 stroke-[2.5] text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Right Role Tabs */}
        <div className="flex items-center flex-1 justify-around">
          {rightItems.map(item => <NavBtn key={item.id} {...item} />)}
        </div>

      </div>
    </nav>
  );
};
