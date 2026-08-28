import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, FolderKanban, DollarSign, TrendingUp, Plus, 
  CalendarDays, Users, Camera, AlertCircle, FileSpreadsheet, CreditCard, MessageSquare
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
      { id: 'messages', label: 'Messages', icon: MessageSquare },
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

  const NavBtn = ({ id, label, icon: Icon }: { id: string; label: string; icon: React.ElementType }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => onTabChange(id)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 gap-0.5 rounded-xl transition-all cursor-pointer relative ${
          isActive ? 'text-[#3875F6]' : 'text-slate-500 hover:text-slate-200'
        }`}
      >
        <Icon className={`w-[22px] h-[22px] transition-all ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className={`text-[10px] font-semibold tracking-tight transition-all ${isActive ? 'text-[#3875F6]' : ''}`}>
          {label}
        </span>
        {/* Active indicator dot */}
        {isActive && (
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#3875F6]" />
        )}
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060913]/97 backdrop-blur-xl border-t border-[#142036]/80">
      <div className="max-w-[430px] mx-auto px-4 flex items-center justify-between" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)', paddingTop: '8px' }}>

        {/* Left Role-Specific Items */}
        <div className="flex items-center gap-0 flex-1 justify-around">
          {leftItems.map(item => <NavBtn key={item.id} {...item} />)}
        </div>

        {/* Center: FAB — primary create action */}
        <div className="flex items-center justify-center px-3">
          <button
            onClick={onQuickAction}
            className="w-[52px] h-[52px] rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-xl shadow-blue-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0 -mt-3"
            title="Create Action"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Role-Specific Items */}
        <div className="flex items-center gap-0 flex-1 justify-around">
          {rightItems.map(item => <NavBtn key={item.id} {...item} />)}
        </div>

      </div>
    </nav>
  );
};
