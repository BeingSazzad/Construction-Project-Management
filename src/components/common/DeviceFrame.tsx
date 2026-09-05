import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  RotateCcw, Compass, LogIn, Wifi, Battery, Signal 
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
  currentView,
  onOpenAuth,
  onRestartOnboarding,
  onResetData,
  children
}) => {
  const [frameMode, setFrameMode] = useState<'mobile' | 'fluid'>('mobile');

  return (
    <div className="min-h-screen bg-[#E5E5EA] text-[#171A1F] flex flex-col items-center justify-start p-0 md:py-8 md:px-4 font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Sleek Top Control & Demo Bar */}
      <header className="w-full max-w-[430px] md:max-w-xl mb-0 md:mb-4 bg-white border-b md:border border-[#DDE1E7] md:rounded-2xl p-2 px-4 flex items-center justify-between gap-2 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1677FF]" />
          <span className="text-xs font-black tracking-wider text-[#171A1F] uppercase">LATTICE</span>
          <span className="hidden sm:inline text-[11px] text-[#68707C] font-semibold">· Construction Platform</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenAuth('signin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
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
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
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
            className="p-1.5 rounded-lg text-xs bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer"
            title="Reset Sample Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFrameMode(frameMode === 'mobile' ? 'fluid' : 'mobile')}
            className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] cursor-pointer"
          >
            {frameMode === 'mobile' ? 'Expand' : 'Mobile'}
          </button>
        </div>
      </header>

      {/* Main Container - Apple iPhone Bezel Frame */}
      <main className={`w-full flex-1 flex flex-col items-center justify-start transition-all duration-300 ${
        frameMode === 'mobile' ? 'max-w-[430px]' : 'max-w-4xl'
      }`}>
        <div className={`w-full flex-1 flex flex-col bg-[#F2F2F7] overflow-x-hidden min-h-[880px] relative transition-all ${
          frameMode === 'mobile' 
            ? 'md:rounded-[44px] md:border-[10px] md:border-[#FFFFFF] md:shadow-[0_20px_50px_rgba(0,0,0,0.12)]' 
            : 'rounded-2xl border border-[#DDE1E7] shadow-md'
        }`}>
          {/* iOS Top Notch / Status Bar matching Figma */}
          {frameMode === 'mobile' && (
            <div className="w-full bg-white px-7 pt-3 pb-1 flex items-center justify-between select-none z-50 text-[#171A1F] text-xs font-semibold">
              <span className="font-bold tracking-tight text-[13px]">9:41</span>
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
