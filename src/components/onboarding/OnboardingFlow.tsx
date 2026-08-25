import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { LatticeLogo } from '../common/LatticeLogo';
import { Button } from '../common/Button';
import {
  ShieldCheck, Briefcase, DollarSign, HardHat,
  ArrowRight, ChevronLeft, Check, Sparkles, Bot,
  Building2, TrendingUp, Calendar, CheckSquare,
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (selectedRole: UserRole) => void;
  onBackToAuth?: () => void;
}

// ─── Feature Slide Data ─────────────────────────────────────────────────────
const FEATURE_SLIDES = [
  {
    id: 'projects',
    headline: 'Manage Projects',
    highlight: 'with Confidence.',
    sub: 'Plan, track, and deliver construction projects on time and within budget. All in one place.',
    icon: Building2,
    accentColor: '#0066FF',
    preview: 'projects',
  },
  {
    id: 'costs',
    headline: 'Control Costs.',
    highlight: 'Maximize Value.',
    sub: 'Real-time budget tracking, cost insights, and forecasts to keep your projects profitable.',
    icon: DollarSign,
    accentColor: '#6C52FF',
    preview: 'budget',
  },
  {
    id: 'ai',
    headline: 'AI-Powered Insights.',
    highlight: 'Smarter Decisions.',
    sub: 'Latti AI helps you identify risks, get recommendations, and make data-driven decisions faster.',
    icon: Bot,
    accentColor: '#8B5CF6',
    preview: 'latti',
  },
];

// ─── Mini Preview: Projects Dashboard Card ───────────────────────────────────
const ProjectsPreview: React.FC = () => (
  <div className="w-full bg-[#0A1120] border border-[#1A2840] rounded-2xl p-3 shadow-2xl">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[11px] font-bold text-white">Project Overview</span>
      <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Live</span>
    </div>
    {/* KPI row */}
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[{ v: '72%', l: 'Progress' }, { v: '$2.45M', l: 'Budget' }, { v: '24', l: 'Active Tasks' }].map(k => (
        <div key={k.l} className="bg-[#111B2E] rounded-xl p-2 text-center border border-[#1A2840]">
          <div className="text-sm font-black text-blue-400">{k.v}</div>
          <div className="text-[9px] text-slate-400 mt-0.5 font-medium">{k.l}</div>
        </div>
      ))}
    </div>
    {/* Gantt-like bars */}
    <div className="space-y-1.5">
      {[
        { label: 'Structural', w: 88, color: 'bg-emerald-500' },
        { label: 'MEP Rough-In', w: 55, color: 'bg-blue-500' },
        { label: 'Façade Works', w: 33, color: 'bg-amber-500' },
      ].map(b => (
        <div key={b.label} className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 w-20 flex-shrink-0">{b.label}</span>
          <div className="flex-1 h-2 bg-[#1A2840] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.w}%` }} />
          </div>
          <span className="text-[9px] font-bold text-slate-300 w-7 text-right">{b.w}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Mini Preview: Budget / Donut ────────────────────────────────────────────
const BudgetPreview: React.FC = () => (
  <div className="w-full bg-[#0A1120] border border-[#1A2840] rounded-2xl p-3 shadow-2xl">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[11px] font-bold text-white">Budget Overview</span>
      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
    </div>
    <div className="flex items-center gap-3 mb-3">
      {/* SVG donut */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
          <circle cx="18" cy="18" r="13" fill="none" stroke="#1A2840" strokeWidth="5" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#0066FF" strokeWidth="5"
            strokeDasharray="54 28" strokeLinecap="round" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#6C52FF" strokeWidth="5"
            strokeDasharray="20 62" strokeDashoffset="-54" strokeLinecap="round" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#10B981" strokeWidth="5"
            strokeDasharray="8 74" strokeDashoffset="-74" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-black text-white leading-none">$2.45M</span>
          <span className="text-[7px] text-slate-400">Total</span>
        </div>
      </div>
      {/* Legend */}
      <div className="space-y-1 flex-1">
        {[
          { dot: 'bg-blue-500', label: 'Labor', val: '$980K' },
          { dot: 'bg-violet-500', label: 'Materials', val: '$760K' },
          { dot: 'bg-emerald-500', label: 'Subcontractor', val: '$450K' },
          { dot: 'bg-amber-500', label: 'Equipment', val: '$190K' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${row.dot}`} />
              <span className="text-[9px] text-slate-400">{row.label}</span>
            </div>
            <span className="text-[9px] font-bold text-white">{row.val}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Cost vs Actual mini bar */}
    <div className="bg-[#111B2E] rounded-xl p-2 border border-[#1A2840]">
      <div className="text-[9px] text-slate-400 mb-1.5">Cost vs Actual</div>
      <div className="flex gap-1 items-end h-7">
        {[60, 80, 50, 90, 70, 55, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
            <div className="w-full bg-blue-500/30 rounded-sm" style={{ height: `${h * 0.28}px` }} />
            <div className="w-full bg-violet-500 rounded-sm" style={{ height: `${h * 0.22}px` }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Mini Preview: Latti AI Chat ─────────────────────────────────────────────
const LattiPreview: React.FC = () => {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTyping(true), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="w-full bg-[#0A1120] border border-[#1A2840] rounded-2xl p-3 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1A2840]">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-white">Latti AI</div>
          <div className="text-[8px] text-emerald-400 font-semibold flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Assistant
          </div>
        </div>
      </div>
      {/* AI bubble */}
      <div className="bg-[#111B2E] rounded-xl rounded-tl-sm p-2.5 mb-2 text-[10px] text-slate-300 leading-relaxed border border-[#1A2840]">
        Hi Alex! 👋<br />How can I help with your project today?
      </div>
      {/* User pill */}
      <div className="flex justify-end mb-2">
        <div className="bg-blue-600 rounded-xl rounded-br-sm px-3 py-1.5 text-[10px] text-white font-semibold max-w-[80%]">
          Which projects are at risk?
        </div>
      </div>
      {/* AI risk response */}
      <div className="bg-[#111B2E] rounded-xl rounded-tl-sm p-2.5 text-[10px] text-slate-300 border border-[#1A2840] space-y-1.5">
        <p className="leading-relaxed">2 projects are at risk due to schedule delays and budget overruns.</p>
        <div className="bg-[#0A1120] rounded-lg p-1.5 space-y-1 border border-[#1A2840]">
          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wide mb-1">At Risk Projects</div>
          {[
            { name: 'Downtown Tower', color: 'text-rose-400' },
            { name: 'Riverside Office', color: 'text-amber-400' },
          ].map(r => (
            <div key={r.name} className="flex items-center justify-between">
              <span className="text-[9px] text-slate-300">{r.name}</span>
              <span className={`text-[9px] font-bold ${r.color}`}>● At Risk</span>
            </div>
          ))}
        </div>
        {!typing ? null : (
          <div className="bg-blue-600 text-white text-[9px] font-bold text-center py-1 rounded-lg mt-1 cursor-pointer hover:bg-blue-500 transition-colors">
            View Details
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Role Options ────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { id: 'admin' as UserRole, title: 'Company Owner / Admin', desc: 'Full portfolio control & company settings', icon: ShieldCheck },
  { id: 'pm' as UserRole, title: 'Project Manager', desc: 'Manage projects, tasks and team delivery', icon: Briefcase },
  { id: 'finance' as UserRole, title: 'Finance / Budget Manager', desc: 'Track budgets, costs, forecasts', icon: DollarSign },
  { id: 'field' as UserRole, title: 'Field Superintendent', desc: 'View tasks, log photos, update on site', icon: HardHat },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onBackToAuth }) => {
  // Phase A: Feature walkthrough (steps 0–3), Phase B: Setup (steps 4–6)
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('pm');
  const [companyName, setCompanyName] = useState('Avery & Marsh Construction Group');
  const [companySize, setCompanySize] = useState('51 - 200');

  const isWalkthrough = step < 4;    // 0=splash, 1-3=features
  const isSetup = step >= 4;          // 4=role, 5=company, 6=ready

  // ─── Walkthrough ─────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-between p-6 py-10 font-sans select-none relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, #0D1829 0%, #060912 70%)' }}
      >
        {/* bg construction silhouette blurred */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
          }}
        />

        {/* Gradient overlay top-to-bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060912]/90 via-transparent to-[#060912]/95 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center mt-8">
          <LatticeLogo size="hero" layout="stacked" showTagline className="mb-8" />
        </div>

        <div className="relative z-10 w-full space-y-3">
          <Button
            variant="primary"
            onClick={() => setStep(1)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started
          </Button>
          {onBackToAuth && (
            <button
              onClick={onBackToAuth}
              className="w-full text-xs font-semibold text-slate-400 hover:text-white py-2 cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  // Feature slides: steps 1–3
  if (step >= 1 && step <= 3) {
    const slide = FEATURE_SLIDES[step - 1];
    const Icon = slide.icon;
    const totalDots = 3;

    return (
      <div
        className="w-full min-h-screen flex flex-col font-sans select-none relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080F1E 0%, #060912 100%)' }}
      >
        {/* Ambient glow for current slide */}
        <div
          className="absolute top-0 left-0 right-0 h-64 opacity-15 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${slide.accentColor}, transparent 70%)` }}
        />

        {/* Skip button */}
        <div className="relative z-10 w-full flex justify-end px-5 pt-5">
          <button
            onClick={() => setStep(4)}
            className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            Skip
          </button>
        </div>

        {/* ILLUSTRATION PREVIEW */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4">
          <div className="w-full max-w-[320px]">
            {slide.preview === 'projects' && <ProjectsPreview />}
            {slide.preview === 'budget' && <BudgetPreview />}
            {slide.preview === 'latti' && <LattiPreview />}
          </div>
        </div>

        {/* BOTTOM TEXT + DOTS + BUTTON */}
        <div className="relative z-10 px-6 pb-8 pt-4 flex flex-col items-center gap-4">
          {/* Icon badge */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `${slide.accentColor}22`, border: `1px solid ${slide.accentColor}55` }}
          >
            <Icon className="w-6 h-6" style={{ color: slide.accentColor }} />
          </div>

          {/* Headline */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
              {slide.headline}{' '}
              <span style={{ color: slide.accentColor }}>{slide.highlight}</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-[300px] mx-auto font-medium">
              {slide.sub}
            </p>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i + 1)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i + 1 === step ? 'w-6 h-2' : 'w-2 h-2 hover:bg-slate-500'
                }`}
                style={{
                  background: i + 1 === step ? slide.accentColor : '#1E2F4A',
                }}
              />
            ))}
          </div>

          {/* Next / Get Started */}
          <div className="w-full">
            <Button
              variant="primary"
              onClick={() => setStep(step === 3 ? 4 : step + 1)}
              rightIcon={step < 3 ? undefined : <ArrowRight className="w-4 h-4" />}
            >
              {step === 3 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Setup Phase ─────────────────────────────────────────────────────────
  const setupStep = step - 4; // 0=role, 1=company, 2=ready
  const setupTotal = 3;

  return (
    <div className="w-full min-h-screen bg-[#070A12] flex flex-col p-5 pt-6 pb-8 font-sans select-none">
      {/* Setup header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setStep(step - 1)}
          className="w-8 h-8 rounded-xl bg-[#0C121E] border border-[#182438] text-slate-300 flex items-center justify-center cursor-pointer hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: setupTotal }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === setupStep ? 'w-6 bg-blue-500' : i < setupStep ? 'w-2 bg-blue-700' : 'w-2 bg-[#1A263B]'
              }`}
            />
          ))}
        </div>

        <span className="text-[11px] font-bold text-slate-400">Step {setupStep + 1}/{setupTotal}</span>
      </div>

      {/* ── STEP 4: Select Role ── */}
      {step === 4 && (
        <div className="flex flex-col flex-1">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Select Your Role</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              This customizes your dashboard and module access.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedRole === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedRole(opt.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/8 ring-1 ring-blue-500/30'
                      : 'border-[#182438] bg-[#0C121E] hover:border-slate-500/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                      : 'bg-[#0A101B] border-[#1A2840] text-slate-500'
                  }`}>
                    <Icon className="w-4.5 h-4.5 w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white">{opt.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-[#1A2840]'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 mt-auto">
            <Button variant="primary" onClick={() => setStep(5)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Tell us about your company (Matching Screenshot 1) ── */}
      {step === 5 && (
        <div className="flex flex-col flex-1 max-w-lg mx-auto w-full justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Tell us about your company</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                This personalizes Latti's estimates and reports for your region and trade.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company name</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-12 bg-[#0C121E] border border-[#182438] rounded-xl px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 transition-colors"
                  placeholder="Acme Custom Homes"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <span>🔨</span>
                  <span>What do you build?</span>
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full h-12 bg-[#0C121E] border border-[#00D2B4] rounded-xl px-4 text-sm text-white focus:outline-none ring-1 ring-[#00D2B4]/40 cursor-pointer"
                >
                  <option value="Custom Home Builder">Custom Home Builder</option>
                  <option value="Remodeler & Renovation">Remodeler & Renovation</option>
                  <option value="Commercial General Contractor">Commercial General Contractor</option>
                  <option value="Design-Build Firm">Design-Build Firm</option>
                  <option value="Residential Developer">Residential Developer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>State / Region</span>
                </label>
                <input
                  type="text"
                  defaultValue="Texas"
                  className="w-full h-12 bg-[#0C121E] border border-[#182438] rounded-xl px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 transition-colors"
                  placeholder="e.g. Texas, Colorado, California"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-2.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 6: Choose your plan (Matching Screenshot 2) ── */}
      {step === 6 && (
        <div className="flex flex-col flex-1 max-w-lg mx-auto w-full justify-between">
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-white tracking-tight">Choose your plan</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Start a 14-day free trial — cancel anytime. Or explore the full platform on Beta access.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Plan 1: Base */}
              <div className="p-4 rounded-2xl bg-[#0C121E] border border-[#182438] flex items-center justify-between gap-3 shadow-sm hover:border-slate-600 transition-all">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-white">Base</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    For solo contractors and small construction teams getting organized.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-white">$49.99</div>
                    <div className="text-[9px] text-slate-500">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 text-slate-950 text-xs font-black shadow cursor-pointer"
                  >
                    Start trial
                  </button>
                </div>
              </div>

              {/* Plan 2: Pro (MOST POPULAR) */}
              <div className="p-4 rounded-2xl bg-[#0C121E] border border-teal-500/50 flex items-center justify-between gap-3 shadow-md ring-1 ring-teal-500/20">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">Pro</span>
                    <span className="text-[9px] font-black uppercase text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      MOST POPULAR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    For active builders managing projects, budgets, trades and clients.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-white">$199.00</div>
                    <div className="text-[9px] text-slate-500">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 text-slate-950 text-xs font-black shadow cursor-pointer"
                  >
                    Start trial
                  </button>
                </div>
              </div>

              {/* Plan 3: Intelligence (COMPLETE AI PLATFORM) */}
              <div className="p-4 rounded-2xl bg-[#0C121E] border border-[#182438] flex items-center justify-between gap-3 shadow-sm hover:border-slate-600 transition-all">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">Intelligence</span>
                    <span className="text-[9px] font-black uppercase text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      COMPLETE AI PLATFORM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    For builders who want BuildScope AI, Deal Analyzer and company-wide Latti intelligence.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-white">$349.00</div>
                    <div className="text-[9px] text-slate-500">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 text-slate-950 text-xs font-black shadow cursor-pointer"
                  >
                    Start trial
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(5)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => onComplete(selectedRole)}
              className="px-4 py-2.5 rounded-xl bg-[#0C121E] hover:bg-[#141F33] text-teal-400 border border-teal-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore with Beta access</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

