import React, { useState } from 'react';
import { User } from '../../types';
import { 
  ChevronLeft, User as UserIcon, Mail, Phone, Building, 
  MapPin, Award, Check, Camera, ShieldCheck, Save
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
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [company, setCompany] = useState(currentUser.company);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState('New York, NY');
  const [certifications, setCertifications] = useState<string[]>([
    'OSHA 30-Hour Safety',
    'PMP® Certified',
    'LEED AP BD+C'
  ]);
  const [savedToast, setSavedToast] = useState(false);

  const availableCerts = [
    'OSHA 30-Hour Safety',
    'PMP® Certified',
    'LEED AP BD+C',
    'Procore Certified PM',
    'CMAA Certified Construction Manager'
  ];

  const toggleCert = (cert: string) => {
    setCertifications(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      roleTitle,
      company,
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
      <div className="flex items-center justify-between pb-3 border-b border-[#141C2E]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <h1 className="text-sm font-bold text-white tracking-tight">Profile Details</h1>
        <div className="w-12" /> {/* Balance spacer */}
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* Avatar Card */}
        <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center gap-4 shadow-sm">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2563EB] border-2 border-[#0D1424] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-500 transition-transform hover:scale-110"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-base font-bold text-white block truncate">{currentUser.name}</span>
            <span className="text-xs text-slate-400 truncate block mt-0.5">{currentUser.roleTitle}</span>
            <span className="text-xs text-slate-500 truncate block mt-0.5">{currentUser.company}</span>
          </div>
        </div>

        {/* Form Group: Personal & Contact Information */}
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-3.5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Personal & Organization
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter full name"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Title</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
                placeholder="e.g. Senior Project Manager"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company / Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="e.g. Avery & Marsh Construction"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Direct Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* HQ Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">HQ / Office Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New York, NY"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Form Group: Certifications */}
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Verified Industry Certifications
            </h2>
          </div>

          <div className="space-y-2">
            {availableCerts.map((cert) => {
              const isChecked = certifications.includes(cert);
              return (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCert(cert)}
                  className={`w-full h-12 px-3.5 rounded-xl text-left flex items-center justify-between border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-blue-600/10 border-blue-500/40 text-white'
                      : 'bg-[#080D18] border-[#162033] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-medium text-xs truncate pr-2">{cert}</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 transition-colors ${
                    isChecked ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-600 bg-[#0C121E]'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-1 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-12 rounded-2xl bg-[#141F33] hover:bg-[#1A2842] text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-12 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
