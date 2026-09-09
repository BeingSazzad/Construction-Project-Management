import React, { useState } from 'react';
import { User } from '../../types';
import { 
  ChevronLeft, User as UserIcon, Mail, Briefcase, 
  Camera, Check, ShieldCheck
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
  const [name, setName] = useState(currentUser.name);
  const [designation, setDesignation] = useState(currentUser.designation || currentUser.roleTitle);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [savedToast, setSavedToast] = useState(false);

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { title: 'Company Owner & Admin', badge: 'Full Workspace Access' };
      case 'pm':
        return { title: 'Lead Project Manager', badge: 'Project Controls & Execution' };
      case 'finance':
        return { title: 'Finance Controller', badge: 'Draws & Accounting' };
      case 'field':
        return { title: 'Lead Field Superintendent', badge: 'Daily Logs & Site Safety' };
      default:
        return { title: 'Team Member', badge: 'Standard Access' };
    }
  };

  const roleInfo = getRoleInfo(currentUser.role);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      designation,
      roleTitle: designation,
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Account</span>
        </button>
        <h1 className="text-sm font-bold text-[#171A1F] tracking-tight">Personal Profile</h1>
        <div className="w-12" />
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
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
              className="w-20 h-20 rounded-full object-cover border-2 border-[#1677FF]/30 shadow-xs"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1677FF] border-2 border-white text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#0958D9] transition-transform active:scale-95"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-bold text-[#1677FF] hover:text-[#0958D9] transition-colors cursor-pointer"
          >
            Change Photo
          </button>
        </div>

        {/* Personal Details Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-[#EAEDF1]">
            <UserIcon className="w-4 h-4 text-[#1677FF]" />
            <h2 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Profile Details
            </h2>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-12 min-h-[48px] bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 min-h-[48px] bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Direct Phone */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Direct Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 234-5678"
              className="w-full h-12 min-h-[48px] bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Designation Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-semibold text-[#171A1F]">Designation</label>
              <span className="text-[10px] text-[#68707C] font-medium">Business Title</span>
            </div>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              placeholder={currentUser.role === 'admin' ? 'e.g. Managing Principal & Founder' : 'e.g. Senior Project Manager'}
              className="w-full h-12 min-h-[48px] bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-[#68707C] mt-1">
              Official job designation displayed across project workspaces, contracts, and team reports.
            </p>
          </div>

          {/* System Access Role (Permissions separation) */}
          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#68707C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1677FF]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#171A1F]">System Role</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF]">
                {roleInfo.badge}
              </span>
            </div>
            <p className="text-xs font-bold text-[#171A1F]">{roleInfo.title}</p>
            <p className="text-[11px] text-[#68707C]">
              {currentUser.role === 'admin'
                ? 'You own this workspace and the Lattice subscription. Access privileges are assigned by you.'
                : 'You are an invited employee. The workspace owner manages billing and company settings.'}
            </p>
          </div>
        </div>

        {/* Standard Single Full-Width Primary Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

    </div>
  );
};
