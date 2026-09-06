import React, { useState } from 'react';
import { UserRole } from '../../types';
import { LatticeLogo } from '../common/LatticeLogo';
import { Button } from '../common/Button';
import { CustomSelect } from '../common/CustomSelect';
import {
  ShieldCheck, Briefcase, DollarSign, HardHat,
  ArrowRight, ChevronLeft, Check, Sparkles,
  BarChart2, FileText, Users2,
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (selectedRole: UserRole) => void;
  onBackToAuth?: () => void;
}

const ROLE_OPTIONS = [
  { id: 'admin' as UserRole,   title: 'Company Owner / Admin',   desc: 'Full portfolio control & company settings', icon: ShieldCheck },
  { id: 'pm' as UserRole,      title: 'Project Manager',          desc: 'Manage projects, tasks and team delivery',  icon: Briefcase },
  { id: 'finance' as UserRole, title: 'Finance / Budget Manager', desc: 'Track budgets, costs, forecasts',           icon: DollarSign },
  { id: 'field' as UserRole,   title: 'Field Superintendent',     desc: 'View tasks, log photos, update on site',   icon: HardHat },
];

const ChecklistIllustration: React.FC = () => (
  <div className="flex items-center justify-center w-[200px] h-[200px] relative mx-auto">
    <div className="w-44 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] px-4 py-3.5 relative z-10">
      {[
        { done: true,  text: 'Foundation Inspection' },
        { done: true,  text: 'MEP Rough-In Review' },
        { done: false, text: 'Framing Sign-Off' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 py-[7px]">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#1677FF]' : 'border-2 border-[#CBD5E1]'}`}>
            {item.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
          <span className={`text-[11px] font-medium leading-tight ${item.done ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'}`}>{item.text}</span>
        </div>
      ))}
    </div>
    <div className="absolute top-0 right-0 w-11 h-11 bg-[#EAF3FF] rounded-2xl flex items-center justify-center shadow-md border border-[#BFDBFE] z-20">
      <svg className="w-5 h-5 text-[#1677FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <div className="absolute bottom-1 left-1 w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-[#E2E8F0] z-20">
      <svg className="w-5 h-5 text-[#1677FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  </div>
);

const AlertIllustration: React.FC = () => (
  <div className="flex items-center justify-center w-[200px] h-[200px] relative mx-auto">
    <div className="w-36 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 relative z-10">
      <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-2.5 w-4/5" />
      <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-2.5" />
      <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-2.5 w-3/5" />
      <div className="h-1.5 bg-[#E2E8F0] rounded-full w-4/5" />
    </div>
    <div className="absolute top-2 right-0 w-16 h-16 bg-[#FFF0F0] rounded-full flex items-center justify-center shadow-md border border-[#FECACA] z-20">
      <svg className="w-9 h-9 text-[#E5484D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 5c-.77-.833-2.194-.833-2.964 0L3.34 16.5C2.57 18.333 3.532 20 5.07 20z" />
      </svg>
    </div>
    <div className="absolute bottom-0 left-4 w-12 h-12 bg-[#FFF7E6] rounded-2xl flex items-center justify-center shadow border border-[#FDE68A] z-20">
      <svg className="w-7 h-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  </div>
);

const AIIllustration: React.FC = () => (
  <div className="flex flex-col items-center gap-5 py-2">
    <div className="relative">
      <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-dashed border-[#93C5FD] opacity-60" />
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#EAF3FF] via-white to-[#DDD6FE] flex items-center justify-center shadow-lg border border-[#BFDBFE]">
        <Sparkles className="w-11 h-11 text-[#1677FF]" />
      </div>
    </div>
    <div className="flex items-start gap-4">
      {[
        { Icon: BarChart2, label: 'Smarter\nInsights' },
        { Icon: FileText,  label: 'Faster\nDecisions' },
        { Icon: Users2,    label: 'Stronger\nProjects' },
      ].map(({ Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center shadow-sm">
            <Icon className="w-5 h-5 text-[#1677FF]" />
          </div>
          <span className="text-[10px] font-semibold text-[#64748B] text-center leading-tight whitespace-pre-line">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const SLIDES = [
  {
    step: '01',
    headline: 'Keep Every Project',
    highlight: 'Moving',
    sub: 'Track progress, upcoming work, responsibilities, and important project activity — all in one place.',
    Illustration: ChecklistIllustration,
  },
  {
    step: '02',
    headline: 'Know What Needs',
    highlight: 'Attention',
    sub: 'Stay ahead of deadlines, inspections, budget concerns, and weather that may affect the jobsite.',
    Illustration: AlertIllustration,
  },
  {
    step: '03',
    headline: 'Stay Ahead',
    highlight: 'with Latti',
    sub: 'Get clear daily briefings and intelligent insights so you know what needs action next.',
    Illustration: AIIllustration,
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onBackToAuth }) => {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('pm');
  const [companyName, setCompanyName] = useState('Lattice Construction Group');
  const [companySize, setCompanySize] = useState('51 - 200');

  if (step === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-between px-5 py-12 font-sans select-none relative overflow-hidden bg-gradient-to-b from-white via-[#F7F9FC] to-[#EEF2F6]">
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center gap-4">
          <LatticeLogo size="hero" layout="stacked" showTagline className="mb-2" />
          <p className="text-sm font-medium text-[#64748B] mt-2 leading-relaxed">
            Projects. People. Progress.<br />All in one place.
          </p>
        </div>
        <div className="relative z-10 w-full flex flex-col gap-3">
          <Button variant="primary" onClick={() => setStep(1)} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Get Started
          </Button>
          {onBackToAuth && (
            <button onClick={onBackToAuth} className="w-full text-xs font-semibold text-[#64748B] hover:text-[#0F172A] py-2 cursor-pointer transition-colors">
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step >= 1 && step <= 3) {
    const slide = SLIDES[step - 1];
    const { Illustration } = slide;
    const isLast = step === 3;

    return (
      <div className="w-full min-h-screen flex flex-col font-sans select-none bg-[#F8FAFC]">
        <div className="w-full flex items-center justify-between px-5 pt-5">
          <div className="w-9 h-9 rounded-full border-2 border-[#1677FF] flex items-center justify-center">
            <span className="text-[11px] font-black text-[#1677FF] tracking-tight">{slide.step}</span>
          </div>
          <button onClick={() => setStep(4)} className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-all">
            Skip
          </button>
        </div>

        <div className="px-5 pt-5 pb-4">
          <h2 className="text-[28px] font-black text-[#0F172A] leading-tight tracking-tight">
            {slide.headline}{' '}
            <span className="text-[#1677FF]">{slide.highlight}</span>
          </h2>
          <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed font-medium max-w-[310px]">
            {slide.sub}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-4">
          <Illustration />
        </div>

        <div className="px-5 pb-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i + 1)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i + 1 === step ? 'w-5 h-2.5 bg-[#1677FF]' : 'w-2.5 h-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                }`}
              />
            ))}
          </div>
          <div className="w-full">
            <Button variant="primary" onClick={() => setStep(isLast ? 4 : step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              {isLast ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const setupStep = step - 4;
  const setupTotal = 3;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col p-5 pt-6 pb-8 font-sans select-none">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setStep(step - 1)} className="w-9 h-9 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] flex items-center justify-center cursor-pointer hover:bg-[#E2E8F0] transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: setupTotal }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === setupStep ? 'w-7 bg-[#1677FF]' : i < setupStep ? 'w-2.5 bg-[#93C5FD]' : 'w-2.5 bg-[#E2E8F0]'}`} />
          ))}
        </div>
        <span className="text-[12px] font-bold text-[#94A3B8]">{setupStep + 1}/{setupTotal}</span>
      </div>

      {step === 4 && (
        <div className="flex flex-col flex-1">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Select Your Role</h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">This personalizes your dashboard and module access.</p>
          </div>
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedRole === opt.id;
              return (
                <div key={opt.id} onClick={() => setSelectedRole(opt.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${isSelected ? 'border-[#1677FF] bg-[#EAF3FF]/40 shadow-sm' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#94A3B8]'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-[#1677FF] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold leading-tight ${isSelected ? 'text-[#0F172A]' : 'text-[#334155]'}`}>{opt.title}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 font-medium leading-snug">{opt.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-[#1677FF] bg-[#1677FF]' : 'border-[#CBD5E1]'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5">
            <Button variant="primary" onClick={() => setStep(5)} rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col flex-1">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">About Your Company</h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">Helps us personalize your experience and reporting defaults.</p>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Apex Construction Group"
                className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Company Size</label>
              <CustomSelect value={companySize} onChange={setCompanySize} options={['1 - 10', '11 - 50', '51 - 200', '201 - 500', '500+']} size="md" fullWidth />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Primary Project Type</label>
              <CustomSelect value="Residential" onChange={() => {}} options={['Residential', 'Commercial', 'Mixed-Use', 'Industrial', 'Infrastructure']} size="md" fullWidth />
            </div>
          </div>
          <div className="mt-5">
            <Button variant="primary" onClick={() => setStep(6)} rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="flex flex-col flex-1 items-center text-center pt-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1677FF] to-[#0F5FD7] flex items-center justify-center shadow-xl mb-5">
            <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight leading-tight mb-3">You're all set!</h2>
          <p className="text-sm text-[#64748B] font-medium leading-relaxed max-w-[280px] mb-6">
            Welcome to Lattice. Your workspace is ready — start with your projects, tasks, or let Latti guide you.
          </p>
          <div className="w-full bg-[#EAF3FF] border border-[#BFDBFE] rounded-2xl p-3.5 flex items-center gap-3 mb-4 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#1677FF] flex items-center justify-center flex-shrink-0">
              {(() => {
                const role = ROLE_OPTIONS.find(r => r.id === selectedRole);
                const Icon = role ? role.icon : ShieldCheck;
                return <Icon className="w-5 h-5 text-white" />;
              })()}
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">{ROLE_OPTIONS.find(r => r.id === selectedRole)?.title}</div>
              <div className="text-[11px] text-[#64748B] font-medium">{companyName}</div>
            </div>
          </div>
          <div className="w-full mt-auto pt-4">
            <Button variant="primary" onClick={() => onComplete(selectedRole)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Lattice
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;