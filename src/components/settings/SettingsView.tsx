import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Building, Lock, CreditCard, ChevronRight, 
  HelpCircle, LogOut, Edit3, Download, Sparkles, 
  FileText, Bell, Smartphone, ShieldCheck, Mail, Phone,
  Check, X, KeyRound
} from 'lucide-react';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { HelpSupport } from './HelpSupport';
import { EditProfileView } from './EditProfileView';

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
  const [subView, setSubView] = useState<'main' | 'terms' | 'privacy' | 'support' | 'profile'>('main');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState(false);

  // Clean Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);

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

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setPasswordToast(true);
    setTimeout(() => {
      setPasswordToast(false);
      setShowPasswordModal(false);
      setNewPassword('');
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Profile Card (Clickable to open in-page Profile View) */}
      <div 
        onClick={() => setSubView('profile')}
        className="p-4 bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all rounded-3xl shadow-sm flex items-center justify-between gap-3 cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0D1424]"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">{userData.name}</h2>
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {userData.roleTitle.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{userData.roleTitle}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{userData.company}</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSubView('profile');
          }}
          className="h-10 px-3.5 rounded-xl bg-[#141F33] hover:bg-[#1C2C47] text-slate-200 hover:text-white border border-[#1E2C48] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* 2. Quick Modules (Deals, Budgets, Latti AI) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onNavigateTab && onNavigateTab('opportunities')}
          className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Building className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Deals CRM</span>
          <span className="text-xs text-slate-500 mt-0.5">Pipeline</span>
        </button>

        <button
          onClick={() => onNavigateTab && onNavigateTab('budgets')}
          className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Budgets Hub</span>
          <span className="text-xs text-slate-500 mt-0.5">CSI Scopes</span>
        </button>

        <button
          onClick={() => onNavigateTab && onNavigateTab('latti')}
          className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-purple-500/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Latti AI</span>
          <span className="text-xs text-slate-500 mt-0.5">Assistant</span>
        </button>
      </div>

      {/* 3. Subscription Card */}
      <div className="p-4 bg-[#0D1424] border border-[#1A263E] rounded-3xl shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Subscription</div>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5">Lattice Pro · $199/mo</div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Change Plan
          </button>
          <button
            onClick={() => alert("Purchases restored successfully.")}
            className="h-11 px-4 rounded-xl bg-[#141F33] hover:bg-[#1C2C47] border border-[#1E2C48] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Restore
          </button>
        </div>
      </div>

      {/* 4. Group: Account & Security */}
      <div className="bg-[#0D1424] border border-[#1A263E] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <div className="p-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide bg-[#0B101D]">
          Account & Security
        </div>

        <button 
          onClick={() => setShowPasswordModal(true)}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <div className="w-full h-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Push Notifications</span>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              pushEnabled ? 'bg-[#2563EB] justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="w-full h-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Offline Blueprint Storage</span>
          </div>
          <button
            onClick={() => setOfflineCache(!offlineCache)}
            className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              offlineCache ? 'bg-[#2563EB] justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* 5. Group: Legal, Policies & T&C */}
      <div className="bg-[#0D1424] border border-[#1A263E] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <div className="p-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide bg-[#0B101D]">
          Legal & Compliance
        </div>

        <button
          onClick={() => setSubView('terms')}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Terms & Conditions (T&C)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('privacy')}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Privacy Policy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => alert("Company project data export requested. Check your email for download link.")}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Download className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Export Account Data (CSV / JSON)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 6. Group: Support, FAQ & Contact */}
      <div className="bg-[#0D1424] border border-[#1A263E] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#141F33]">
        <div className="p-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide bg-[#0B101D]">
          Help & Support
        </div>

        <button
          onClick={() => setSubView('support')}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">FAQ & Knowledge Base</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('support')}
          className="w-full h-12 px-4 flex items-center justify-between hover:bg-[#10192B] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Contact Us (24/7 Support)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 7. Sign Out Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full h-12 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold border border-rose-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSavePassword} className="w-full max-w-sm bg-[#0C121E] border border-[#1A263E] rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#162033] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Change Password</h3>
              </div>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {passwordToast && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 8 characters"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 h-11 rounded-xl bg-[#141F33] text-slate-300 text-xs font-semibold hover:bg-[#1A2842]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-[#0C121E] border border-[#1A263E] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to sign out of your workspace?</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-11 rounded-xl bg-[#141F33] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onSignOut();
                }}
                className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
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
          <div className="w-full max-w-sm bg-[#0C121E] border border-[#1A263E] rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
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
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    plan.popular ? 'bg-[#0E1729] border-blue-500/50' : 'bg-[#080D18] border-[#162033] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{plan.name}</span>
                    <span className="text-sm font-black text-blue-400">{plan.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
