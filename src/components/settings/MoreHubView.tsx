import React from 'react';
import { User } from '../../types';
import { 
  Building2, Users, Bell, Shield, HelpCircle, LogOut, ChevronRight, Phone, Mail, MapPin 
} from 'lucide-react';

interface MoreHubViewProps {
  currentUser: User;
  onSignOut: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  currentUser,
  onSignOut,
  onNavigateTab,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ── 1. Company Profile Card ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#DDE1E7] shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#171A1F] truncate">
              {currentUser?.company || 'Avery & Marsh Construction'}
            </h2>
            <p className="text-xs text-[#68707C] font-medium">General Contractor · Commercial & Custom Residential</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-2 border-t border-[#EAEDF1] text-xs text-[#68707C]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
            <span>1200 Bayshore Blvd, Suite 400, Tampa, FL 33606</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
            <span>(813) 555-0190</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
            <span>operations@averymarsh.com</span>
          </div>
        </div>
      </div>

      {/* ── 2. User Account Pill Card ── */}
      <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-[#1677FF]/30"
          />
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-[#171A1F] truncate">
              {currentUser?.name || 'Avery Scott'}
            </h3>
            <p className="text-[11px] text-[#68707C] font-medium truncate">
              {currentUser?.roleTitle || 'Managing Principal & Founder'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-1 rounded-full uppercase">
          {currentUser?.role || 'Admin'}
        </span>
      </div>

      {/* ── 3. Directory & Contact Controls ── */}
      <div className="p-3 rounded-3xl bg-white border border-[#DDE1E7] shadow-sm flex flex-col divide-y divide-[#EAEDF1]">
        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('team');
          }}
          className="p-2.5 flex items-center justify-between hover:bg-[#F2F2F7] rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                Company & Trade Contacts
              </h4>
              <p className="text-[11px] text-[#68707C]">Subcontractors, project managers, inspectors</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('notifications');
          }}
          className="p-2.5 flex items-center justify-between hover:bg-[#F2F2F7] rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                Notification Preferences
              </h4>
              <p className="text-[11px] text-[#68707C]">Weather alerts, inspection reminders, cost warnings</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => alert("Security & Permissions settings")}
          className="p-2.5 flex items-center justify-between hover:bg-[#F2F2F7] rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                Security &amp; Permissions
              </h4>
              <p className="text-[11px] text-[#68707C]">Two-factor authentication, team role access</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => alert("Lattice Support: contact support@lattice.build")}
          className="p-2.5 flex items-center justify-between hover:bg-[#F2F2F7] rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                Help &amp; Support
              </h4>
              <p className="text-[11px] text-[#68707C]">User documentation and platform support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* ── 4. Sign Out ── */}
      <button
        onClick={onSignOut}
        className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-rose-50 border border-[#DDE1E7] hover:border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of Lattice</span>
      </button>

      {/* App Version Info */}
      <div className="text-center text-[10px] text-[#68707C] font-medium pt-2">
        Lattice Construction Platform · Release 1.0 (Core)
      </div>

    </div>
  );
};
