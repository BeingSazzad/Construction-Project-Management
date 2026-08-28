import React, { useState } from 'react';
import { User } from '../../types';
import { 
  ChevronLeft, User as UserIcon, Mail, Briefcase, 
  Camera, Check
} from 'lucide-react';

interface EditProfileViewProps {
  currentUser: User;
  onBack: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  currentUser,
  onBack,
  onSave
}) => {
  const [name, setName] = useState(currentUser.name || 'Alex Chen');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || 'Company Owner & Principal');
  const [email, setEmail] = useState(currentUser.email || 'alex.chen@averymarsh.com');
  const [phone, setPhone] = useState(currentUser.phone || '(555) 234-5678');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      roleTitle,
      email,
      phone
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onBack();
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141C2E]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Account</span>
        </button>
        <h1 className="text-sm font-bold text-white tracking-tight">Personal Profile</h1>
        <div className="w-12" />
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Personal profile updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* Centered Avatar Upload Section */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/50 shadow-md shadow-blue-500/10"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2563EB] border-2 border-[#060913] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-500 transition-transform active:scale-95"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Change Photo
          </button>
        </div>

        {/* Personal Details Card */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 pb-1 border-b border-[#142036]">
            <UserIcon className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Profile Details
            </h2>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-400 mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* Direct Phone */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-400 mb-1">Direct Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 234-5678"
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* Role / Title */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-400 mb-1">Role / Position</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Standard Single Full-Width Primary Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

    </div>
  );
};
