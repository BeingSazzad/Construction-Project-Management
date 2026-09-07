import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import {
  RotateCcw, Compass, LogIn, ChevronDown, Check,
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

const ROLES_LIST: { role: UserRole; label: string; name: string; title: string }[] = [
  { role: 'admin',   label: 'Owner',       name: 'Avery Scott',   title: 'Managing Principal' },
  { role: 'pm',      label: 'Senior PM',   name: 'Sarah Johnson', title: 'Senior Project Manager' },
  { role: 'finance', label: 'Finance Dir', name: 'Michael Chang', title: 'Director of Finance' },
  { role: 'field',   label: 'Lead Super',  name: 'John Smith',    title: 'Field Superintendent' },
];

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  currentRole,
  currentView,
  onRoleChange,
  onOpenAuth,
  onRestartOnboarding,
  onResetData,
  children,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const activeRoleObj = ROLES_LIST.find(r => r.role === currentRole) || ROLES_LIST[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target ||
        target.tagName === 'HTML' ||
        target.closest?.('[id*="figma"], [class*="figma"], [id*="html-to-design"], [class*="html-to-design"], [id*="h2d"], [class*="h2d"], [data-figma], [data-h2d], [data-extension], [id*="extension"], [class*="extension"]')
      ) {
        return;
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#171A1F] flex flex-col items-center font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Dev Control Bar — sticky top */}
      <header className="w-full max-w-[430px] bg-white border-b border-[#DDE1E7] px-4 py-2 flex items-center justify-between gap-2 z-[60] shadow-sm sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1677FF]" />
          <span className="text-[11px] font-black tracking-wider text-[#171A1F] uppercase">LATTICE</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Role Switcher */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="h-7 px-2.5 rounded-lg text-[11px] font-bold bg-[#EAF3FF] hover:bg-[#dbeafe] border border-[#1677FF]/30 text-[#1677FF] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{activeRoleObj.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#DDE1E7] rounded-2xl p-1.5 shadow-xl z-[70] flex flex-col gap-0.5 text-[#171A1F]">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
                  Switch Role
                </div>
                {ROLES_LIST.map((r) => {
                  const isSelected = r.role === currentRole;
                  return (
                    <button
                      key={r.role}
                      onClick={() => { onRoleChange(r.role); setIsRoleDropdownOpen(false); }}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#EAF3FF] text-[#1677FF]'
                          : 'text-[#4B5565] hover:bg-[#F2F2F7]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0F172A] leading-tight">{r.name}</p>
                        <p className="text-[10px] text-[#68707C] font-normal truncate">{r.title}</p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenAuth('signin')}
            className={`h-7 px-2 rounded-lg text-[11px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'auth'
                ? 'bg-[#1677FF] text-white border-[#1677FF]'
                : 'bg-[#F2F2F7] border-[#DDE1E7] text-[#171A1F] hover:bg-[#EAEDF1]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Auth</span>
          </button>

          <button
            onClick={onRestartOnboarding}
            className={`h-7 px-2 rounded-lg text-[11px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentView === 'onboarding'
                ? 'bg-[#1677FF] text-white border-[#1677FF]'
                : 'bg-[#F2F2F7] border-[#DDE1E7] text-[#171A1F] hover:bg-[#EAEDF1]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tour</span>
          </button>

          <button
            onClick={onResetData}
            className="w-7 h-7 rounded-lg bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* App Content — 430px, no phone frame, pb-20 for BottomNav clearance */}
      <main className="w-full max-w-[430px] flex-1 flex flex-col bg-[#F7F9FC] overflow-x-hidden relative">
        <div className="w-full flex-1 flex flex-col relative pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};