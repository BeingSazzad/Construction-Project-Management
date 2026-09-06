import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { 
  RotateCcw, Compass, LogIn, Wifi, Battery, Signal, ChevronDown, Check, UserCheck 
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

const ROLES_LIST: { role: UserRole; label: string; icon: string; name: string; title: string }[] = [
  { role: 'admin', label: 'Owner', icon: '👑', name: 'Avery Scott', title: 'Managing Principal' },
  { role: 'pm', label: 'Senior PM', icon: '📋', name: 'Sarah Johnson', title: 'Senior Project Manager' },
  { role: 'finance', label: 'Finance Dir', icon: '💰', name: 'Michael Chang', title: 'Director of Finance' },
  { role: 'field', label: 'Lead Super', icon: '🦺', name: 'John Smith', title: 'Field Superintendent' },
];

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
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const activeRoleObj = ROLES_LIST.find(r => r.role === currentRole) || ROLES_LIST[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#E5E5EA] text-[#171A1F] flex flex-col items-center justify-start p-0 md:py-8 md:px-4 font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Sleek Top Control & Demo Bar */}
      <header className="w-full max-w-[430px] md:max-w-xl mb-0 md:mb-4 bg-white border-b md:border border-[#DDE1E7] md:rounded-2xl p-2 px-3.5 flex items-center justify-between gap-2 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1677FF]" />
          <span className="text-xs font-black tracking-wider text-[#171A1F] uppercase">LATTICE</span>
          <span className="hidden sm:inline text-[11px] text-[#68707C] font-semibold">· Build Platform</span>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Interactive Role Switcher */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="h-7 px-2.5 rounded-lg text-xs font-bold bg-[#EAF3FF] hover:bg-[#dbeafe] border border-[#1677FF]/30 text-[#1677FF] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              title="Switch Active Role"
            >
              <span>{activeRoleObj.icon}</span>
              <span className="hidden sm:inline">{activeRoleObj.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#DDE1E7] rounded-2xl p-1.5 shadow-xl z-50 flex flex-col gap-0.5 animate-fade-in text-[#171A1F]">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
                  Switch Active Role
                </div>
                {ROLES_LIST.map((r) => {
                  const isSelected = r.role === currentRole;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        onRoleChange(r.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#EAF3FF] text-[#1677FF] font-bold'
                          : 'text-[#4B5565] hover:bg-[#F2F2F7] hover:text-[#171A1F]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm">{r.icon}</span>
                        <div className="min-w-0">
                          <p className="truncate leading-tight">{r.name}</p>
                          <p className="text-[10px] text-[#68707C] font-normal truncate">{r.title}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenAuth('signin')}
            className={`h-7 px-2 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'auth' 
                ? 'bg-[#1677FF] text-white border-[#1677FF]' 
                : 'bg-[#F2F2F7] border-[#DDE1E7] text-[#171A1F] hover:bg-[#EAEDF1]'
            }`}
            title="Sign In / Auth"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auth</span>
          </button>

          <button
            onClick={onRestartOnboarding}
            className={`h-7 px-2 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'onboarding' 
                ? 'bg-[#1677FF] text-white border-[#1677FF]' 
                : 'bg-[#F2F2F7] border-[#DDE1E7] text-[#171A1F] hover:bg-[#EAEDF1]'
            }`}
            title="Tour"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          <button
            onClick={onResetData}
            className="w-7 h-7 rounded-lg bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer active:scale-95"
            title="Reset Sample Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFrameMode(frameMode === 'mobile' ? 'fluid' : 'mobile')}
            className="h-7 px-2 rounded-lg text-xs font-semibold bg-[#F2F2F7] border border-[#DDE1E7] text-[#171A1F] hover:bg-[#EAF3FF] hover:border-[#1677FF]/40 cursor-pointer transition-colors"
          >
            {frameMode === 'mobile' ? '🖥️' : '📱'}
          </button>
        </div>
      </header>

      {/* Main Container - Apple iPhone Bezel Frame or Responsive Desktop */}
      <main className={`w-full flex-1 flex flex-col items-center justify-start transition-all duration-300 ${
        frameMode === 'mobile' ? 'max-w-[430px]' : 'max-w-5xl w-full'
      }`}>
        <div className={`w-full flex-1 flex flex-col bg-[#F2F2F7] overflow-x-hidden min-h-[880px] relative transition-all ${
          frameMode === 'mobile' 
            ? 'md:rounded-[44px] md:border-[10px] md:border-[#FFFFFF] md:shadow-[0_20px_50px_rgba(0,0,0,0.12)]' 
            : 'rounded-2xl border border-[#DDE1E7] shadow-xl'
        }`}>
          {/* iOS Top Notch / Status Bar matching Figma */}
          {frameMode === 'mobile' && (
            <div className="w-full bg-white px-7 pt-3 pb-1 flex items-center justify-between select-none z-50 text-[#171A1F] text-xs font-semibold">
              <span className="font-bold tracking-tight text-sm">9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-[#171A1F] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-[#171A1F]">
                <Signal className="w-3.5 h-3.5 fill-current" />
                <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                <Battery className="w-4 h-4 fill-current" />
              </div>
            </div>
          )}

          {/* Screen Content Wrapper */}
          <div className="w-full flex-1 flex flex-col relative pb-20">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          {frameMode === 'mobile' && (
            <div className="fixed bottom-1 left-0 right-0 max-w-[430px] mx-auto flex justify-center pointer-events-none z-50">
              <div className="w-32 h-1 bg-[#171A1F]/30 rounded-full" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
