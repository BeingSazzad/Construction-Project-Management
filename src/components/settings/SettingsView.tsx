import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Lock, ChevronRight, HelpCircle, LogOut, Edit3, 
  FileText, Bell, ShieldCheck, Mail, Phone,
  Check, X, Crown, Building, Palette, Users, 
  ChevronLeft, Sparkles, DollarSign, ArrowRight
} from 'lucide-react';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { AiDisclaimer } from '../legal/AiDisclaimer';
import { SubscriptionTerms } from '../legal/SubscriptionTerms';
import { BetaAgreement } from '../legal/BetaAgreement';
import { HelpSupport } from './HelpSupport';
import { EditProfileView } from './EditProfileView';
import { CompanyProfileView } from './CompanyProfileView';
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
  const [subView, setSubView] = useState<'main' | 'billing' | 'notifications' | 'company' | 'terms' | 'privacy' | 'support' | 'profile' | 'security' | 'ai-disclaimer' | 'subscription-terms' | 'beta'>('main');
  const [pushMasterEnabled, setPushMasterEnabled] = useState(true);

  // 6 Notification Preferences
  const [notifPreferences, setNotifPreferences] = useState({
    taskAssignments: true,
    dailyLogReminders: true,
    budgetAlerts: true,
    messageNotifications: true,
    scheduleChanges: true,
    clientActivity: true,
  });

  const toggleNotif = (key: keyof typeof notifPreferences) => {
    setNotifPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  if (subView === 'company') {
    return (
      <CompanyProfileView
        currentUser={userData}
        onBack={() => setSubView('main')}
        onSave={(c) => {
          setUserData(prev => ({ ...prev, company: c.company, phone: c.phone }));
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

  // ─── SUBVIEW: BILLING & SUBSCRIPTION (Mobile-First) ───
  if (subView === 'billing') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-tight">Billing & Plans</h2>
          <div className="w-12" />
        </div>

        {/* Current Plan Card */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Plan</span>
            <h3 className="text-base font-black text-white mt-0.5">Trial</h3>
            <p className="text-[12px] text-slate-400 mt-0.5 font-medium">14-day free trial · No credit card required</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            Active
          </span>
        </div>

        {/* Pricing Tier 1: Professional ($19/mo) */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border-2 border-blue-500/50 shadow-md flex flex-col gap-3 relative">
          <span className="text-[10px] font-black tracking-wider text-blue-400 uppercase">Most Popular</span>
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-white">Professional</h4>
            <div className="text-right">
              <span className="text-lg font-black text-white">$19</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-slate-300 pt-2 border-t border-[#142036]">
            {['Unlimited Projects', 'AI Features', 'Client Portal', 'Priority Support', 'Daily Log AI Summaries', 'Change Order Tracking'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { alert('Starting 14-Day Free Trial on Professional...'); setSubView('main'); }}
            className="w-full h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md mt-1 cursor-pointer"
          >
            Start 14-Day Free Trial
          </button>
        </div>

        {/* Pricing Tier 2: Business ($49/mo) */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-white">Business</h4>
            <div className="text-right">
              <span className="text-lg font-black text-white">$49</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-slate-300 pt-2 border-t border-[#142036]">
            {['Everything in Professional', 'Unlimited Team Members', 'Advanced AI Analytics', 'Custom Branding', 'API Access', 'Dedicated Support'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { alert('Upgrading to Business tier...'); setSubView('main'); }}
            className="w-full h-10 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500 text-slate-300 hover:text-white font-bold text-xs mt-1 cursor-pointer"
          >
            Upgrade to Business
          </button>
        </div>

        {/* Pricing Tier 3: Enterprise */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-white">Enterprise</h4>
            <span className="text-sm font-black text-white">Custom</span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-slate-300 pt-2 border-t border-[#142036]">
            {['Everything in Business', 'SSO / SAML', 'Custom Integrations', 'SLA Guarantee', 'Onboarding', 'Dedicated CSM'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { alert('Contacting enterprise sales team...'); setSubView('main'); }}
            className="w-full h-10 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500 text-slate-300 hover:text-white font-bold text-xs mt-1 cursor-pointer"
          >
            Contact Sales
          </button>
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: NOTIFICATIONS PREFERENCES (Mobile-First) ───
  if (subView === 'notifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-tight">Notification Settings</h2>
          <div className="w-12" />
        </div>

        {/* Master Push Toggle */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Push Notifications</h3>
              <p className="text-[12px] text-slate-400">Receive alerts on device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPushMasterEnabled(!pushMasterEnabled)}
            className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
              pushMasterEnabled
                ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                : 'bg-[#1E293B] border-slate-700 hover:border-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                pushMasterEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 6 Preferences Section */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-1">
          <h3 className="text-xs font-bold text-white pb-2 border-b border-[#142036]">Alert Rules</h3>

          <div className="flex flex-col divide-y divide-[#142036]">
            {[
              { key: 'taskAssignments', label: 'Task assignments', desc: "When you're assigned a new task" },
              { key: 'dailyLogReminders', label: 'Daily log reminders', desc: 'Reminder to submit daily logs' },
              { key: 'budgetAlerts', label: 'Budget alerts', desc: 'When a project exceeds budget threshold' },
              { key: 'messageNotifications', label: 'Message notifications', desc: 'New messages in your channels' },
              { key: 'scheduleChanges', label: 'Schedule changes', desc: 'When task dates are modified' },
              { key: 'clientActivity', label: 'Client activity', desc: 'When clients view or approve items' },
            ].map((item) => {
              const isEnabled = notifPreferences[item.key as keyof typeof notifPreferences];
              const isEffective = isEnabled && pushMasterEnabled;
              return (
                <div key={item.key} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[12px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNotif(item.key as any)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                      isEffective
                        ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                        : 'bg-[#1E293B] border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                        isEffective ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN SETTINGS SCREEN ───
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">
      
      {/* ─── Top Navigation Header ─── */}
      <div className="flex items-center gap-3 pb-1">
        <button
          onClick={() => onNavigateTab ? onNavigateTab('home') : null}
          className="w-8 h-8 rounded-full bg-[#0E1726] border border-[#1A263B] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold text-white tracking-tight">Account</h1>
      </div>

      {/* ─── 1. HERO PROFILE CARD ─── */}
      <div 
        onClick={() => setSubView('profile')}
        className="p-4 bg-gradient-to-b from-[#111A2E] via-[#0E1526] to-[#0A0E1A] border border-[#1C2A44] hover:border-blue-500/40 transition-all rounded-3xl shadow-md flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="relative w-12 h-12 flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/40 group-hover:border-blue-500/70 transition-colors shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0A0E1A]" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors leading-tight">
              {userData.name}
            </h2>
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              {userData.email}
            </p>
            <p className="text-xs text-blue-400 font-semibold truncate mt-0.5">
              {userData.company || 'Avery & Marsh Construction Group'}
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-[#141F33] border border-[#1E2C48] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0 z-10 shadow-sm">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ─── 2. GROUP: WORKSPACE & ORGANIZATION ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Workspace & Company</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
          
          {/* Company Profile (Organization First) */}
          <button
            onClick={() => setSubView('company')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Building className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Company Profile</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  {userData.company || 'Avery & Marsh Construction'} • GC-12345
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* Subscription & Billing */}
          <button
            onClick={() => setSubView('billing')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Crown className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Subscription & Plan</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Trial (14-Day Free) • Professional $19/mo
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── 3. GROUP: PREFERENCES & SECURITY ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Preferences & Security</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
          
          {/* Notification Settings */}
          <button
            onClick={() => setSubView('notifications')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Bell className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Push Notifications</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Inspection, budget & schedule alerts (6 rules)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                {pushMasterEnabled ? 'Enabled' : 'Muted'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </button>

          {/* Security & Password */}
          <button
            onClick={() => setSubView('security')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Security & Password</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Password & account credentials
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── 4. GROUP: SUPPORT & HELP ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Support</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
          
          <button
            onClick={() => setSubView('support')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Help Center & Guides</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  FAQs, documentation & priority support
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── 5. GROUP: LEGAL ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Legal</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
          
          {/* Privacy Policy */}
          <button
            onClick={() => setSubView('privacy')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Privacy Policy</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  How we handle your data
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* Terms of Service */}
          <button
            onClick={() => setSubView('terms')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Terms of Service</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Platform usage agreement
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* AI Disclaimer */}
          <button
            onClick={() => setSubView('ai-disclaimer')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">AI Disclaimer</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  AI output limitations & responsibility
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* Subscription Terms */}
          <button
            onClick={() => setSubView('subscription-terms')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Crown className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Subscription Terms</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Billing, trials & credits
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* Beta Agreement */}
          <button
            onClick={() => setSubView('beta')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Beta Agreement</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Closed beta participation terms
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── 6. SIGN OUT BUTTON ─── */}
      <button
        onClick={onSignOut}
        className="w-full h-11 rounded-2xl bg-[#1A0A10] border border-[#33141C] text-rose-400 hover:bg-rose-500/20 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>

    </div>
  );
};
