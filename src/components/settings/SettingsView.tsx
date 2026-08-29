import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Lock, ChevronRight, HelpCircle, LogOut, Edit3, 
  FileText, Bell, ShieldCheck, Mail, Phone,
  Check, X, Crown, Building, Palette, Users, 
  ChevronLeft, Sparkles, DollarSign, ArrowRight,
  HardHat, Award, Wrench, AlertOctagon, Smartphone,
  Wifi, Camera, Clock, MapPin, CheckCircle2, ShieldAlert,
  RefreshCw, HardDrive, Database, Sliders, Image, Radio
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
  const [subView, setSubView] = useState<
    'main' | 'billing' | 'notifications' | 'company' | 'terms' | 
    'privacy' | 'support' | 'profile' | 'security' | 'ai-disclaimer' | 
    'subscription-terms' | 'beta' | 'certifications' | 'equipment' | 
    'emergency' | 'sop' | 'field-sync'
  >('main');
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

  // ─── SUBVIEW: FIELD SYNC & OFFLINE STORAGE (Dedicated Config Page) ───
  if (subView === 'field-sync') {
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
          <h2 className="text-sm font-bold text-white tracking-tight">Field Sync & Storage</h2>
          <div className="w-12" />
        </div>

        {/* Live Sync Status & Queue Card */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#14223E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Local Field Cache</h3>
                <p className="text-[11px] text-slate-400">18 Photos Queued · 42.8 MB</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </span>
          </div>

          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-blue-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Photos to Cloud...' : 'Force Sync Offline Queue Now'}</span>
          </button>

          {syncSuccessMsg && (
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center animate-fade-in">
              ✓ All local photos & logs successfully synced!
            </div>
          )}
        </div>

        {/* Section 1: Offline Basement Mode */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Offline Basement Mode</p>
          <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">
            {/* Master Offline Cache Toggle */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white">Enable Basement Caching</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Keep blueprints & tasks available offline without cell signal</p>
              </div>
              <button
                type="button"
                onClick={() => setOfflineSyncEnabled(!offlineSyncEnabled)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  offlineSyncEnabled
                    ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1E293B] border-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    offlineSyncEnabled ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Cellular vs WiFi Sync */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white">Sync Over Cellular Data</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Upload photos instantly via 5G/LTE when outside</p>
              </div>
              <button
                type="button"
                onClick={() => setSyncOnCellular(!syncOnCellular)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  syncOnCellular
                    ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1E293B] border-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    syncOnCellular ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Camera & Photo Watermarking */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Camera & Evidence Watermarking</p>
          <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">
            {/* GPS Watermark */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white">Embed GPS Coordinates</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Burn latitude & longitude watermark on resolution photos</p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoGpsTagging(!photoGpsTagging)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  photoGpsTagging
                    ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1E293B] border-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    photoGpsTagging ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Date/Time Watermark */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white">Embed Date & Timestamp</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Stamp exact hour/minute for punch list audit trails</p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoTimestampTagging(!photoTimestampTagging)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  photoTimestampTagging
                    ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1E293B] border-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    photoTimestampTagging ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Photo Quality Selector */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-semibold text-white">Upload Compression</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Choose speed vs original detail</p>
              </div>
              <div className="flex items-center gap-1 bg-[#090F1E] p-0.5 rounded-xl border border-[#162238]">
                <button
                  onClick={() => setPhotoQuality('optimized')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    photoQuality === 'optimized' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fast (1080p)
                </button>
                <button
                  onClick={() => setPhotoQuality('high')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    photoQuality === 'high' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Daily Log Automation</p>
          <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white">Auto-Save Drafts Every 2 Mins</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Prevent loss of end-of-day site logs and notes</p>
              </div>
              <button
                type="button"
                onClick={() => setDailyLogAutoSave(!dailyLogAutoSave)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  dailyLogAutoSave
                    ? 'bg-[#2563EB] border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1E293B] border-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    dailyLogAutoSave ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ─── SUBVIEW: FIELD CERTIFICATIONS & BADGES ───
  if (subView === 'certifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-tight">Safety & Certifications</h2>
          <div className="w-12" />
        </div>

        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Site Access Compliance</h3>
            <p className="text-[12px] text-emerald-400 font-semibold mt-0.5">100% Compliant · All Badges Active</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { title: 'OSHA 30-Hour Construction Safety', id: 'OSHA-NY-88219', exp: 'Valid through Dec 2028', status: 'Active', icon: Award, color: 'text-amber-400' },
            { title: 'First Aid, CPR & AED Certified', id: 'ARC-FA-99120', exp: 'Valid through Oct 2027', status: 'Active', icon: ShieldAlert, color: 'text-rose-400' },
            { title: 'Boom & Scissor Lift Operator (MEWP)', id: 'MEWP-4421-B', exp: 'Valid through Aug 2026', status: 'Active', icon: HardHat, color: 'text-blue-400' },
            { title: 'NYC DOB Site Safety Training (SST)', id: 'DOB-SST-6601', exp: 'Valid through Jan 2029', status: 'Active', icon: CheckCircle2, color: 'text-emerald-400' },
          ].map((cert) => (
            <div key={cert.id} className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#090F1E] border border-[#162238] flex items-center justify-center flex-shrink-0">
                  <cert.icon className={`w-4 h-4 ${cert.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{cert.title}</h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{cert.id} · {cert.exp}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
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
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-tight">Assigned Equipment</h2>
          <div className="w-12" />
        </div>

        <p className="text-[12px] text-slate-400 px-1">Hardware and diagnostic gear checked out under your name:</p>

        <div className="flex flex-col gap-2.5">
          {[
            { name: 'Leica DISTO S910 Laser Measurer', tag: 'EQ-712', condition: 'Excellent', lastCalibrated: 'July 2025' },
            { name: 'DeWalt 20V MAX Jobsite Bluetooth Radio', tag: 'EQ-304', condition: 'Good', lastCalibrated: 'N/A' },
            { name: 'Rugged iPad Pro 11" (Field Tough Case)', tag: 'TAB-02', condition: 'Active', lastCalibrated: 'MDM Enrolled' },
            { name: 'FLIR C5 Compact Thermal Camera', tag: 'TH-108', condition: 'Excellent', lastCalibrated: 'May 2025' },
          ].map((item) => (
            <div key={item.tag} className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tag: <span className="text-slate-300 font-mono">{item.tag}</span> · {item.lastCalibrated}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">
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
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
          <button
            onClick={() => setSubView('main')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-sm font-bold text-white tracking-tight">Emergency Contacts</h2>
          <div className="w-12" />
        </div>

        {/* 911 Banner */}
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-lg">
              911
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Emergency Services</h3>
              <p className="text-[11px] text-rose-300">Police · Fire · Medical Dispatch</p>
            </div>
          </div>
          <a
            href="tel:911"
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
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
            <div key={idx} className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{contact.role}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{contact.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{contact.phone}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
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
  if (subView === 'billing') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
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
      </div>
    );
  }

  // ─── SUBVIEW: NOTIFICATIONS PREFERENCES ───
  if (subView === 'notifications') {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
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

        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-1">
          <h3 className="text-xs font-bold text-white pb-2 border-b border-[#142036]">Alert Rules</h3>

          <div className="flex flex-col divide-y divide-[#142036]">
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

  // ─── MAIN SETTINGS & PROFILE SCREEN ───
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('home') : null}
            className="w-8 h-8 rounded-full bg-[#0E1726] border border-[#1A263B] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              {isFieldStaff ? 'Field Staff Profile' : 'Account & Organization'}
            </h1>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isFieldStaff 
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
        }`}>
          {isFieldStaff ? 'Field Superintendent' : 'Company Owner'}
        </span>
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
              {userData.roleTitle || (isFieldStaff ? 'Lead Superintendent' : 'Company Owner')}
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-[#141F33] border border-[#1E2C48] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0 z-10 shadow-sm">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          A. EMPLOYEE / FIELD STAFF SPECIFIC MODULES (Clean & Focused)
         ══════════════════════════════════════════════════════════ */}
      {isFieldStaff ? (
        <>
          {/* Group 1: Safety & Compliance Credentials */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Safety & Credentials</p>
            <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
              
              {/* Safety Badges & Certs */}
              <button
                onClick={() => setSubView('certifications')}
                className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Safety Badges & Certifications</span>
                    <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                      OSHA 30, First Aid, MEWP Lift (4 Valid)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Verified
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>

              {/* Assigned Hardware Gear */}
              <button
                onClick={() => setSubView('equipment')}
                className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Wrench className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Assigned Equipment & Tools</span>
                    <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                      Leica Laser, Rugged iPad Pro, Thermal Cam
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>

            </div>
          </div>

          {/* Group 2: Field Site Automation & Offline Sync (Dedicated Page) */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Field Sync & Storage</p>
            <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
              
              <button
                onClick={() => setSubView('field-sync')}
                className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Wifi className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Field Sync & Offline Storage</span>
                    <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                      Basement cache, GPS watermark & 18 queued items
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Auto-Sync
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>

            </div>
          </div>

          {/* Group 3: Emergency Protocol */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Safety & Emergency</p>
            <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
              
              <button
                onClick={() => setSubView('emergency')}
                className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Emergency Site Contacts</span>
                    <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                      Safety officer, 911, nearest hospital
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>

            </div>
          </div>
        </>
      ) : (
        /* ══════════════════════════════════════════════════════════
            B. COMPANY OWNER / ADMIN SPECIFIC MODULES (Organization & Billing)
           ══════════════════════════════════════════════════════════ */
        <>
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
                      {userData.company || 'Lattice Construction'} • GC-12345
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
        </>
      )}

      {/* ─── COMMON GROUP: PREFERENCES & SECURITY ─── */}
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
                  {isFieldStaff ? 'Inspection, shift & daily log alerts' : 'Inspection, budget & schedule alerts'}
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
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">Security & PIN</span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  Field login PIN & password
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── COMMON GROUP: SUPPORT & HELP ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Support & Guides</p>
        <div className="bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm overflow-hidden divide-y divide-[#142036]">  
          
          <button
            onClick={() => setSubView('support')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#0C152B] transition-colors text-left cursor-pointer active:bg-[#0E1A33]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-white block leading-tight">
                  {isFieldStaff ? 'Field Guides & Help' : 'Help Center & Guides'}
                </span>
                <span className="text-[12px] text-slate-400 font-medium block mt-0.5 truncate">
                  {isFieldStaff ? 'OSHA quick reference & app help' : 'FAQs, documentation & priority support'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

        </div>
      </div>

      {/* ─── SIGN OUT BUTTON ─── */}
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
