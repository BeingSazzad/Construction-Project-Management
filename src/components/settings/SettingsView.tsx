import React, { useState } from 'react';
import { User } from '../../types';
import { 
  UserCheck, Lock, CreditCard, ChevronRight, 
  HelpCircle, LogOut, Edit3, Sparkles, 
  FileText, Bell, Smartphone, ShieldCheck, Mail, Phone,
  Check, X, Crown, Settings, Building, Info, LifeBuoy,
  Users, Briefcase, Award, TrendingUp, DollarSign
} from 'lucide-react';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { AiDisclaimer } from '../legal/AiDisclaimer';
import { SubscriptionTerms } from '../legal/SubscriptionTerms';
import { BetaAgreement } from '../legal/BetaAgreement';
import { HelpSupport } from './HelpSupport';
import { EditProfileView } from './EditProfileView';
import { SecurityPasswordView } from './SecurityPasswordView';

export interface SettingsViewProps {
  currentUser: User;
  onSignOut: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onSignOut,
  onNavigateTab
}) => {
  const [userData, setUserData] = useState<User>(currentUser);
  const [subView, setSubView] = useState<'main' | 'terms' | 'privacy' | 'support' | 'profile' | 'security' | 'ai-disclaimer' | 'subscription-terms' | 'beta'>('main');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Clean Toggles
  const [pushEnabled, setPushEnabled] = useState(true);

  const isCompanyOwner = currentUser.role === 'admin';

  if (subView === 'security') {
    return <SecurityPasswordView onBack={() => setSubView('main')} />;
  }

  if (subView === 'profile') {
    return (
      <EditProfileView
        currentUser={userData}
        onBack={() => setSubView('main')}
        onSave={(updated) => {
          setUserData(prev => ({ ...prev, ...updated }));
        }}
      />
    );
  }

  if (subView === 'terms') {
    return <TermsAndConditions onBack={() => setSubView('main')} />;
  }

  if (subView === 'privacy') {
    return <PrivacyPolicy onBack={() => setSubView('main')} />;
  }

  if (subView === 'support') {
    return <HelpSupport onBack={() => setSubView('main')} />;
  }

  if (subView === 'ai-disclaimer') {
    return <AiDisclaimer onBack={() => setSubView('main')} />;
  }

  if (subView === 'subscription-terms') {
    return <SubscriptionTerms onBack={() => setSubView('main')} />;
  }

  if (subView === 'beta') {
    return <BetaAgreement onBack={() => setSubView('main')} />;
  }

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Hero Profile Header Card (Preserved Strong Baseline Design) */}
      <div 
        onClick={() => setSubView('profile')}
        className="p-4 bg-gradient-to-b from-[#111A2E] via-[#0E1526] to-[#0A0E1A] border border-[#1C2A44] hover:border-blue-500/40 transition-all rounded-3xl shadow-md flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] relative overflow-hidden"
      >
        {/* Subtle Ambient Header Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="relative flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/30 group-hover:border-blue-500/70 transition-colors shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0A0E1A]"></span>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white truncate group-hover:text-[#3875F6] transition-colors leading-tight">
              {userData.name}
            </h2>
            <p className="text-xs text-slate-400 truncate mt-1 font-medium">
              {userData.email}
            </p>
            <p className="text-xs text-blue-400 font-semibold truncate mt-0.5">
              {userData.company || 'Avery & Marsh Construction Group'}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-[#141F33] border border-[#1E2C48] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0 z-10 shadow-sm">
          <Edit3 className="w-4 h-4" />
        </div>
      </div>

      {/* 2. GROUP 1: ACCOUNT & SUBSCRIPTION */}
      <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Account</p>
      <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
        {/* Subscription & Billing */}
        <button
          onClick={() => isCompanyOwner && setShowSubscriptionModal(true)}
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Subscription & Plan</span>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                {isCompanyOwner ? 'Enterprise Pro Tier • $199.00/mo' : 'Team Member Seat (Alex Chen)'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        </button>

        {/* Security & Password */}
        <button
          onClick={() => setSubView('security')}
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Security & Authentication</span>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                Password, Biometric PIN & 2FA
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        </button>

        {/* Team Seat Management */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Team Seats & Access</span>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                4 Active Seats of 10 Allocated
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        </button>
      </div>
      </div>

      {/* 3. GROUP 2: APP PREFERENCES */}
      <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Preferences</p>
      <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
        {/* Push Notifications Toggle */}
        <div className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Bell className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Push Notifications</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Critical delays & inspection alerts</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
              pushEnabled ? 'bg-[#2563EB]' : 'bg-[#1E2C48]'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                pushEnabled ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
      </div>

      {/* 4. GROUP 3: SUPPORT */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Support</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setSubView('support')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">Help Center</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">FAQs, guides & live chat</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* 5. GROUP 4: LEGAL */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Legal</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">
          <button
            onClick={() => setSubView('privacy')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">Privacy Policy</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">How we handle your data</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          <button
            onClick={() => setSubView('terms')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">Terms of Service</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Platform usage agreement</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          <button
            onClick={() => setSubView('ai-disclaimer')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">AI Disclaimer</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">AI output limitations & responsibility</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          <button
            onClick={() => setSubView('subscription-terms')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">Subscription Terms</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Billing, trials & credits</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          <button
            onClick={() => setSubView('beta')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block">Beta Agreement</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Closed beta participation terms</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* 5. Sign Out Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full h-11 rounded-2xl bg-[#1A0C10] border border-[#3E161C] hover:bg-[#2A1016] text-[#F87171] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from Account</span>
      </button>

      {/* INVITE TEAM MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-sm font-bold text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  placeholder="engineer@company.com"
                  className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Assigned Role</label>
                <select className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500">
                  <option>Project Manager (PM)</option>
                  <option>Finance Controller</option>
                  <option>Field Superintendent</option>
                </select>
              </div>
              <button
                onClick={() => {
                  alert('Invitation sent successfully!');
                  setShowInviteModal(false);
                }}
                className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold text-xs mt-1"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION MODAL */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[400px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#142036]">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Enterprise Subscription</h3>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#050811] rounded-xl border border-[#142036] text-xs">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">Current Plan</span>
              <h4 className="text-sm font-extrabold text-white mt-0.5">Enterprise Pro Tier</h4>
              <p className="text-slate-400 mt-1">$199.00 / month • Unlimited Projects & CSI Cost Ledgers</p>
            </div>

            <button
              onClick={() => {
                alert('Plan is active. Next billing date: July 1, 2025.');
                setShowSubscriptionModal(false);
              }}
              className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold text-xs"
            >
              Manage Billing Details
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[360px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to end your active session?</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-10 rounded-xl border border-[#1E2C48] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={onSignOut}
                className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
