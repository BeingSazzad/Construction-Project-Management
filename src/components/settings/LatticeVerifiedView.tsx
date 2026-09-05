import React, { useState } from 'react';
import { User } from '../../types';
import {
  ChevronLeft, Award, ShieldAlert,
  TrendingUp, Lock, Trophy, Flag, Building,
  CheckSquare, FolderKanban, DollarSign,
  Sparkles, ShieldCheck
} from 'lucide-react';

interface LatticeVerifiedViewProps {
  currentUser: User;
  onBack: () => void;
}

type TabType = 'performance' | 'breakdown' | 'path' | 'achievements';

const SCORE = 33;
const CIRCUMFERENCE = 2 * Math.PI * 15.5; // r=15.5

export const LatticeVerifiedView: React.FC<LatticeVerifiedViewProps> = ({ currentUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('performance');

  const TABS: { id: TabType; label: string }[] = [
    { id: 'performance', label: 'Performance' },
    { id: 'breakdown', label: 'Score' },
    { id: 'path', label: 'Path to 85+' },
    { id: 'achievements', label: 'Badges' },
  ];

  const METRICS = [
    { label: 'Schedule Accuracy', raw: '58%', good: true, neutral: false },
    { label: 'Budget Accuracy', raw: '0%', good: false, neutral: false },
    { label: 'On-Time Completion', raw: '100%', good: true, neutral: false },
    { label: 'Under-Budget Rate', raw: '100%', good: true, neutral: false },
    { label: 'Documentation Score', raw: '0%', good: false, neutral: false },
    { label: 'Avg Client Rating', raw: '4.2 ★', good: true, neutral: false },
    { label: 'Avg Budget Variance', raw: '−100%', good: false, neutral: false },
    { label: 'Avg Schedule Variance', raw: '−21d', good: false, neutral: false },
  ];

  const BREAKDOWN = [
    { label: 'Schedule Accuracy', weight: '25%', value: 58 },
    { label: 'Budget Accuracy', weight: '25%', value: 0 },
    { label: 'Completion Rate', weight: '15%', value: 55 },
    { label: 'Documentation', weight: '15%', value: 0 },
    { label: 'Client Satisfaction', weight: '10%', value: 84 },
    { label: 'Activity/Consistency', weight: '10%', value: 18 },
  ];

  const GAINS = [
    { title: 'Budget Accuracy', pts: '+21.3 pts', desc: 'Track committed vs actual costs on every budget line.' },
    { title: 'Documentation', pts: '+12 pts', desc: 'Upload drawings, photos and daily logs to each project.' },
    { title: 'Schedule Accuracy', pts: '+6.8 pts', desc: 'Mark tasks done on schedule and log daily field reports.' },
  ];

  const PATH = [
    { label: 'Schedule Accuracy', weight: '25%', current: 58, target: 85 },
    { label: 'Budget Accuracy', weight: '25%', current: 0, target: 85 },
    { label: 'Completion Rate', weight: '15%', current: 55, target: 85 },
    { label: 'Documentation', weight: '15%', current: 0, target: 80 },
    { label: 'Client Satisfaction', weight: '10%', current: 84, target: 90 },
    { label: 'Activity/Consistency', weight: '10%', current: 18, target: 70 },
  ];

  const UNLOCKED = [
    { title: 'First Started', desc: 'Started your first project', Icon: Flag, dot: 'bg-blue-600', ring: 'bg-blue-50 border-blue-200 text-[#1677FF]' },
    { title: '10 Tasks', desc: 'Completed 10 tasks', Icon: CheckSquare, dot: 'bg-blue-600', ring: 'bg-blue-50 border-blue-200 text-[#1677FF]' },
    { title: '100 Tasks', desc: 'Completed 100 tasks', Icon: Trophy, dot: 'bg-amber-600', ring: 'bg-amber-50 border-amber-200 text-amber-700' },
    { title: 'First Completed', desc: 'Completed your first project', Icon: Building, dot: 'bg-emerald-600', ring: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  ];

  const LOCKED = [
    '10 Projects Completed', 'Budget Boss', 'On-Time Builder',
    'Documentation Pro', 'Client Favorite', 'Lattice Verified', 'Low Risk Builder',
  ];

  function barColor(v: number) {
    if (v >= 70) return 'bg-emerald-500';
    if (v >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  }
  function textColor(v: number) {
    if (v >= 70) return 'text-emerald-600';
    if (v >= 40) return 'text-amber-600';
    return 'text-rose-600';
  }

  const strokePct = (SCORE / 100) * CIRCUMFERENCE;

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-32 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          Account
        </button>
        <span className="text-sm font-bold text-[#171A1F] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#1677FF]" />
          Lattice Verified™
        </span>
        <div className="w-16" />
      </div>

      {/* ─── Hero Card ─── */}
      <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs">

        {/* Identity + Gauge row */}
        <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-blue-200 flex items-center justify-center text-[#1677FF] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-black text-[#171A1F] leading-tight truncate">{currentUser.name}</p>
              <p className="text-xs text-[#68707C] font-medium mt-0.5">Foundation III · 1,250 XP</p>
            </div>
          </div>

          {/* SVG Gauge */}
          <div className="flex flex-col items-center flex-shrink-0 -mt-1">
            <div className="relative w-[68px] h-[68px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#EAEDF1" strokeWidth="2.8" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="#EF4444" strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray={`${strokePct} ${CIRCUMFERENCE}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-[#171A1F] leading-none">{SCORE}</span>
                <span className="text-[10px] text-[#68707C] font-semibold">/100</span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#68707C] mt-1">Verified Score</span>
          </div>
        </div>

        {/* Risk Banner */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-2xl flex items-center gap-2 bg-rose-50 border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span className="text-xs font-bold text-rose-700">High Risk · 52 points needed for Verified™</span>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 mt-3 border-t border-[#EAEDF1] divide-x divide-[#EAEDF1]">
          {[
            { Icon: FolderKanban, value: '11', label: 'Projects', color: 'text-[#1677FF]' },
            { Icon: Building, value: '6', label: 'Completed', color: 'text-emerald-600' },
            { Icon: CheckSquare, value: '122', label: 'Tasks', color: 'text-[#1677FF]' },
            { Icon: DollarSign, value: '$1.8M', label: 'Volume', color: 'text-amber-600' },
          ].map(({ Icon, value, label, color }) => (
            <div key={label} className="flex flex-col items-center py-3 gap-0.5">
              <Icon className={`w-3.5 h-3.5 mb-1 ${color}`} />
              <span className="text-sm font-black text-[#171A1F] leading-none">{value}</span>
              <span className="text-[10px] text-[#68707C] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="grid grid-cols-4 gap-0.5 p-1 rounded-2xl border border-[#DDE1E7] bg-[#F2F2F7]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate px-1 ${
              activeTab === tab.id
                ? 'bg-white text-[#171A1F] shadow-xs'
                : 'text-[#68707C] hover:text-[#171A1F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════ TAB 1: PERFORMANCE ══════ */}
      {activeTab === 'performance' && (
        <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs divide-y divide-[#EAEDF1]">
          <div className="px-4 py-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#68707C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Performance Metrics</span>
          </div>
          {METRICS.map((m) => (
            <div key={m.label} className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[#171A1F] font-medium">{m.label}</span>
              <span className={`text-sm font-black ${m.good ? 'text-emerald-600' : 'text-rose-600'}`}>{m.raw}</span>
            </div>
          ))}
        </div>
      )}

      {/* ══════ TAB 2: SCORE BREAKDOWN ══════ */}
      {activeTab === 'breakdown' && (
        <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs">
          <div className="px-4 py-3 border-b border-[#EAEDF1] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#68707C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Score Breakdown</span>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4">
            {BREAKDOWN.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#171A1F] font-medium">
                    {item.label}
                    <span className="text-[#68707C] ml-1.5 text-xs">{item.weight}</span>
                  </span>
                  <span className={`text-sm font-black ${textColor(item.value)}`}>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(item.value)} transition-all duration-700`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ TAB 3: PATH TO 85+ ══════ */}
      {activeTab === 'path' && (
        <div className="flex flex-col gap-3">

          <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs">
            <div className="px-4 py-3 border-b border-[#EAEDF1] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#68707C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Current vs Target</span>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3.5">
              {PATH.map(item => {
                const pct = Math.min(100, (item.current / item.target) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#171A1F] font-medium">
                        {item.label}
                        <span className="text-[#68707C] ml-1.5 text-xs">{item.weight}</span>
                      </span>
                      <span className="text-sm font-bold text-[#171A1F]">
                        {item.current}<span className="text-[#68707C] font-normal text-xs">/{item.target}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${pct >= 90 ? 'bg-emerald-500' : pct >= 55 ? 'bg-[#1677FF]' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs divide-y divide-[#EAEDF1]">
            <div className="px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Biggest Gains Available</span>
            </div>
            {GAINS.map((g) => (
              <div key={g.title} className="px-4 py-3 flex items-start gap-3 justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#171A1F]">{g.title}</p>
                  <p className="text-xs text-[#68707C] mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {g.pts}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ TAB 4: ACHIEVEMENTS ══════ */}
      {activeTab === 'achievements' && (
        <div className="flex flex-col gap-3">

          {/* Unlocked grid */}
          <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs">
            <div className="px-4 py-3 border-b border-[#EAEDF1] flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Unlocked</span>
              <span className="ml-auto text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">4</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#EAEDF1]">
              {UNLOCKED.map(({ title, desc, Icon, ring }) => (
                <div key={title} className="bg-white px-3 py-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${ring}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#171A1F]">{title}</p>
                    <p className="text-[10px] text-[#68707C] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked list */}
          <div className="rounded-3xl overflow-hidden border border-[#DDE1E7] bg-white shadow-xs divide-y divide-[#EAEDF1]">
            <div className="px-4 py-3 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#68707C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Locked</span>
              <span className="ml-auto text-xs font-bold text-[#68707C] bg-[#F2F2F7] border border-[#DDE1E7] px-2 py-0.5 rounded-full">{LOCKED.length}</span>
            </div>
            {LOCKED.map((name) => (
              <div key={name} className="px-4 py-2.5 flex items-center gap-3 opacity-60">
                <div className="w-7 h-7 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-3 h-3 text-[#9DA5B1]" />
                </div>
                <span className="text-sm text-[#68707C] font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
