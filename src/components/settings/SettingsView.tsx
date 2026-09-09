import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Lock, ChevronRight, HelpCircle, LogOut, 
  FileText, Bell, ShieldCheck, Mail, Phone,
  Check, X, Crown, Building, Palette, Users, 
  ChevronLeft, Sparkles, DollarSign, ArrowRight,
  HardHat, Award, Wrench, AlertOctagon, Smartphone,
  Wifi, Camera, Clock, MapPin, CheckCircle2, ShieldAlert,
  RefreshCw, HardDrive, Database, Sliders, Image, Radio,
  CreditCard, FlaskConical, Flag
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
import { LatticeVerifiedView } from './LatticeVerifiedView';
import { ProfileHeroCard } from './ProfileHeroCard';

export interface SettingsViewProps {
  currentUser: User;
  onSignOut: () => void;
  onNavigateTab?: (tab: string) => void;
  initialSubView?: string;
}

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 p-0.5 relative outline-none ${
      disabled ? 'opacity-40 cursor-not-allowed' : ''
    } ${checked ? 'bg-[#1677FF]' : 'bg-[#CBD5E1]'}`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onSignOut,
  onNavigateTab,
  initialSubView
}) => {
  const [userData, setUserData] = useState<User>(currentUser);
  const [subView, setSubView] = useState<
    'main' | 'billing' | 'notifications' | 'company' | 'terms' | 
    'privacy' | 'support' | 'profile' | 'security' | 'ai-disclaimer' | 
    'subscription-terms' | 'beta' | 'certifications' | 'equipment' | 
    'emergency' | 'sop' | 'field-sync' | 'verified'
  >((initialSubView as any) || 'main');

  React.useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView as any);
    }
  }, [initialSubView]);

  React.useEffect(() => {
    setUserData(currentUser);
  }, [currentUser]);
  const [pushMasterEnabled, setPushMasterEnabled] = useState(true);

  // Field Staff Specific Settings
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [syncOnCellular, setSyncOnCellular] = useState(false);
  const [photoGpsTagging, setPhotoGpsTagging] = useState(true);
  const [photoTimestampTagging, setPhotoTimestampTagging] = useState(true);
  const [photoQuality, setPhotoQuality] = useState<'optimized' | 'high'>('optimized');
  const [dailyLogAutoSave, setDailyLogAutoSave] = useState(true);
  const [dailyLogReminder, setDailyLogReminder] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);

  // Notification Preferences
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

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMsg(true);
      setTimeout(() => setSyncSuccessMsg(false), 3000);
    }, 1500);
  };

  const isFieldStaff = userData.role === 'field';
  const isOwnerAdmin = userData.role === 'admin';
  const isEmployee = !isOwnerAdmin;

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

  if (subView === 'company' && isOwnerAdmin) {
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

  if (subView === 'verified') {
    return <LatticeVerifiedView currentUser={userData} onBack={() => setSubView('main')} />;
  }

  if (subView === 'terms') {
    return <TermsAndConditions onBack={() => setSubView('main')} />;
  }

  if (subView === 'privacy') {
    return <PrivacyPolicy onBack={() => setSubView('main')} />;
  }

  if (subView === 'support') {
    return <HelpSupport onBack={() => setSubView('main')} onNavigateTab={onNavigateTab} />;
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

  // ─── SUBVIEW: FIELD SYNC & OFFLINE STORAGE ───
  if (subView === 'field-sync') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Field Sync & Storage</h2>
          <div className="w-12" />
        </div>

        {/* Live Sync Status & Queue Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#171A1F]">Local Field Cache</h3>
                <p className="text-xs text-[#68707C]">18 Photos Queued · 42.8 MB</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
          </div>

          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="w-full py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Photos to Cloud...' : 'Force Sync Offline Queue Now'}</span>
          </button>

          {syncSuccessMsg && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-fade-in">
              ✓ All local photos & logs successfully synced!
            </div>
          )}
        </div>

        {/* Section 1: Offline Basement Mode */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Offline Basement Mode</p>
          <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Enable Basement Caching</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Keep blueprints & tasks available offline without cell signal</p>
              </div>
              <ToggleSwitch
                checked={offlineSyncEnabled}
                onChange={() => setOfflineSyncEnabled(!offlineSyncEnabled)}
              />
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Sync Over Cellular Data</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Upload photos instantly via 5G/LTE when outside</p>
              </div>
              <ToggleSwitch
                checked={syncOnCellular}
                onChange={() => setSyncOnCellular(!syncOnCellular)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Camera & Photo Watermarking */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Camera & Evidence Watermarking</p>
          <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Embed GPS Coordinates</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Burn latitude & longitude watermark on resolution photos</p>
              </div>
              <ToggleSwitch
                checked={photoGpsTagging}
                onChange={() => setPhotoGpsTagging(!photoGpsTagging)}
              />
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Embed Date & Timestamp</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Stamp exact hour/minute for punch list audit trails</p>
              </div>
              <ToggleSwitch
                checked={photoTimestampTagging}
                onChange={() => setPhotoTimestampTagging(!photoTimestampTagging)}
              />
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-semibold text-[#171A1F]">Upload Compression</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Choose speed vs original detail</p>
              </div>
              <div className="flex items-center gap-1 bg-[#F2F2F7] p-0.5 rounded-xl border border-[#DDE1E7]">
                <button
                  onClick={() => setPhotoQuality('optimized')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    photoQuality === 'optimized' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
                  }`}
                >
                  Fast (1080p)
                </button>
                <button
                  onClick={() => setPhotoQuality('high')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    photoQuality === 'high' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
                  }`}
                >
                  High (4K)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Log Automation */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Daily Log Automation</p>
          <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Auto-Save Drafts Every 2 Mins</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Prevent loss of end-of-day site logs and notes</p>
              </div>
              <ToggleSwitch
                checked={dailyLogAutoSave}
                onChange={() => setDailyLogAutoSave(!dailyLogAutoSave)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: FIELD CERTIFICATIONS & BADGES ───
  if (subView === 'certifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Safety & Certifications</h2>
          <div className="w-12" />
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171A1F]">Site Access Compliance</h3>
            <p className="text-[12px] text-emerald-700 font-semibold mt-0.5">100% Compliant · All Badges Active</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { title: 'OSHA 30-Hour Construction Safety', id: 'OSHA-NY-88219', exp: 'Valid through Dec 2028', status: 'Active', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
            { title: 'First Aid, CPR & AED Certified', id: 'ARC-FA-99120', exp: 'Valid through Oct 2027', status: 'Active', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
            { title: 'Boom & Scissor Lift Operator (MEWP)', id: 'MEWP-4421-B', exp: 'Valid through Aug 2026', status: 'Active', icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { title: 'NYC DOB Site Safety Training (SST)', id: 'DOB-SST-6601', exp: 'Valid through Jan 2029', status: 'Active', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          ].map((cert) => (
            <div key={cert.id} className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl ${cert.bg} border flex items-center justify-center flex-shrink-0`}>
                  <cert.icon className={`w-4 h-4 ${cert.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#171A1F] truncate">{cert.title}</h4>
                  <p className="text-xs font-mono text-[#68707C] mt-0.5">{cert.id} · {cert.exp}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                {cert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: ASSIGNED GEAR & TOOLS ───
  if (subView === 'equipment') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Assigned Equipment</h2>
          <div className="w-12" />
        </div>

        <p className="text-[12px] text-[#68707C] px-1">Hardware and diagnostic gear checked out under your name:</p>

        <div className="flex flex-col gap-2.5">
          {[
            { name: 'Leica DISTO S910 Laser Measurer', tag: 'EQ-712', condition: 'Excellent', lastCalibrated: 'July 2025' },
            { name: 'DeWalt 20V MAX Jobsite Bluetooth Radio', tag: 'EQ-304', condition: 'Good', lastCalibrated: 'N/A' },
            { name: 'Rugged iPad Pro 11" (Field Tough Case)', tag: 'TAB-02', condition: 'Active', lastCalibrated: 'MDM Enrolled' },
            { name: 'FLIR C5 Compact Thermal Camera', tag: 'TH-108', condition: 'Excellent', lastCalibrated: 'May 2025' },
          ].map((item) => (
            <div key={item.tag} className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-blue-200 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#171A1F] truncate">{item.name}</h4>
                  <p className="text-xs text-[#68707C] mt-0.5">Tag: <span className="text-[#171A1F] font-mono font-semibold">{item.tag}</span> · {item.lastCalibrated}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                {item.condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: EMERGENCY SITE PROTOCOL ───
  if (subView === 'emergency') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Emergency Contacts</h2>
          <div className="w-12" />
        </div>

        {/* 911 Banner */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              911
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-900">Emergency Services</h3>
              <p className="text-xs text-rose-700">Police · Fire · Medical Dispatch</p>
            </div>
          </div>
          <a
            href="tel:911"
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Call 911
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { role: 'Site Safety Officer', name: 'Frank Davies', phone: '+1 (555) 019-2834', status: 'On Call 24/7' },
            { role: 'General Contractor Dispatch', name: 'Avery Marsh HQ', phone: '+1 (555) 019-9000', status: 'Main Desk' },
            { role: 'Local Nearest Hospital', name: 'Metropolitan Medical Center', phone: '+1 (555) 880-1200', status: '1.8 Miles' },
            { role: 'Poison Control Center', name: 'National Hotline', phone: '+1 (800) 222-1222', status: 'Toll-Free' },
          ].map((contact, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF]">{contact.role}</span>
                <h4 className="text-xs font-bold text-[#171A1F] mt-0.5">{contact.name}</h4>
                <p className="text-xs text-[#68707C] font-mono mt-0.5">{contact.phone}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: BILLING & SUBSCRIPTION (Owner Only) ───
  if (subView === 'billing' && isOwnerAdmin) {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Subscription</h2>
          <div className="w-12" />
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider block">Current Plan</span>
            <h3 className="text-base font-black text-[#171A1F] mt-0.5">Trial</h3>
            <p className="text-[12px] text-[#68707C] mt-0.5 font-medium">14-day free trial · No credit card required</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            Active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-[#1677FF] shadow-md flex flex-col gap-3 relative">
          <span className="text-[10px] font-black tracking-wider text-[#1677FF] uppercase">Most Popular</span>
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-bold text-[#171A1F]">Professional</h4>
            <div className="text-right">
              <span className="text-lg font-black text-[#171A1F]">$19</span>
              <span className="text-xs text-[#68707C]">/month</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-[#171A1F] pt-2 border-t border-[#EAEDF1]">
            {['Unlimited Projects', 'AI Features', 'Client Portal', 'Priority Support', 'Daily Log AI Summaries', 'Change Order Tracking'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { alert('Starting 14-Day Free Trial on Professional...'); setSubView('main'); }}
            className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs shadow-xs mt-1 cursor-pointer transition-all active:scale-[0.99]"
          >
            Start 14-Day Free Trial
          </button>
        </div>
      </div>
    );
  }

  // ─── SUBVIEW: NOTIFICATIONS PREFERENCES ───
  if (subView === 'notifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Notification Settings</h2>
          <div className="w-12" />
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-blue-200 flex items-center justify-center text-[#1677FF]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#171A1F]">Push Notifications</h3>
              <p className="text-[12px] text-[#68707C]">Receive alerts on device</p>
            </div>
          </div>
          <ToggleSwitch
            checked={pushMasterEnabled}
            onChange={() => setPushMasterEnabled(!pushMasterEnabled)}
          />
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-1">
          <h3 className="text-xs font-bold text-[#171A1F] pb-2 border-b border-[#EAEDF1]">Alert Rules</h3>

          <div className="flex flex-col divide-y divide-[#EAEDF1]">
            {[
              { key: 'taskAssignments', label: 'Task assignments', desc: "When you're assigned a new task" },
              { key: 'dailyLogReminders', label: 'Daily log reminders', desc: '4:30 PM reminder to submit daily logs' },
              { key: 'budgetAlerts', label: 'Inspection alerts', desc: 'Scheduled inspector arrival notices' },
              { key: 'messageNotifications', label: 'Message notifications', desc: 'New messages in your channels' },
              { key: 'scheduleChanges', label: 'Schedule changes', desc: 'When task dates are modified' },
            ].map((item) => {
              const isEnabled = notifPreferences[item.key as keyof typeof notifPreferences];
              const isEffective = isEnabled && pushMasterEnabled;
              return (
                <div key={item.key} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#171A1F]">{item.label}</h4>
                    <p className="text-[12px] text-[#68707C] mt-0.5">{item.desc}</p>
                  </div>

                  <ToggleSwitch
                    checked={isEffective}
                    disabled={!pushMasterEnabled}
                    onChange={() => toggleNotif(item.key as any)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN SETTINGS & PROFILE SCREEN ───
  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateTab ? onNavigateTab('home') : null}
          className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs flex-shrink-0"
          title="Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm md:text-base font-bold text-[#171A1F] tracking-tight leading-tight">
            Account & Profile
          </h1>
        </div>
      </div>
      


      <ProfileHeroCard
        user={userData}
        onEdit={() => setSubView('profile')}
        onOpenCompany={isOwnerAdmin ? () => setSubView('company') : undefined}
      />

      {/* ─── ACCOUNT MENU (role-gated) ─── */}
      {isOwnerAdmin && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#F1F5F9]">
          <div className="px-4 pt-3 pb-2 bg-[#F8FAFC] border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
              Workspace & Billing
            </p>
          </div>

          <button onClick={() => setSubView('company')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors text-left cursor-pointer active:bg-[#F1F5F9] group">
            <div className="flex items-center gap-3 min-w-0">
              <Building className="w-4 h-4 text-[#64748B] group-hover:text-[#0F172A] transition-colors flex-shrink-0" />
              <span className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">Company Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
          </button>

          <button onClick={() => setSubView('billing')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors text-left cursor-pointer active:bg-[#F1F5F9] group">
            <div className="flex items-center gap-3 min-w-0">
              <Crown className="w-4 h-4 text-[#64748B] group-hover:text-[#0F172A] transition-colors flex-shrink-0" />
              <span className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">Subscription</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">Trial</span>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {isFieldStaff && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#F1F5F9]">
          <div className="px-4 pt-3 pb-2 bg-[#F8FAFC] border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
              Field Operations & Safety
            </p>
          </div>

          {/* Safety Badges & Certs */}
          <button onClick={() => setSubView('certifications')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
            <div className="flex items-center gap-3 min-w-0">
              <Award className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Safety Badges & Certifications</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">4 Valid</span>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
            </div>
          </button>

          {/* Assigned Equipment */}
          <button onClick={() => setSubView('equipment')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
            <div className="flex items-center gap-3 min-w-0">
              <Wrench className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Assigned Equipment & Tools</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">4 Items</span>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
            </div>
          </button>

          {/* Field Sync & Offline Storage */}
          <button onClick={() => setSubView('field-sync')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
            <div className="flex items-center gap-3 min-w-0">
              <Wifi className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Field Sync & Offline Storage</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">Auto-Sync</span>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
            </div>
          </button>

          {/* Emergency Site Contacts */}
          <button onClick={() => setSubView('emergency')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
            <div className="flex items-center gap-3 min-w-0">
              <AlertOctagon className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Emergency Site Contacts</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">911 Active</span>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {isEmployee && !isFieldStaff && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#F1F5F9]">
          <div className="px-4 pt-3 pb-2 bg-[#F8FAFC] border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
              {userData.role === 'finance' ? 'Finance Access' : 'Project Assignment'}
            </p>
          </div>
          <div className="px-4 py-3.5">
            <p className="text-sm font-semibold text-[#0F172A]">
              {userData.role === 'finance'
                ? 'Invited finance staff · no billing access'
                : 'Invited project manager · no billing access'}
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Workspace owner Avery Scott manages the Lattice subscription and company profile.
            </p>
          </div>
        </div>
      )}

      {/* ─── PREFERENCES & SECURITY ─── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.03)] overflow-hidden divide-y divide-slate-100">
        <div className="px-4 pt-3 pb-2 bg-slate-50/50 border-b border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
            Preferences & Security
          </p>
        </div>

        {/* Notifications */}
        <button onClick={() => setSubView('notifications')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
          <div className="flex items-center gap-3 min-w-0">
            <Bell className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
            <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Notifications</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">
              {pushMasterEnabled ? 'On' : 'Off'}
            </span>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
          </div>
        </button>

        {/* Security & Password */}
        <button onClick={() => setSubView('security')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
          <div className="flex items-center gap-3 min-w-0">
            <Lock className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
            <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
              {isFieldStaff ? 'Security & PIN' : 'Security & Password'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </button>

        {/* Help & Support */}
        <button onClick={() => setSubView('support')} className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left cursor-pointer active:bg-slate-100/70 group">
          <div className="flex items-center gap-3 min-w-0">
            <HelpCircle className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
            <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
              {isFieldStaff ? 'Field Guides & Help' : 'Help & Support'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* ─── LEGAL ─── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.03)] overflow-hidden divide-y divide-slate-100">
        <div className="px-4 pt-3 pb-2 bg-slate-50/50 border-b border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Legal & Compliance
          </p>
        </div>
        {[
          { label: 'Privacy Policy',      view: 'privacy' as const,             Icon: ShieldCheck, ownerOnly: false },
          { label: 'Terms of Service',    view: 'terms' as const,               Icon: FileText, ownerOnly: false },
          { label: 'AI Disclaimer',       view: 'ai-disclaimer' as const,       Icon: Sparkles, ownerOnly: false },
          { label: 'Subscription Terms',  view: 'subscription-terms' as const,  Icon: CreditCard, ownerOnly: true },
          { label: 'Beta Agreement',      view: 'beta' as const,                Icon: FlaskConical, ownerOnly: false },
        ].filter((item) => isOwnerAdmin || !item.ownerOnly).map(({ label, view, Icon }) => (
          <button
            key={view}
            onClick={() => setSubView(view)}
            className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group active:bg-slate-100/70"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className="w-4 h-4 text-[#64748B] group-hover:text-[#171A1F] transition-colors flex-shrink-0" />
              <span className="text-xs font-semibold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* ─── SIGN OUT ─── */}
      <button
        onClick={onSignOut}
        className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-rose-50/80 border border-slate-200/90 hover:border-rose-200 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-[0_2px_8px_rgba(15,23,42,0.02)] group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <LogOut className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-rose-600 truncate">Sign Out</span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-rose-500 transition-colors flex-shrink-0" />
      </button>

      <p className="text-center text-[10px] text-slate-400 font-medium pb-2">Lattice Construction OS · v1.0.0</p>

    </div>
  );
};
