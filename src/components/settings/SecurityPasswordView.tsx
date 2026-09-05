import React, { useState } from 'react';
import { 
  ArrowLeft, Key, ShieldCheck, Eye, EyeOff, 
  Check, AlertCircle, CheckCircle2 
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

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSuccess(false);

    if (!currentPassword) {
      setErrorMessage('Please enter your current account password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    // Success Simulation
    setIsSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const strength = getPasswordStrength();

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#EAEDF1]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#171A1F] tracking-tight">
            Security & Password
          </h1>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">
            Manage credentials and authentication safety
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 text-emerald-600" />
          <span>Password updated successfully! Next login requires new password.</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card: Change Password Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#1677FF]" />
          <h2 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">Change Account Password</h2>
        </div>

        {/* 1. Current Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#68707C]">Current Password</label>
          <div className="relative flex items-center">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 pr-10 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 text-[#9DA5B1] hover:text-[#171A1F] transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. New Password */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-semibold text-[#68707C]">New Password</label>
          <div className="relative flex items-center">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 8 characters)"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 pr-10 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 text-[#9DA5B1] hover:text-[#171A1F] transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center justify-between text-[12px] font-medium text-[#68707C]">
                <span>Password Strength</span>
                <span className={strength === 3 ? 'text-emerald-600 font-bold' : strength === 2 ? 'text-amber-600 font-bold' : 'text-rose-600'}>
                  {strength === 3 ? 'Strong' : strength === 2 ? 'Medium' : 'Weak'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 rounded-full transition-all ${strength >= 1 ? (strength === 3 ? 'bg-emerald-500' : strength === 2 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength >= 2 ? (strength === 3 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength === 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              </div>
            </div>
          )}
        </div>

        {/* 3. Confirm New Password */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-semibold text-[#68707C]">Confirm New Password</label>
          <div className="relative flex items-center">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 pr-10 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 text-[#9DA5B1] hover:text-[#171A1F] transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {confirmPassword.length > 0 && (
            <div className="text-[12px] font-semibold mt-0.5 flex items-center gap-1">
              {passwordsMatch ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};
