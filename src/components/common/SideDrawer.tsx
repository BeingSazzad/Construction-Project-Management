import React from 'react';
import { User } from '../../types';
import { 
  X, Home, FolderKanban, DollarSign, Sparkles, 
  Users, FileText, Award, Briefcase, ChevronRight, 
  LogOut, Settings, MessageSquare
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenCreateProject: () => void;
  onOpenCreateBudget: () => void;
  onOpenDealAnalyzer: () => void;
  onSignOut: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateTab,
  onSignOut
}) => {
  if (!isOpen) return null;

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex font-sans animate-fade-in overflow-hidden">
      {/* Backdrop inside device */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel inside mobile viewport */}
      <div className="relative w-[290px] max-w-[85%] bg-[#070D1A] border-r border-[#142036] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-slate-100 animate-slide-right">
        
        {/* Drawer Header with Clean User Profile */}
        <div className="p-4 bg-[#0A1020] border-b border-[#142036] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-blue-500/40 shadow-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate leading-tight">
                {currentUser.name}
              </h3>
              <p className="text-[11px] text-blue-400 font-semibold truncate mt-0.5">
                {currentUser.roleTitle || 'Company Principal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Menu Groups */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3.5 text-xs">
          
          {/* SECTION 1: OVERVIEW & PORTFOLIO */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5">
              Portfolio
            </span>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('home'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <Home className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('projects'))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Projects</span>
              </div>
              <span className="text-[10px] bg-[#050811] px-2 py-0.5 rounded-full border border-[#142036] text-slate-400 font-bold">
                4
              </span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('opportunities'))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Opportunities</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                $3.7M
              </span>
            </button>
          </div>

          {/* SECTION 2: FINANCIALS */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5">
              Financials
            </span>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('budgets'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Budgets</span>
            </button>
          </div>

          {/* SECTION 3: OPERATIONS & INTELLIGENCE */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5">
              Operations
            </span>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('messages'))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Messages</span>
              </div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                2 new
              </span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('team'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Team</span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('reports'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('latti'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Latti AI</span>
            </button>
          </div>

          {/* SECTION 4: ACCOUNT */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5">
              Account
            </span>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('more'))}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Builder Score</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">40/100</span>
            </button>

            <button
              onClick={() => handleItemClick(() => onNavigateTab('more'))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0E1A33] text-slate-300 hover:text-white font-semibold transition-colors text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Settings</span>
            </button>
          </div>

        </div>

        {/* Drawer Footer with Sign Out */}
        <div className="p-3 border-t border-[#142036] bg-[#050811]">
          <button
            onClick={() => handleItemClick(onSignOut)}
            className="w-full h-9 rounded-xl bg-[#1A0C10] border border-[#3E161C] hover:bg-[#2A1016] text-[#F87171] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
