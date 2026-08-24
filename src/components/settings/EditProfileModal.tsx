import React, { useState } from 'react';
import { User } from '../../types';
import { X, User as UserIcon, Mail, Phone, Building, MapPin, Award, Check, Camera, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

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
    }, 800);
  };

  const availableCerts = [
    'OSHA 30-Hour Safety',
    'PMP® Certified',
    'LEED AP BD+C',
    'Procore Certified PM',
    'CMAA Certified Construction Manager'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card-dark w-full max-w-md bg-[#0C121E] border-[#182438] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-5 border-b border-[#182438] flex items-center justify-between bg-[#0E1524]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Edit Profile & Info</h2>
              <p className="text-[10px] text-slate-400 font-medium">Update your jobsite credentials & contact info</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#182438] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {savedToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Avatar Preview & Change Photo */}
          <div className="flex items-center gap-3.5 pb-2">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-[#0C121E] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-500"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div>
              <span className="text-xs font-bold text-white block">{currentUser.name}</span>
              <span className="text-[11px] text-slate-400">{currentUser.roleTitle}</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Job Title</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Company / Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Direct Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* HQ Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">HQ / Office Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl pl-9 pr-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Professional Certifications Toggle */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Industry Certifications</span>
            </label>

            <div className="space-y-1.5">
              {availableCerts.map((cert) => {
                const isChecked = certifications.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCert(cert)}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between border transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/15 border-blue-500/40 text-white'
                        : 'bg-[#080D17] border-[#182438] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-xs">{cert}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions (Strict 48px Height) */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-[#182438] hover:bg-[#20304a] text-slate-300 font-bold text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-sm cursor-pointer transition-colors shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
