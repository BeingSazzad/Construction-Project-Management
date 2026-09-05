import React, { useState } from 'react';
import { User } from '../../types';
import {
  Building2, Bell, HelpCircle, LogOut, ChevronRight,
  Phone, Mail, MapPin, Edit3, Lock,
  FlaskConical, Sparkles, ChevronLeft, Crown,
  ShieldCheck, FileText, CreditCard
} from 'lucide-react';
import { TermsAndConditions } from '../legal/TermsAndConditions';
import { PrivacyPolicy } from '../legal/PrivacyPolicy';
import { AiDisclaimer } from '../legal/AiDisclaimer';
import { SubscriptionTerms } from '../legal/SubscriptionTerms';
import { BetaAgreement } from '../legal/BetaAgreement';
import { HelpSupport } from './HelpSupport';
import { EditProfileView } from './EditProfileView';
import { SecurityPasswordView } from './SecurityPasswordView';

interface MoreHubViewProps {
  currentUser: User;
  onSignOut: () => void;
  onNavigateTab?: (tab: string) => void;
}

// ── Toggle Switch ──────────────────────────────────────────────────
const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
      enabled ? 'bg-[#1677FF] border-[#1677FF]' : 'bg-[#E5E7EB] border-[#D1D5DB]'
    }`}
  >
    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// ── Row Item ───────────────────────────────────────────────────────
const RowItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, label, badge, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7] group"
  >
    <div className="flex items-center gap-3 min-w-0">
      {icon}
      <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
        {label}
      </span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {badge}
      <ChevronRight className="w-4 h-4 text-[#DDE1E7] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
    </div>
  </button>
);

// ── Back Header ────────────────────────────────────────────────────
const BackHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-[#EAEDF1]">
    <button
      onClick={onBack}
      className="w-8 h-8 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] flex items-center justify-center cursor-pointer transition-all active:scale-95"
    >
      <ChevronLeft className="w-4 h-4 text-[#171A1F]" />
    </button>
    <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">{title}</h2>
  </div>
);

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  currentUser,
  onSignOut,
}) => {
  const [userData, setUserData] = useState<User>(currentUser);
  const [subView, setSubView] = useState<
    'main' | 'profile' | 'security' | 'notifications' | 'workspace' |
    'terms' | 'privacy' | 'ai-disclaimer' | 'subscription-terms' | 'beta' | 'support'
  >('main');

  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState({
    taskAssignments: true,
    dailyLogReminders: true,
    budgetAlerts: true,
    scheduleChanges: true,
    weatherAlerts: true,
  });
  const toggleNotif = (key: keyof typeof notifPrefs) =>
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Sub-view routing ───────────────────────────────────────────
  if (subView === 'profile') {
    return (
      <EditProfileView
        currentUser={userData}
        onBack={() => setSubView('main')}
        onSave={(updated) => setUserData(prev => ({ ...prev, ...updated }))}
      />
    );
  }

  if (subView === 'security') {
    return <SecurityPasswordView onBack={() => setSubView('main')} />;
  }

  if (subView === 'support') {
    return <HelpSupport onBack={() => setSubView('main')} />;
  }

  if (subView === 'terms')              return <TermsAndConditions onBack={() => setSubView('main')} />;
  if (subView === 'privacy')            return <PrivacyPolicy onBack={() => setSubView('main')} />;
  if (subView === 'ai-disclaimer')      return <AiDisclaimer onBack={() => setSubView('main')} />;
  if (subView === 'subscription-terms') return <SubscriptionTerms onBack={() => setSubView('main')} />;
  if (subView === 'beta')               return <BetaAgreement onBack={() => setSubView('main')} />;

  // ── Workspace sub-view (Company Info) ─────────────────────────
  if (subView === 'workspace') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <BackHeader title="Workspace" onBack={() => setSubView('main')} />

        <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#EAEDF1]">
          {[
            { icon: <Building2 className="w-4 h-4" />, label: 'Company', value: userData?.company || 'Avery & Marsh Construction' },
            { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: '1200 Bayshore Blvd, Suite 400, Tampa, FL 33606' },
            { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: '(813) 555-0190', href: 'tel:+18135550190' },
            { icon: <Mail className="w-4 h-4" />, label: 'Email', value: 'operations@averymarsh.com', href: 'mailto:operations@averymarsh.com' },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-xs font-semibold text-[#1677FF] hover:underline mt-0.5 block">{item.value}</a>
                ) : (
                  <p className="text-xs font-semibold text-[#171A1F] mt-0.5">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Notifications sub-view ─────────────────────────────────────
  if (subView === 'notifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <BackHeader title="Notifications" onBack={() => setSubView('main')} />

        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#171A1F]">Push Notifications</h3>
              <p className="text-xs text-[#68707C]">Receive alerts on this device</p>
            </div>
          </div>
          <Toggle enabled={pushEnabled} onChange={() => setPushEnabled(v => !v)} />
        </div>

        <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#EAEDF1]">
          {[
            { key: 'taskAssignments',  label: 'Task Assignments',    desc: "When you're assigned a new task" },
            { key: 'dailyLogReminders', label: 'Daily Log Reminders', desc: '4:30 PM reminder to submit logs' },
            { key: 'budgetAlerts',     label: 'Budget Alerts',       desc: 'When cost items exceed budget' },
            { key: 'scheduleChanges',  label: 'Schedule Changes',    desc: 'When task dates are modified' },
            { key: 'weatherAlerts',    label: 'Weather Alerts',      desc: 'Rain/wind warnings affecting jobs' },
          ].map((item) => {
            const isOn = notifPrefs[item.key as keyof typeof notifPrefs] && pushEnabled;
            return (
              <div key={item.key} className="py-3 px-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#171A1F]">{item.label}</h4>
                  <p className="text-xs text-[#68707C] mt-0.5">{item.desc}</p>
                </div>
                <Toggle enabled={isOn} onChange={() => toggleNotif(item.key as keyof typeof notifPrefs)} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── MAIN VIEW ──────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">

      {/* 1. Profile card — single row */}
      <button
        onClick={() => setSubView('profile')}
        className="w-full p-3.5 bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 rounded-2xl shadow-sm flex items-center gap-3 cursor-pointer group active:scale-[0.99] text-left transition-all"
      >
        <div className="relative flex-shrink-0">
          <img
            src={userData.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
            alt={userData.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#1677FF]/20 group-hover:border-[#1677FF] transition-colors"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
            {userData.name || 'Avery Scott'}
          </p>
          <p className="text-xs text-[#68707C] font-medium truncate">
            {userData.roleTitle || 'Managing Principal'}
          </p>
        </div>
        <div className="w-7 h-7 rounded-xl bg-[#F2F2F7] border border-[#EAEDF1] text-[#68707C] group-hover:text-[#1677FF] flex items-center justify-center transition-colors flex-shrink-0">
          <Edit3 className="w-3 h-3" />
        </div>
      </button>

      {/* 2. Account rows — all one grouped list */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#EAEDF1]">
        <RowItem
          icon={<div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]"><Building2 className="w-3.5 h-3.5" /></div>}
          label="Workspace"
          onClick={() => setSubView('workspace')}
        />
        <RowItem
          icon={<div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]"><Bell className="w-3.5 h-3.5" /></div>}
          label="Notifications"
          badge={<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30">{pushEnabled ? 'On' : 'Off'}</span>}
          onClick={() => setSubView('notifications')}
        />
        <RowItem
          icon={<div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]"><Lock className="w-3.5 h-3.5" /></div>}
          label="Security & Password"
          onClick={() => setSubView('security')}
        />
        <RowItem
          icon={<div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]"><Crown className="w-3.5 h-3.5" /></div>}
          label="Subscription"
          badge={<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Trial</span>}
          onClick={() => alert('Coming soon')}
        />
        <RowItem
          icon={<div className="w-7 h-7 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]"><HelpCircle className="w-3.5 h-3.5" /></div>}
          label="Help & Support"
          onClick={() => setSubView('support')}
        />
      </div>

      {/* 3. Legal — compact */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#EAEDF1]">
        <div className="px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C]">Legal</p>
        </div>
        {[
          { label: 'Privacy Policy',      view: 'privacy' as const },
          { label: 'Terms of Service',    view: 'terms' as const },
          { label: 'AI Disclaimer',       view: 'ai-disclaimer' as const },
          { label: 'Subscription Terms',  view: 'subscription-terms' as const },
          { label: 'Beta Agreement',      view: 'beta' as const },
        ].map((item) => (
          <button
            key={item.view}
            onClick={() => setSubView(item.view)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#F7F8FA] transition-colors cursor-pointer group"
          >
            <span className="text-xs font-medium text-[#68707C] group-hover:text-[#171A1F] transition-colors">{item.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#DDE1E7] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* 4. Sign Out */}
      <button
        onClick={onSignOut}
        className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50 border border-[#DDE1E7] hover:border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>

      <p className="text-center text-[10px] text-[#DDE1E7] pb-2">Lattice v1.0</p>

    </div>
  );
};
