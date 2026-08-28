import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, 
  Smartphone, CheckCircle2, AlertCircle, Key, Check
} from 'lucide-react';

interface SecurityPasswordViewProps {
  onBack: () => void;
}

export const SecurityPasswordView: React.FC<SecurityPasswordViewProps> = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Requirements Check
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const getPasswordStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (!hasMinLength || !hasNumber) {
      setErrorMessage('New password must be at least 8 characters and include a number.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2500);
  };

  const strength = getPasswordStrength();

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#162033]">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Security & Password
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Manage credentials and authentication safety
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
          <span>Password updated successfully! Next login requires new password.</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card 1: Change Password Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Change Account Password</h2>
        </div>

        {/* 1. Current Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">Current Password</label>
          <div className="relative flex items-center">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 pr-10 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. New Password */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-300">New Password</label>
          <div className="relative flex items-center">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 8 characters)"
              className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 pr-10 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center justify-between text-[12px] font-medium text-slate-400">
                <span>Password Strength</span>
                <span className={strength === 3 ? 'text-emerald-400 font-bold' : strength === 2 ? 'text-amber-400 font-bold' : 'text-rose-400'}>
                  {strength === 3 ? 'Strong' : strength === 2 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#080D18] rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full transition-all ${strength >= 1 ? (strength === 3 ? 'bg-emerald-400' : strength === 2 ? 'bg-amber-400' : 'bg-rose-400') : 'bg-slate-800'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength >= 2 ? (strength === 3 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-800'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength === 3 ? 'bg-emerald-400' : 'bg-slate-800'}`} />
              </div>
            </div>
          )}
        </div>

        {/* 3. Confirm New Password */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
          <div className="relative flex items-center">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 pr-10 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <div className="text-[12px] font-semibold mt-0.5 flex items-center gap-1">
              {passwordsMatch ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};
