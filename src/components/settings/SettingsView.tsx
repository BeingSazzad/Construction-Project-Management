import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Lock, ChevronRight, HelpCircle, LogOut, Edit3, 
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
    'emergency' | 'sop' | 'field-sync' | 'verified'
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
              <button
                type="button"
                onClick={() => setOfflineSyncEnabled(!offlineSyncEnabled)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  offlineSyncEnabled
                    ? 'bg-[#1677FF] border-[#1677FF]'
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    offlineSyncEnabled ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Sync Over Cellular Data</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Upload photos instantly via 5G/LTE when outside</p>
              </div>
              <button
                type="button"
                onClick={() => setSyncOnCellular(!syncOnCellular)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  syncOnCellular
                    ? 'bg-[#1677FF] border-[#1677FF]'
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    syncOnCellular ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
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
              <button
                type="button"
                onClick={() => setPhotoGpsTagging(!photoGpsTagging)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  photoGpsTagging
                    ? 'bg-[#1677FF] border-[#1677FF]'
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    photoGpsTagging ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#171A1F]">Embed Date & Timestamp</h4>
                <p className="text-xs text-[#68707C] mt-0.5">Stamp exact hour/minute for punch list audit trails</p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoTimestampTagging(!photoTimestampTagging)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  photoTimestampTagging
                    ? 'bg-[#1677FF] border-[#1677FF]'
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    photoTimestampTagging ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
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
                    photoQuality === 'optimized' ? 'bg-white text-[#171A1F] shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
                  }`}
                >
                  Fast (1080p)
                </button>
                <button
                  onClick={() => setPhotoQuality('high')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    photoQuality === 'high' ? 'bg-white text-[#171A1F] shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
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
              <button
                type="button"
                onClick={() => setDailyLogAutoSave(!dailyLogAutoSave)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                  dailyLogAutoSave
                    ? 'bg-[#1677FF] border-[#1677FF]'
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
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
  if (subView === 'billing') {
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
          <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Billing & Plans</h2>
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
          <button
            type="button"
            onClick={() => setPushMasterEnabled(!pushMasterEnabled)}
            className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
              pushMasterEnabled
                ? 'bg-[#1677FF] border-[#1677FF]'
                : 'bg-[#E5E7EB] border-[#D1D5DB]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                pushMasterEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
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

                  <button
                    type="button"
                    onClick={() => toggleNotif(item.key as any)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0 p-0.5 border ${
                      isEffective
                        ? 'bg-[#1677FF] border-[#1677FF]'
                        : 'bg-[#E5E7EB] border-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
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

  // ─── MAIN SETTINGS & PROFILE SCREEN (Apple Light Mode) ───
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab ? onNavigateTab('home') : null}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#171A1F] tracking-tight">
              {isFieldStaff ? 'Field Staff Profile' : 'Account & Organization'}
            </h1>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isFieldStaff 
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-purple-50 border-purple-200 text-purple-800'
        }`}>
          {isFieldStaff ? 'Field Superintendent' : 'Company Owner'}
        </span>
      </div>

      {/* ─── 1. HERO PROFILE CARD ─── */}
      <div 
        onClick={() => setSubView('profile')}
        className="p-4 bg-white border border-[#DDE1E7] hover:border-[#1677FF] transition-all rounded-3xl shadow-xs flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="relative w-12 h-12 flex-shrink-0">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#1677FF]/20 group-hover:border-[#1677FF] transition-colors shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors leading-tight">
              {userData.name}
            </h2>
            <p className="text-xs text-[#68707C] truncate mt-0.5 font-medium">
              {userData.email}
            </p>
            <p className="text-xs text-[#1677FF] font-semibold truncate mt-0.5">
              {userData.roleTitle || (isFieldStaff ? 'Lead Superintendent' : 'Company Owner & Principal')}
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] text-[#68707C] group-hover:text-[#171A1F] flex items-center justify-center transition-colors flex-shrink-0 z-10 shadow-xs">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          A. EMPLOYEE / FIELD STAFF SPECIFIC MODULES
         ══════════════════════════════════════════════════════════ */}
      {isFieldStaff ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Field Operations & Safety</p>
          <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">  
            
            {/* Safety Badges & Certs */}
            <button
              onClick={() => setSubView('certifications')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Safety Badges & Certifications</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  4 Valid
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

            {/* Assigned Hardware Gear */}
            <button
              onClick={() => setSubView('equipment')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Wrench className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Assigned Equipment & Tools</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  4 Items
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

            {/* Field Sync & Storage */}
            <button
              onClick={() => setSubView('field-sync')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Wifi className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Field Sync & Offline Storage</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                  Auto-Sync
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

            {/* Emergency Contacts */}
            <button
              onClick={() => setSubView('emergency')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Emergency Site Contacts</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  911 Active
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════
            B. COMPANY OWNER / ADMIN SPECIFIC MODULES
           ══════════════════════════════════════════════════════════ */
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Workspace & Company</p>
          <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">  
            
            {/* Company Profile */}
            <button
              onClick={() => setSubView('company')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Building className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Company Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
            </button>

            {/* Subscription & Billing */}
            <button
              onClick={() => setSubView('billing')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Crown className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Subscription & Plan</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Trial (Active)
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

            {/* Lattice Verified Score */}
            <button
              onClick={() => setSubView('verified')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Lattice Verified™ Score</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Score 33
                </span>
                <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
              </div>
            </button>

            {/* Team Directory Direct Hub */}
            <button
              onClick={() => onNavigateTab?.('team')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Users className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Team Staff & Directory</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
            </button>

            {/* Milestones Hub */}
            <button
              onClick={() => onNavigateTab?.('milestones')}
              className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Flag className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Company Milestone Tracker</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
            </button>

          </div>
        </div>
      )}

      {/* ─── COMMON GROUP: PREFERENCES & SECURITY ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Preferences & Security</p>
        <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">  
          
          {/* Notification Settings */}
          <button
            onClick={() => setSubView('notifications')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Bell className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Push Notifications</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {pushMasterEnabled ? 'Enabled' : 'Muted'}
              </span>
              <ChevronRight className="w-4 h-4 text-[#9DA5B1]" />
            </div>
          </button>

          {/* Security & Password */}
          <button
            onClick={() => setSubView('security')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">
                {isFieldStaff ? 'Security & PIN' : 'Security & Password'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── COMMON GROUP: SUPPORT & GUIDES ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Support & Guides</p>
        <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">  
          
          <button
            onClick={() => setSubView('support')}
            className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <HelpCircle className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">
                {isFieldStaff ? 'Field Guides & Help' : 'Help Center & Guides'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── LEGAL & COMPLIANCE (All 5 Pages Accessible) ─── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#68707C] px-1">Legal & Compliance</p>
        <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">  
          
          {/* Privacy Policy */}
          <button
            onClick={() => setSubView('privacy')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

          {/* Terms of Service */}
          <button
            onClick={() => setSubView('terms')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Terms of Service</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

          {/* AI Disclaimer */}
          <button
            onClick={() => setSubView('ai-disclaimer')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">AI Disclaimer</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

          {/* Subscription Terms */}
          <button
            onClick={() => setSubView('subscription-terms')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <CreditCard className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Subscription Terms</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

          {/* Beta Agreement */}
          <button
            onClick={() => setSubView('beta')}
            className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors text-left cursor-pointer active:bg-[#F2F2F7]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FlaskConical className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#171A1F] truncate">Beta Agreement</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DA5B1] flex-shrink-0" />
          </button>

        </div>
      </div>

      {/* ─── SIGN OUT BUTTON ─── */}
      <button
        onClick={onSignOut}
        className="w-full h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-1 shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>

    </div>
  );
};
