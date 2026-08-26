import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  Smartphone, Monitor, RotateCcw, ShieldCheck, 
  Briefcase, DollarSign, HardHat, Compass, LogIn, UserPlus 
} from 'lucide-react';

interface DeviceFrameProps {
  currentRole: UserRole;
  currentView: 'auth' | 'onboarding' | 'workspace';
  onRoleChange: (role: UserRole) => void;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'forgot') => void;
  onRestartOnboarding: () => void;
  onResetData: () => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  currentRole,
  currentView,
  onRoleChange,
  onOpenAuth,
  onRestartOnboarding,
  onResetData,
  children
}) => {
  const [frameMode, setFrameMode] = useState<'mobile' | 'fluid'>('mobile');

  const roleConfig = [
    { id: 'pm', label: 'PM (Sarah)', icon: Briefcase },
    { id: 'admin', label: 'Owner (Alex)', icon: ShieldCheck },
    { id: 'finance', label: 'Finance (Michael)', icon: DollarSign },
    { id: 'field', label: 'Field (John)', icon: HardHat },
  ];

  return (
    <div className="min-h-screen bg-[#04070D] text-slate-100 flex flex-col items-center justify-start p-0 md:py-6 md:px-4 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sleek Top Control & Demo Bar */}
      <header className="w-full max-w-[430px] md:max-w-4xl mb-0 md:mb-3 bg-[#0B101D] border-b md:border border-[#172238] md:rounded-2xl p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span className="text-xs font-black tracking-wider text-white uppercase">LATTICE</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">| Construction Suite</span>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="flex items-center bg-[#070A11] p-1 rounded-xl border border-[#172238] gap-1 overflow-x-auto">
          {roleConfig.map((r) => {
            const Icon = r.icon;
            const isActive = currentView === 'workspace' && currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id as UserRole)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#0066FF] text-white font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131C2E]'
                }`}
                title={`Switch view to ${r.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auth / Tour / Viewport controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenAuth('signin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'auth' 
                ? 'bg-blue-600 text-white border-blue-500 font-bold' 
                : 'bg-[#131C2E] border-[#23334F] text-slate-300 hover:text-white'
            }`}
            title="Sign In / Auth Screen"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auth</span>
          </button>

          <button
            onClick={onRestartOnboarding}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'onboarding' 
                ? 'bg-blue-600 text-white border-blue-500 font-bold' 
                : 'bg-[#131C2E] border-[#23334F] text-slate-300 hover:text-cyan-300'
            }`}
            title="Onboarding Flow"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          <button
            onClick={() => setFrameMode(frameMode === 'mobile' ? 'fluid' : 'mobile')}
            className="p-1.5 rounded-lg text-xs bg-[#131C2E] border border-[#23334F] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            title={frameMode === 'mobile' ? 'Switch to Full Width' : 'Switch to 430px Mobile View'}
          >
            {frameMode === 'mobile' ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onResetData}
            className="p-1.5 rounded-lg text-xs bg-[#131C2E] border border-[#23334F] text-slate-400 hover:text-red-400 cursor-pointer"
            title="Reset Mock Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Canvas Viewport (Clean 430px or Fluid) */}
      <main className="w-full flex justify-center items-stretch flex-1">
        {frameMode === 'mobile' ? (
          <div className="w-full max-w-[430px] min-h-[880px] bg-[#060913] border-x md:border border-[#141F33] md:rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden bg-[#060913] relative">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl min-h-[880px] bg-[#060913] border border-[#141F33] md:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
