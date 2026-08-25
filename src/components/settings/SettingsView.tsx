import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Building, Shield, Lock, CreditCard, ChevronRight, 
  HelpCircle, LogOut, Edit3, Download, Sparkles, 
  Check, ArrowRight, ShieldCheck, FileText, Bell, Smartphone
} from 'lucide-react';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { HelpSupport } from './HelpSupport';
import { EditProfileModal } from './EditProfileModal';

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
  const [subView, setSubView] = useState<'main' | 'terms' | 'privacy' | 'support'>('main');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Clean Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [autoSyncPhotos, setAutoSyncPhotos] = useState(true);

  if (subView === 'terms') {
    return <TermsAndConditions onBack={() => setSubView('main')} />;
  }

  if (subView === 'privacy') {
    return <PrivacyPolicy onBack={() => setSubView('main')} />;
  }

  if (subView === 'support') {
    return <HelpSupport onBack={() => setSubView('main')} />;
  }

  const handleUpdateProfile = (updated: Partial<User>) => {
    setUserData(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Profile Card */}
      <div className="p-4 bg-[#0B1120] border border-[#162238] rounded-3xl shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-12 h-12 rounded-2xl object-cover border border-blue-500/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B1120]"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate">{userData.name}</h2>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {userData.roleTitle.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{userData.roleTitle}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{userData.company}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#121B2D] hover:bg-[#18253D] text-slate-300 hover:text-white border border-[#1C2C47] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* 2. Quick Modules (Deals, Budgets, Latti AI) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onNavigateTab && onNavigateTab('opportunities')}
          className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-[#0066FF] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Building className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Deals CRM</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Pipeline</span>
        </button>

        <button
          onClick={() => onNavigateTab && onNavigateTab('budgets')}
          className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Budgets Hub</span>
          <span className="text-[10px] text-slate-500 mt-0.5">CSI Scopes</span>
        </button>

        <button
          onClick={() => onNavigateTab && onNavigateTab('latti')}
          className="p-3 rounded-2xl bg-[#0B1120] border border-[#162238] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Latti AI</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Assistant</span>
        </button>
      </div>

      {/* 3. Subscription Card (Clean & Compact) */}
      <div className="p-4 bg-[#0B1120] border border-[#162238] rounded-3xl shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subscription</div>
            <div className="text-sm font-black text-white mt-0.5">Lattice Pro · $199/mo</div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Change Plan
          </button>
          <button
            onClick={() => alert("Purchases restored successfully.")}
            className="py-2 px-3 rounded-xl bg-[#121B2D] hover:bg-[#18253D] border border-[#1C2C47] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Restore
          </button>
        </div>
      </div>

      {/* 4. Settings Group: Account & Security */}
      <div className="bg-[#0B1120] border border-[#162238] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <div className="p-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
          Account & Security
        </div>

        <button 
          onClick={() => alert("Password change link sent to email")}
          className="w-full p-3.5 px-4 flex items-center justify-between hover:bg-[#0E1729] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Password & Security</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <div className="w-full p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Two-Factor Authentication</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Enabled
          </span>
        </div>
      </div>

      {/* 5. Settings Group: Preferences */}
      <div className="bg-[#0B1120] border border-[#162238] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <div className="p-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
          Preferences
        </div>

        <div className="p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Push Notifications</span>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              pushEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Offline Blueprint Storage</span>
          </div>
          <button
            onClick={() => setOfflineCache(!offlineCache)}
            className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              offlineCache ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* 6. Settings Group: Support & Legal */}
      <div className="bg-[#0B1120] border border-[#162238] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <button
          onClick={() => alert("Company project data export requested. Check your email for download link.")}
          className="w-full p-3.5 px-4 flex items-center justify-between hover:bg-[#0E1729] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Export Project Archive (CSV / JSON)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('privacy')}
          className="w-full p-3.5 px-4 flex items-center justify-between hover:bg-[#0E1729] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Privacy Policy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('support')}
          className="w-full p-3.5 px-4 flex items-center justify-between hover:bg-[#0E1729] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 7. Sign Out Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        currentUser={userData}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleUpdateProfile}
      />

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-[#0C121E] border border-[#1A263B] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to sign out of your workspace?</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-[#141F33] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onSignOut();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION TIER MODAL */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0C121E] border border-[#1A263B] rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#162033] pb-2.5">
              <h3 className="text-sm font-bold text-white">Choose Your Plan</h3>
              <button onClick={() => setShowSubscriptionModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Base', price: '$49.99/mo', desc: 'For solo contractors & small teams' },
                { name: 'Pro', price: '$199.00/mo', desc: 'Unlimited projects, Gantt & multi-role dashboards', popular: true },
                { name: 'Intelligence', price: '$349.00/mo', desc: 'BuildScope AI takeoff & Deal Analyzer' }
              ].map(plan => (
                <div 
                  key={plan.name}
                  onClick={() => setShowSubscriptionModal(false)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    plan.popular ? 'bg-[#0E1729] border-blue-500/50' : 'bg-[#080D18] border-[#162033] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{plan.name}</span>
                    <span className="text-xs font-black text-blue-400">{plan.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
