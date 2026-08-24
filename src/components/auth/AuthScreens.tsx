import React, { useState } from 'react';
import { LatticeLogo } from '../common/LatticeLogo';
import { Button } from '../common/Button';
import { UserRole } from '../../types';
import { 
  Mail, Lock, User, Building, Eye, EyeOff, 
  ArrowRight, CheckCircle2, ShieldCheck, Briefcase, 
  DollarSign, HardHat, ChevronLeft 
} from 'lucide-react';

interface AuthScreensProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
  onLoginSuccess: (role: UserRole) => void;
  onStartOnboarding: () => void;
  onNavigateToMode?: (mode: 'signin' | 'signup' | 'forgot') => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialMode = 'signin',
  onLoginSuccess,
  onStartOnboarding
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Demo accounts for fast 1-tap testing
  const demoAccounts = [
    { role: 'pm' as UserRole, name: 'Sarah Johnson', title: 'Senior Project Manager', icon: Briefcase, color: 'text-blue-400' },
    { role: 'admin' as UserRole, name: 'Alex Chen', title: 'Company Owner / Admin', icon: ShieldCheck, color: 'text-purple-400' },
    { role: 'finance' as UserRole, name: 'Michael Chang', title: 'Finance Director', icon: DollarSign, color: 'text-emerald-400' },
    { role: 'field' as UserRole, name: 'John Smith', title: 'Lead Superintendent', icon: HardHat, color: 'text-amber-400' },
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Project Manager role for Sarah Johnson
    onLoginSuccess('pm');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Go directly to guided onboarding flow
    onStartOnboarding();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResetSent(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#070A12] flex flex-col items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[390px] flex flex-col gap-5">
        {/* Top Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <LatticeLogo size="lg" />
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-2">
            Build Better. Together.
          </p>
        </div>

        {/* 1. SIGN IN SCREEN */}
        {authMode === 'signin' && (
          <div className="card-dark p-5 bg-[#0C121E] border-[#182438] shadow-2xl rounded-2xl flex flex-col gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Welcome back</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to your construction workspace</p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-3">
              {/* Work Email Field */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.j@averymarsh.com"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Link */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#070A12] border-[#182438] text-blue-500 focus:ring-0"
                  />
                  <span className="text-slate-300 text-[11px]">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setResetSent(false); }}
                  className="text-[11px] font-semibold text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Strict 48px Bold Sign In Button */}
              <div className="pt-2">
                <Button variant="primary" type="submit">
                  Sign In to Workspace
                </Button>
              </div>
            </form>

            {/* Quick Demo 1-Click Role Logins */}
            <div className="pt-3 border-t border-[#182338]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                Or Quick Demo Access (1-Tap)
              </span>

              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => onLoginSuccess(acc.role)}
                      className="p-2.5 rounded-xl bg-[#070A12] border border-[#182438] hover:border-blue-500/50 flex items-center gap-2 text-left cursor-pointer transition-all group"
                    >
                      <div className={`p-1.5 rounded-lg bg-[#0F1726] border border-[#1E2B42] ${acc.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {acc.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate font-medium">
                          {acc.title.split(' ')[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                New company or contractor?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 2. SIGN UP / REGISTRATION SCREEN */}
        {authMode === 'signup' && (
          <div className="card-dark p-5 bg-[#0C121E] border-[#182438] shadow-2xl rounded-2xl flex flex-col gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Create your account</h2>
              <p className="text-xs text-slate-400 mt-0.5">Start your 14-day full enterprise trial</p>
            </div>

            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Johnson"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.j@company.com"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company Name</label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Avery & Marsh Construction Group"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Must be at least 8 characters"
                    className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-4 h-4 rounded bg-[#070A12] border-[#182438] text-blue-500 focus:ring-0 mt-0.5"
                />
                <span className="text-[11px] text-slate-400 leading-tight">
                  I agree to Lattice's <span className="text-slate-200 underline">Terms of Service</span> and <span className="text-slate-200 underline">Privacy Policy</span>.
                </span>
              </label>

              {/* Strict 48px Bold Sign Up Button */}
              <div className="pt-2">
                <Button variant="primary" type="submit">
                  Continue to Setup
                </Button>
              </div>
            </form>

            {/* Switch to Sign In */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-blue-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 3. FORGOT PASSWORD SCREEN */}
        {authMode === 'forgot' && (
          <div className="card-dark p-5 bg-[#0C121E] border-[#182438] shadow-2xl rounded-2xl flex flex-col gap-4">
            {!resetSent ? (
              <>
                <div>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                  <h2 className="text-base font-extrabold text-white">Reset password</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter your work email address and we'll send you a password recovery link.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work Email</label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.j@averymarsh.com"
                        className="w-full h-11 bg-[#070A12] border border-[#182438] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" type="submit">
                      Send Reset Instructions
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Success confirmation state */
              <div className="flex flex-col items-center text-center py-3 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recovery link sent</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                    We've emailed instructions to <strong className="text-white">{email || 'your email'}</strong>. Please check your inbox.
                  </p>
                </div>

                <div className="w-full pt-3">
                  <Button variant="primary" onClick={() => setAuthMode('signin')}>
                    Return to Sign In
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
