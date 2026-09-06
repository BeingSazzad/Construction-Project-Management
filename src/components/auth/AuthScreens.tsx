import React, { useState, useRef, useEffect } from 'react';
import { LatticeLogo } from '../common/LatticeLogo';
import { Button } from '../common/Button';
import { UserRole } from '../../types';
import {
  Mail, Lock, User, Building, Eye, EyeOff,
  ArrowRight, CheckCircle2, ShieldCheck, Briefcase,
  DollarSign, HardHat, ChevronLeft, KeyRound, RefreshCw,
  ShieldAlert, Check
} from 'lucide-react';

interface AuthScreensProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
  onLoginSuccess: (role: UserRole) => void;
  onStartOnboarding: () => void;
  onNavigateToMode?: (mode: 'signin' | 'signup' | 'forgot') => void;
}

// ─── OTP Input — 6 separate boxes ─────────────────────────────────────────────
const OtpInput: React.FC<{
  value: string[];
  onChange: (v: string[]) => void;
}> = ({ value, onChange }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const next = [...value];
        next[i] = '';
        onChange(next);
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...value];
    pasted.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
    onChange(next);
    const nextIdx = Math.min(pasted.length, 5);
    refs.current[nextIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 rounded-xl border text-center text-base font-black text-[#0F172A] focus:outline-none transition-all bg-white ${
            value[i]
              ? 'border-[#1677FF] bg-[#1677FF]/5 text-[#1677FF]'
              : 'border-[#E2E8F0] focus:border-[#1677FF] focus:bg-[#1677FF]/5'
          }`}
        />
      ))}
    </div>
  );
};

// ─── Password strength bar ────────────────────────────────────────────────────
const StrengthBar: React.FC<{ password: string }> = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-[#1677FF]', 'bg-emerald-500'];

  if (!password) return null;
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-[#E2E8F0]'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#64748B]">Min 8 chars, uppercase, number, symbol</p>
        <span className={`text-[10px] font-bold ${colors[score].replace('bg-', 'text-')}`}>{labels[score]}</span>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialMode = 'signin',
  onLoginSuccess,
  onStartOnboarding
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);

  // Sign in state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up state
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupPass, setSignupPass] = useState('');

  // Forgot / OTP / Reset state
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetError, setResetError] = useState('');

  // Countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Demo accounts
  const demoAccounts = [
    { role: 'pm' as UserRole, name: 'Sarah Johnson', title: 'Project Manager', icon: Briefcase, color: 'text-[#1677FF]', bg: 'bg-blue-50 border-blue-100' },
    { role: 'admin' as UserRole, name: 'Avery Scott', title: 'Admin / Owner', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { role: 'finance' as UserRole, name: 'Michael Chang', title: 'Finance Director', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { role: 'field' as UserRole, name: 'John Smith', title: 'Superintendent', icon: HardHat, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  ];

  const handleSignIn = (e: React.FormEvent) => { e.preventDefault(); onLoginSuccess('pm'); };
  const handleSignUp = (e: React.FormEvent) => { e.preventDefault(); onStartOnboarding(); };

  // Forgot → send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setOtpValues(Array(6).fill(''));
    setOtpError(false);
    setResendTimer(59);
    setForgotStep('otp');
  };

  // OTP → verify (mock: "123456" is correct)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length !== 6) { setOtpError(true); return; }
    // Mock: any 6-digit code works
    setOtpError(false);
    setForgotStep('reset');
  };

  const handleResendOtp = () => {
    setOtpValues(Array(6).fill(''));
    setOtpError(false);
    setResendTimer(59);
  };

  // Reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { setResetError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setResetError('Passwords do not match.'); return; }
    setResetError('');
    setForgotStep('done');
  };

  const goToForgot = () => {
    setForgotStep('email');
    setForgotEmail('');
    setOtpValues(Array(6).fill(''));
    setOtpError(false);
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setAuthMode('forgot');
  };

  // ── Input field shared className
  const inputCls = (extra = '') =>
    `w-full h-11 bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all ${extra}`;

  return (
    <div className="w-full min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-5 font-sans">
      <div className="w-full max-w-[390px] flex flex-col gap-5">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <LatticeLogo size="lg" />
          <p className="text-[12px] font-bold tracking-widest text-[#64748B] uppercase mt-2">
            Build Better. Together.
          </p>
        </div>

        {/* ══════════════ SIGN IN ══════════════ */}
        {authMode === 'signin' && (
          <div className="bg-white border border-[#E2E8F0] shadow-card rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">Welcome back</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Sign in to your construction workspace</p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Work Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="sarah.j@averymarsh.com" className={inputCls()} />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="••••••••••••"
                    className={inputCls('pr-10')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#94A3B8] hover:text-[#0F172A]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#1677FF] focus:ring-0" />
                  <span className="text-[#334155] text-[12px]">Remember me</span>
                </label>
                <button type="button" onClick={goToForgot}
                  className="text-[12px] font-semibold text-[#1677FF] hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <Button variant="primary" type="submit">Sign In to Workspace</Button>
              </div>
            </form>

            {/* Quick Demo */}
            <div className="pt-3 border-t border-[#E2E8F0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block mb-2 text-center">
                Quick Demo Access (1-Tap)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button key={acc.role} type="button" onClick={() => onLoginSuccess(acc.role)}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1677FF]/50 hover:bg-[#F1F5F9] flex items-center gap-2 text-left cursor-pointer transition-all group">
                      <div className={`p-1.5 rounded-lg ${acc.bg} border ${acc.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">
                          {acc.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-[#64748B] truncate font-medium">{acc.title.split(' ')[0]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-1">
              <p className="text-xs text-[#64748B]">
                New company or contractor?{' '}
                <button type="button" onClick={() => setAuthMode('signup')}
                  className="font-bold text-[#1677FF] hover:underline cursor-pointer">
                  Create an account
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ══════════════ SIGN UP ══════════════ */}
        {authMode === 'signup' && (
          <div className="bg-white border border-[#E2E8F0] shadow-card rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setAuthMode('signin')}
                className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div>
                <h2 className="text-base font-extrabold text-[#0F172A]">Create your account</h2>
                <p className="text-xs text-[#64748B]">Start your 14-day full enterprise trial</p>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Sarah Johnson" className={inputCls()} />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Work Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="sarah.j@company.com" className={inputCls()} />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Company Name</label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                    placeholder="Lattice Construction Group" className={inputCls()} />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#334155] block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                  <input type={showSignupPass ? 'text' : 'password'} required value={signupPass}
                    onChange={e => setSignupPass(e.target.value)} placeholder="Min 8 characters"
                    className={inputCls('pr-10')} />
                  <button type="button" onClick={() => setShowSignupPass(!showSignupPass)}
                    className="absolute right-3 text-[#94A3B8] hover:text-[#0F172A]">
                    {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <StrengthBar password={signupPass} />
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input type="checkbox" required defaultChecked
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#1677FF] focus:ring-0 mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-[#64748B] leading-tight">
                  I agree to Lattice's{' '}
                  <span className="text-[#0F172A] underline font-semibold">Terms of Service</span> and{' '}
                  <span className="text-[#0F172A] underline font-semibold">Privacy Policy</span>.
                </span>
              </label>

              <div className="pt-2">
                <Button variant="primary" type="submit">
                  Continue to Setup
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="text-center pt-1">
              <p className="text-xs text-[#64748B]">
                Already registered?{' '}
                <button type="button" onClick={() => setAuthMode('signin')}
                  className="font-bold text-[#1677FF] hover:underline cursor-pointer">Sign in</button>
              </p>
            </div>
          </div>
        )}

        {/* ══════════════ FORGOT PASSWORD ══════════════ */}
        {authMode === 'forgot' && (
          <div className="bg-white border border-[#E2E8F0] shadow-card rounded-2xl p-5 flex flex-col gap-5">

            {/* ── STEP 1: Enter Email ── */}
            {forgotStep === 'email' && (
              <>
                <div>
                  <button onClick={() => setAuthMode('signin')}
                    className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] mb-3 cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                    <KeyRound className="w-5 h-5 text-[#1677FF]" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#0F172A]">Forgot password?</h2>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Enter your work email and we'll send a 6-digit OTP to verify your identity.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-[#334155] block mb-1">Work Email</label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                      <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                        placeholder="sarah.j@averymarsh.com" className={inputCls()} />
                    </div>
                  </div>
                  <div className="pt-1">
                    <Button variant="primary" type="submit">Send OTP Code</Button>
                  </div>
                </form>
              </>
            )}

            {/* ── STEP 2: Enter OTP ── */}
            {forgotStep === 'otp' && (
              <>
                <div>
                  <button onClick={() => setForgotStep('email')}
                    className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] mb-3 cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-5 h-5 text-[#1677FF]" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#0F172A]">Check your email</h2>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    We sent a 6-digit verification code to{' '}
                    <strong className="text-[#0F172A] font-bold">{forgotEmail}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <OtpInput value={otpValues} onChange={v => { setOtpValues(v); setOtpError(false); }} />
                    {otpError && (
                      <p className="text-center text-[12px] text-rose-500 font-medium">
                        Invalid code. Please check your email and try again.
                      </p>
                    )}
                  </div>

                  <Button variant="primary" type="submit">Verify Code</Button>
                </form>

                {/* Resend */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-[#64748B]">
                      Resend code in{' '}
                      <span className="text-[#1677FF] font-bold tabular-nums">0:{String(resendTimer).padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResendOtp}
                      className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer flex items-center gap-1.5 mx-auto">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ── STEP 3: Set New Password ── */}
            {forgotStep === 'reset' && (
              <>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-extrabold text-[#0F172A]">Set new password</h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Create a strong new password for your Lattice account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-[#334155] block mb-1">New Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                      <input type={showNewPass ? 'text' : 'password'} required value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setResetError(''); }}
                        placeholder="Min 8 characters" className={inputCls('pr-10')} />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 text-[#94A3B8] hover:text-[#0F172A]">
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <StrengthBar password={newPassword} />
                  </div>

                  <div>
                    <label className="text-[12px] font-semibold text-[#334155] block mb-1">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                      <input type={showConfirmPass ? 'text' : 'password'} required value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setResetError(''); }}
                        placeholder="Repeat new password" className={inputCls('pr-10')} />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 text-[#94A3B8] hover:text-[#0F172A]">
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Match indicator */}
                    {confirmPassword && (
                      <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-medium ${
                        newPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {newPassword === confirmPassword
                          ? <><Check className="w-3 h-3 stroke-[3]" /> Passwords match</>
                          : <>Passwords do not match</>}
                      </div>
                    )}
                  </div>

                  {resetError && (
                    <p className="text-[12px] text-rose-500 font-medium -mt-1">{resetError}</p>
                  )}

                  <div className="pt-1">
                    <Button variant="primary" type="submit">Reset Password</Button>
                  </div>
                </form>
              </>
            )}

            {/* ── STEP 4: Done ── */}
            {forgotStep === 'done' && (
              <div className="flex flex-col items-center text-center py-4 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">Password reset!</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 max-w-[260px] leading-relaxed">
                    Your password has been updated successfully. You can now sign in with your new password.
                  </p>
                </div>
                <div className="w-full pt-2">
                  <Button variant="primary" onClick={() => { setAuthMode('signin'); setForgotStep('email'); }}>
                    Sign In Now
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
