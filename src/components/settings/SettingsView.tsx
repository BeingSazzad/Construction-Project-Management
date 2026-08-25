import React, { useState } from 'react';
import { User } from '../../types';
import { 
  User as UserIcon, Mail, Phone, Building, ShieldCheck, 
  Bell, Moon, Globe, FileText, Lock, HelpCircle, LogOut, 
  ChevronRight, Award, MapPin, CheckCircle2, ChevronLeft, 
  Edit3, Shield, KeyRound, Smartphone, Check, Sparkles, 
  CreditCard, Download, Trash2, RotateCw 
} from 'lucide-react';
import { Button } from '../common/Button';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { HelpSupport } from './HelpSupport';
import { EditProfileModal } from './EditProfileModal';

export interface SettingsViewProps {
  currentUser: User;
  onSignOut: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onSignOut
}) => {
  const [userData, setUserData] = useState<User>(currentUser);
  const [subView, setSubView] = useState<'main' | 'terms' | 'privacy' | 'support'>('main');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'base' | 'pro' | 'intelligence' | 'business'>('pro');

  // Field Preferences
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [autoSyncPhotos, setAutoSyncPhotos] = useState(true);
  const [passChangedToast, setPassChangedToast] = useState(false);

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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. User Profile Header Card */}
      <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B] rounded-2xl shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 ring-2 ring-[#070A12]"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0D1422]"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-white truncate">{userData.name}</h2>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {userData.roleTitle.split(' ')[0]}
              </span>
            </div>

            <p className="text-xs text-slate-300 truncate mt-0.5 font-medium">{userData.roleTitle}</p>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <Building className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span>{userData.company}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="p-2.5 rounded-xl bg-[#151F33] hover:bg-blue-600 text-blue-400 hover:text-white border border-[#223352] transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1.5"
          title="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* 2. Subscription & Pricing Tier (RFP Section 12) */}
      <div className="card-dark p-4 bg-[#0D1422] border border-blue-500/30 rounded-2xl shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Subscription & Entitlements
            </span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Lattice Pro ($199/mo)
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Your company is enrolled in <strong>Lattice Pro</strong> with unlimited projects, full Gantt scheduling, multi-role dashboards, and 50GB plan storage.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center cursor-pointer shadow"
          >
            Upgrade Plan / View Tiers
          </button>
          <button
            onClick={() => alert("Restoring Apple in-app purchases and syncing active web entitlements...")}
            className="px-3 py-2 rounded-xl bg-[#141F33] hover:bg-[#1C2C47] text-slate-300 text-xs font-semibold border border-[#223352] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Restore Purchases</span>
          </button>
        </div>
      </div>

      {/* 3. Security & Authentication */}
      <div className="card-dark p-3.5 bg-[#0D1422] border-[#1A263B] rounded-2xl space-y-2 text-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
          Security & Tenant Isolation
        </span>

        <button
          onClick={() => setShowSecurityModal(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#080D17] border border-[#162033] hover:border-blue-500/40 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-bold text-white">Change Password & Passkey</div>
              <div className="text-[10px] text-slate-400">Enterprise auth with bcrypt / SHA-256</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080D17] border border-[#162033]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Active (Biometric Face ID / SMS)</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Active
          </span>
        </div>
      </div>

      {/* 4. Jobsite & Offline Preferences */}
      <div className="card-dark p-3.5 bg-[#0D1422] border-[#1A263B] rounded-2xl space-y-3 text-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
          Jobsite & Offline Preferences
        </span>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Field Push Notifications</div>
            <div className="text-[10px] text-slate-400">Critical inspection & safety alerts</div>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              pushEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#162033]">
          <div>
            <div className="font-bold text-white">Offline Blueprint Caching</div>
            <div className="text-[10px] text-slate-400">Cache CAD/drawings for offline use</div>
          </div>
          <button
            onClick={() => setOfflineCache(!offlineCache)}
            className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              offlineCache ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#162033]">
          <div>
            <div className="font-bold text-white">Auto-Sync Jobsite Photos</div>
            <div className="text-[10px] text-slate-400">Upload site photos when Wi-Fi connects</div>
          </div>
          <button
            onClick={() => setAutoSyncPhotos(!autoSyncPhotos)}
            className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
              autoSyncPhotos ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* 5. Apple Privacy & Data Portability (RFP Section 06 & 10) */}
      <div className="card-dark p-3.5 bg-[#0D1422] border-[#1A263B] rounded-2xl space-y-1 text-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
          Data Governance & Apple Privacy
        </span>

        <button
          onClick={() => alert("Your request to export company project data (JSON/CSV bundle) has been queued. You will receive a secure download link via email.")}
          className="w-full flex items-center justify-between py-2 px-2 hover:bg-[#131D2E] rounded-xl transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-blue-400" />
            <div>
              <span className="font-semibold text-white block">Request Data Export (CSV / JSON)</span>
              <span className="text-[10px] text-slate-400">Download complete company project & budget archive</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('privacy')}
          className="w-full flex items-center justify-between py-2 px-2 hover:bg-[#131D2E] rounded-xl transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-white">Privacy Policy & Telemetry</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setSubView('support')}
          className="w-full flex items-center justify-between py-2 px-2 hover:bg-[#131D2E] rounded-xl transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">Help & Jobsite Support (24/7)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 6. Sign Out Action Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-12 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Workspace</span>
        </button>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        currentUser={userData}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleUpdateProfile}
      />

      {/* SUBSCRIPTION & PRICING MODAL (RFP Section 12) */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card-dark w-full max-w-md bg-[#0C121E] border border-blue-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#182438] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-extrabold text-white">Lattice Subscription Plans</h3>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { id: 'base', name: 'Lattice Base', price: '$49.99', period: '/month', desc: 'Essential task, punch list & site photo management for small remodeling teams.' },
                { id: 'pro', name: 'Lattice Pro', price: '$199', period: '/month', desc: 'Full Gantt schedule, cost variance, 4 role dashboards, and subcontractor portal.' },
                { id: 'intelligence', name: 'Lattice Intelligence', price: '$349', period: '/month', desc: 'AI plan takeoff, Latti cost learning, live weather risk prediction & unlimited seats.' },
                { id: 'business', name: 'Lattice Business', price: 'Custom', period: '', desc: 'Dedicated enterprise instance, ERP/QuickBooks sync & custom SLA support.' },
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setCurrentPlan(tier.id as any)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    currentPlan === tier.id
                      ? 'bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-[#080D18] border-[#182438] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{tier.name}</span>
                      {currentPlan === tier.id && (
                        <span className="text-[10px] bg-blue-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black text-blue-400">
                      {tier.price}<span className="text-[10px] text-slate-400 font-normal">{tier.period}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#182438]">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
              >
                Confirm Plan Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY / CHANGE PASSWORD MODAL */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card-dark w-full max-w-sm bg-[#0C121E] border-[#182438] rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#182438] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Update Password</h3>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {passChangedToast ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full bg-[#080D17] border border-[#182438] rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-[#080D17] border border-[#182438] rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-[#080D17] border border-[#182438] rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setShowSecurityModal(false)}
                    className="flex-1 h-11 rounded-xl bg-[#182438] text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPassChangedToast(true);
                      setTimeout(() => {
                        setPassChangedToast(false);
                        setShowSecurityModal(false);
                      }, 1000);
                    }}
                    className="flex-1 h-11 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card-dark w-full max-w-sm bg-[#0C121E] border-rose-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">Sign Out of Lattice?</h3>
              <p className="text-xs text-slate-400 mt-1">
                You will need to sign in again to access your construction projects and synced blueprints.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 rounded-xl bg-[#182438] hover:bg-[#20304a] text-slate-300 font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onSignOut();
                }}
                className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm cursor-pointer transition-colors shadow-lg shadow-rose-900/30"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
