import React, { useState } from 'react';
import { User } from '../../types';
import { X, User as UserIcon, Mail, Phone, Building, MapPin, Award, Check, Camera, ShieldCheck } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(currentUser.name);
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [company, setCompany] = useState(currentUser.company);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 345-6789');
  const [location, setLocation] = useState('New York, NY');
  const [certifications, setCertifications] = useState<string[]>([
    'OSHA 30-Hour Safety',
    'PMP® Certified',
    'LEED AP BD+C'
  ]);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

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
      onClose();
    }, 600);
  };

  const availableCerts = [
    'OSHA 30-Hour Safety',
    'PMP® Certified',
    'LEED AP BD+C',
    'Procore Certified PM',
    'CMAA Certified Construction Manager'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#0C121E] border border-[#1A263E] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-5 border-b border-[#162033] flex items-center justify-between bg-[#0E1524]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Edit Profile</h2>
              <p className="text-xs text-slate-400 font-medium">Update credentials & contact info</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#141F33] hover:bg-[#1C2C47] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-slate-100">
          {savedToast && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Avatar Preview & Info */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#080D18] border border-[#162033]">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2563EB] border-2 border-[#0C121E] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-500 transition-transform hover:scale-110"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="min-w-0">
              <span className="text-sm font-bold text-white block truncate">{currentUser.name}</span>
              <span className="text-xs text-slate-400 truncate block mt-0.5">{currentUser.roleTitle}</span>
            </div>
          </div>

          {/* Full Name (Standard 44px Height) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
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
                placeholder="e.g. Lattice Construction"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
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
                placeholder="e.g. New York, NY"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl pl-10 pr-3.5 text-sm text-white font-medium focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Industry Certifications (Clean, 44px Touch Targets) */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Verified Industry Certifications</span>
            </label>

            <div className="space-y-2">
              {availableCerts.map((cert) => {
                const isChecked = certifications.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCert(cert)}
                    className={`w-full h-11 px-3.5 rounded-xl text-left flex items-center justify-between border transition-all cursor-pointer ${
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

          {/* Modal Actions (Standard 48px Height) */}
          <div className="pt-3 flex items-center gap-2.5 border-t border-[#162033]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-[#141F33] hover:bg-[#1A2842] text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm cursor-pointer transition-all shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
