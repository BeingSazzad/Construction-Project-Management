import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { LatticeLogo } from '../common/LatticeLogo';
import { Button } from '../common/Button';
import { CustomSelect } from '../common/CustomSelect';
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
  <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-card">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[12px] font-bold text-[#0F172A]">Project Overview</span>
      <span className="text-[10px] font-semibold text-[#1677FF] uppercase tracking-wide bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Live</span>
    </div>
    {/* KPI row */}
    <div className="grid grid-cols-3 gap-2 mb-3">
      {[{ v: '72%', l: 'Progress' }, { v: '$2.45M', l: 'Budget' }, { v: '24', l: 'Active Tasks' }].map(k => (
        <div key={k.l} className="bg-[#F8FAFC] rounded-xl p-2 text-center border border-[#E2E8F0]">
          <div className="text-sm font-black text-[#1677FF]">{k.v}</div>
          <div className="text-[10px] text-[#64748B] mt-0.5 font-medium">{k.l}</div>
        </div>
      ))}
    </div>
    {/* Gantt-like bars */}
    <div className="space-y-1.5">
      {[
        { label: 'Structural', w: 88, color: 'bg-emerald-500' },
        { label: 'MEP Rough-In', w: 55, color: 'bg-[#1677FF]' },
        { label: 'Façade Works', w: 33, color: 'bg-amber-500' },
      ].map(b => (
        <div key={b.label} className="flex items-center gap-2">
          <span className="text-[10px] text-[#64748B] w-20 flex-shrink-0">{b.label}</span>
          <div className="flex-1 h-2 bg-[#EEF2F6] rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.w}%` }} />
          </div>
          <span className="text-[10px] font-bold text-[#0F172A] w-7 text-right">{b.w}%</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Mini Preview: Budget / Donut ────────────────────────────────────────────
const BudgetPreview: React.FC = () => (
  <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-card">
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[12px] font-bold text-[#0F172A]">Budget Overview</span>
      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
    </div>
    <div className="flex items-center gap-3 mb-3">
      {/* SVG donut */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
          <circle cx="18" cy="18" r="13" fill="none" stroke="#EEF2F6" strokeWidth="5" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#1677FF" strokeWidth="5"
            strokeDasharray="54 28" strokeLinecap="round" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#6C52FF" strokeWidth="5"
            strokeDasharray="20 62" strokeDashoffset="-54" strokeLinecap="round" />
          <circle cx="18" cy="18" r="13" fill="none" stroke="#10B981" strokeWidth="5"
            strokeDasharray="8 74" strokeDashoffset="-74" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-[#0F172A] leading-none">$2.45M</span>
          <span className="text-[10px] text-[#64748B]">Total</span>
        </div>
      </div>
      {/* Legend */}
      <div className="space-y-1 flex-1">
        {[
          { dot: 'bg-[#1677FF]', label: 'Labor', val: '$980K' },
          { dot: 'bg-violet-500', label: 'Materials', val: '$760K' },
          { dot: 'bg-emerald-500', label: 'Subcontractor', val: '$450K' },
          { dot: 'bg-amber-500', label: 'Equipment', val: '$190K' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${row.dot}`} />
              <span className="text-[10px] text-[#64748B]">{row.label}</span>
            </div>
            <span className="text-[10px] font-bold text-[#0F172A]">{row.val}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Cost vs Actual mini bar */}
    <div className="bg-[#F8FAFC] rounded-xl p-2 border border-[#E2E8F0]">
      <div className="text-[10px] text-[#64748B] mb-1.5">Cost vs Actual</div>
      <div className="flex gap-1 items-end h-7">
        {[60, 80, 50, 90, 70, 55, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
            <div className="w-full bg-blue-100 rounded-sm" style={{ height: `${h * 0.28}px` }} />
            <div className="w-full bg-[#1677FF] rounded-sm" style={{ height: `${h * 0.22}px` }} />
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
    <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E2E8F0]">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#1677FF] to-violet-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-[#0F172A]">Latti AI</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Assistant
          </div>
        </div>
      </div>
      {/* AI bubble */}
      <div className="bg-[#F1F5F9] rounded-xl rounded-tl-sm p-2.5 mb-2 text-[10px] text-[#334155] leading-relaxed border border-[#E2E8F0]">
        Hi Alex! 👋<br />How can I help with your project today?
      </div>
      {/* User pill */}
      <div className="flex justify-end mb-2">
        <div className="bg-[#1677FF] rounded-xl rounded-br-sm px-3 py-1.5 text-[10px] text-white font-semibold max-w-[80%]">
          Which projects are at risk?
        </div>
      </div>
      {/* AI risk response */}
      <div className="bg-[#F1F5F9] rounded-xl rounded-tl-sm p-2.5 text-[10px] text-[#334155] border border-[#E2E8F0] space-y-1.5">
        <p className="leading-relaxed">2 projects are at risk due to schedule delays and budget overruns.</p>
        <div className="bg-white rounded-lg p-1.5 space-y-1 border border-[#E2E8F0]">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wide mb-1">At Risk Projects</div>
          {[
            { name: 'Downtown Tower', color: 'text-rose-600' },
            { name: 'Riverside Office', color: 'text-amber-600' },
          ].map(r => (
            <div key={r.name} className="flex items-center justify-between">
              <span className="text-[10px] text-[#334155] font-medium">{r.name}</span>
              <span className={`text-[10px] font-bold ${r.color}`}>● At Risk</span>
            </div>
          ))}
        </div>
        {!typing ? null : (
          <div className="bg-[#1677FF] text-white text-[10px] font-bold text-center py-1.5 rounded-lg mt-1 cursor-pointer hover:bg-blue-600 transition-colors">
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
  const [companyName, setCompanyName] = useState('Lattice Construction Group');
  const [companySize, setCompanySize] = useState('51 - 200');

  const isWalkthrough = step < 4;    // 0=splash, 1-3=features
  const isSetup = step >= 4;          // 4=role, 5=company, 6=ready

  // ─── Walkthrough ─────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-between p-6 py-10 font-sans select-none relative overflow-hidden bg-gradient-to-b from-white via-[#F7F9FC] to-[#EEF2F6]"
      >
        {/* bg construction silhouette blurred */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
          }}
        />

        {/* Gradient overlay top-to-bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white/95 pointer-events-none" />

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
              className="w-full text-xs font-semibold text-[#64748B] hover:text-[#0F172A] py-2 cursor-pointer"
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
        className="w-full min-h-screen flex flex-col font-sans select-none relative overflow-hidden bg-[#F7F9FC]"
      >
        {/* Ambient glow for current slide */}
        <div
          className="absolute top-0 left-0 right-0 h-64 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${slide.accentColor}, transparent 70%)` }}
        />

        {/* Skip button */}
        <div className="relative z-10 w-full flex justify-end px-5 pt-5">
          <button
            onClick={() => setStep(4)}
            className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-all"
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
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: `${slide.accentColor}15`, border: `1px solid ${slide.accentColor}35` }}
          >
            <Icon className="w-6 h-6" style={{ color: slide.accentColor }} />
          </div>

          {/* Headline */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#0F172A] leading-tight tracking-tight">
              {slide.headline}{' '}
              <span style={{ color: slide.accentColor }}>{slide.highlight}</span>
            </h2>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-[300px] mx-auto font-medium">
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
                  i + 1 === step ? 'w-6 h-2' : 'w-2 h-2 hover:bg-slate-400'
                }`}
                style={{
                  background: i + 1 === step ? slide.accentColor : '#CBD5E1',
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
    <div className="w-full min-h-screen bg-[#F7F9FC] flex flex-col p-5 pt-6 pb-8 font-sans select-none">
      {/* Setup header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setStep(step - 1)}
          className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] flex items-center justify-center cursor-pointer hover:text-[#0F172A] hover:bg-[#F8FAFC]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: setupTotal }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === setupStep ? 'w-6 bg-[#1677FF]' : i < setupStep ? 'w-2 bg-blue-300' : 'w-2 bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>

        <span className="text-[12px] font-bold text-[#64748B]">Step {setupStep + 1}/{setupTotal}</span>
      </div>

      {/* ── STEP 4: Select Role ── */}
      {step === 4 && (
        <div className="flex flex-col flex-1">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Select Your Role</h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
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
                      ? 'border-[#1677FF] bg-[#1677FF]/5 ring-1 ring-[#1677FF]/30'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-200 text-[#1677FF]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#0F172A]">{opt.title}</h3>
                    <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">{opt.desc}</p>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                    isSelected ? 'bg-[#1677FF] border-[#1677FF]' : 'border-[#CBD5E1]'
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

      {/* ── STEP 5: Tell us about your company ── */}
      {step === 5 && (
        <div className="flex flex-col flex-1 max-w-lg mx-auto w-full justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Tell us about your company</h2>
              <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
                This personalizes Latti's estimates and reports for your region and trade.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#334155] mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Company name</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-12 bg-white border border-[#E2E8F0] rounded-xl px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors"
                  placeholder="Acme Custom Homes"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] mb-1.5 flex items-center gap-1.5">
                  <span>🔨</span>
                  <span>What do you build?</span>
                </label>
                <CustomSelect
                  value={companySize}
                  onChange={setCompanySize}
                  options={[
                    'Custom Home Builder',
                    'Remodeler & Renovation',
                    'Commercial General Contractor',
                    'Design-Build Firm',
                    'Residential Developer'
                  ]}
                  size="md"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] mb-1.5 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>State / Region</span>
                </label>
                <input
                  type="text"
                  defaultValue="Texas"
                  className="w-full h-12 bg-white border border-[#E2E8F0] rounded-xl px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors"
                  placeholder="e.g. Texas, Colorado, California"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 6: Choose your plan ── */}
      {step === 6 && (
        <div className="flex flex-col flex-1 max-w-lg mx-auto w-full justify-between">
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Choose your plan</h2>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Start a 14-day free trial — cancel anytime. Or explore the full platform on Beta access.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Plan 1: Base */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3 shadow-card hover:border-[#94A3B8] transition-all">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-[#0F172A]">Base</div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                    For solo contractors and small construction teams getting organized.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-[#0F172A]">$49.99</div>
                    <div className="text-[10px] text-[#64748B]">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold shadow cursor-pointer"
                  >
                    Start trial
                  </button>
                </div>
              </div>

              {/* Plan 2: Pro (MOST POPULAR) */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1677FF] flex items-center justify-between gap-3 shadow-card ring-1 ring-[#1677FF]/20">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0F172A]">Pro</span>
                    <span className="text-[10px] font-black uppercase text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      MOST POPULAR
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                    For active builders managing projects, budgets, trades and clients.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-[#0F172A]">$199.00</div>
                    <div className="text-[10px] text-[#64748B]">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold shadow cursor-pointer"
                  >
                    Start trial
                  </button>
                </div>
              </div>

              {/* Plan 3: Intelligence (COMPLETE AI PLATFORM) */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3 shadow-card hover:border-[#94A3B8] transition-all">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#0F172A]">Intelligence</span>
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      COMPLETE AI PLATFORM
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                    For builders who want BuildScope AI, Deal Analyzer and company-wide Latti intelligence.
                  </p>
                </div>
                <div className="text-right flex items-center gap-3 flex-shrink-0">
                  <div>
                    <div className="text-sm font-black text-[#0F172A]">$349.00</div>
                    <div className="text-[10px] text-[#64748B]">/mo · 14-day trial</div>
                  </div>
                  <button
                    onClick={() => onComplete(selectedRole)}
                    className="px-3.5 py-2 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold shadow cursor-pointer"
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
              className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => onComplete(selectedRole)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#1677FF] border border-[#1677FF]/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
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

