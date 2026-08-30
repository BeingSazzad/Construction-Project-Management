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
    { title: 'First Started', desc: 'Started your first project', Icon: Flag, dot: 'bg-blue-400', ring: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { title: '10 Tasks', desc: 'Completed 10 tasks', Icon: CheckSquare, dot: 'bg-blue-400', ring: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { title: '100 Tasks', desc: 'Completed 100 tasks', Icon: Trophy, dot: 'bg-amber-400', ring: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    { title: 'First Completed', desc: 'Completed your first project', Icon: Building, dot: 'bg-emerald-400', ring: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  ];

  const LOCKED = [
    '10 Projects Completed', 'Budget Boss', 'On-Time Builder',
    'Documentation Pro', 'Client Favorite', 'Lattice Verified', 'Low Risk Builder',
  ];

  function barColor(v: number) {
    if (v >= 70) return 'bg-emerald-400';
    if (v >= 40) return 'bg-amber-400';
    return 'bg-rose-400';
  }
  function textColor(v: number) {
    if (v >= 70) return 'text-emerald-400';
    if (v >= 40) return 'text-amber-400';
    return 'text-rose-400';
  }

  const strokePct = (SCORE / 100) * CIRCUMFERENCE;

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-32 font-sans max-w-[430px] mx-auto" style={{ background: '#070B14', minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1A263E]">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          Account
        </button>
        <span className="text-sm font-bold text-white flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-400" />
          Lattice Verified™
        </span>
        <div className="w-16" />
      </div>

      {/* ─── Hero Card ─── */}
      <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: 'linear-gradient(160deg, #0F1E3A 0%, #090E1A 60%, #07101E 100%)' }}>

        {/* Identity + Gauge row */}
        <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center justify-center text-blue-400 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-black text-white leading-tight truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Foundation III · 1,250 XP</p>
            </div>
          </div>

          {/* SVG Gauge */}
          <div className="flex flex-col items-center flex-shrink-0 -mt-1">
            <div className="relative w-[68px] h-[68px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1A263E" strokeWidth="2.8" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="#EF4444" strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray={`${strokePct} ${CIRCUMFERENCE}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[17px] font-black text-white leading-none">{SCORE}</span>
                <span className="text-[9px] text-slate-400 font-semibold">/100</span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Verified Score</span>
          </div>
        </div>

        {/* Risk Banner */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-2xl flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-rose-400">High Risk · 52 points needed for Verified™</span>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 mt-3 border-t border-[#141F33] divide-x divide-[#141F33]">
          {[
            { Icon: FolderKanban, value: '11', label: 'Projects', color: 'text-blue-400' },
            { Icon: Building, value: '6', label: 'Completed', color: 'text-emerald-400' },
            { Icon: CheckSquare, value: '122', label: 'Tasks', color: 'text-blue-400' },
            { Icon: DollarSign, value: '$1.8M', label: 'Volume', color: 'text-amber-400' },
          ].map(({ Icon, value, label, color }) => (
            <div key={label} className="flex flex-col items-center py-3 gap-0.5">
              <Icon className={`w-3.5 h-3.5 mb-1 ${color}`} />
              <span className="text-[13px] font-black text-white leading-none">{value}</span>
              <span className="text-[10px] text-slate-500 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="grid grid-cols-4 gap-0.5 p-1 rounded-2xl border border-[#1A263E]" style={{ background: '#0D1424' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate px-1 ${activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════ TAB 1: PERFORMANCE ══════ */}
      {activeTab === 'performance' && (
        <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
          <div className="px-4 py-3 border-b border-[#141F33] flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Performance Metrics</span>
          </div>
          {METRICS.map((m, i) => (
            <div key={m.label} className={`px-4 py-3 flex items-center justify-between ${i < METRICS.length - 1 ? 'border-b border-[#141F33]' : ''}`}>
              <span className="text-[13px] text-slate-300 font-medium">{m.label}</span>
              <span className={`text-[13px] font-black ${m.good ? 'text-emerald-400' : 'text-rose-400'}`}>{m.raw}</span>
            </div>
          ))}
        </div>
      )}

      {/* ══════ TAB 2: SCORE BREAKDOWN ══════ */}
      {activeTab === 'breakdown' && (
        <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
          <div className="px-4 py-3 border-b border-[#141F33] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Score Breakdown</span>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4">
            {BREAKDOWN.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-slate-300 font-medium">
                    {item.label}
                    <span className="text-slate-600 ml-1.5 text-[11px]">{item.weight}</span>
                  </span>
                  <span className={`text-[13px] font-black ${textColor(item.value)}`}>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#0A1020] overflow-hidden">
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

          <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
            <div className="px-4 py-3 border-b border-[#141F33] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current vs Target</span>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3.5">
              {PATH.map(item => {
                const pct = Math.min(100, (item.current / item.target) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] text-slate-300 font-medium">
                        {item.label}
                        <span className="text-slate-600 ml-1.5 text-[11px]">{item.weight}</span>
                      </span>
                      <span className="text-[13px] font-bold text-white">
                        {item.current}<span className="text-slate-500 font-normal text-[11px]">/{item.target}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#0A1020] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${pct >= 90 ? 'bg-emerald-400' : pct >= 55 ? 'bg-blue-500' : 'bg-rose-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
            <div className="px-4 py-3 border-b border-[#141F33]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Biggest Gains Available</span>
            </div>
            {GAINS.map((g, i) => (
              <div key={g.title} className={`px-4 py-3 flex items-start gap-3 justify-between ${i < GAINS.length - 1 ? 'border-b border-[#141F33]' : ''}`}>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-white">{g.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
                <span className="flex-shrink-0 text-[11px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
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
          <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
            <div className="px-4 py-3 border-b border-[#141F33] flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unlocked</span>
              <span className="ml-auto text-[11px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">4</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#141F33]">
              {UNLOCKED.map(({ title, desc, Icon, ring }) => {
                const [bg, border, text] = ring.split(' ');
                return (
                  <div key={title} className="bg-[#0D1424] px-3 py-4 flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${bg} ${border} ${text}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">{title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Locked list */}
          <div className="rounded-3xl overflow-hidden border border-[#1A263E]" style={{ background: '#0D1424' }}>
            <div className="px-4 py-3 border-b border-[#141F33] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Locked</span>
              <span className="ml-auto text-[11px] font-bold text-slate-500 bg-[#090E1A] border border-[#1A263E] px-2 py-0.5 rounded-full">{LOCKED.length}</span>
            </div>
            {LOCKED.map((name, i) => (
              <div key={name} className={`px-4 py-2.5 flex items-center gap-3 opacity-40 ${i < LOCKED.length - 1 ? 'border-b border-[#141F33]' : ''}`}>
                <div className="w-7 h-7 rounded-xl bg-[#090E1A] border border-[#1A263E] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-3 h-3 text-slate-500" />
                </div>
                <span className="text-[13px] text-slate-400 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
