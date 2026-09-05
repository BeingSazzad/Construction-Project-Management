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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-md bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 px-5 border-b border-[#EAEDF1] flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-blue-200 flex items-center justify-center text-[#1677FF]">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#171A1F] tracking-tight">Edit Profile</h2>
              <p className="text-xs text-[#68707C] font-medium">Update credentials & contact info</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-[#171A1F]">
          {savedToast && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Avatar Preview & Info */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1]">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#1677FF]/20 shadow-xs"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1677FF] border-2 border-white text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#0958D9] transition-transform hover:scale-110"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="min-w-0">
              <span className="text-sm font-bold text-[#171A1F] block truncate">{currentUser.name}</span>
              <span className="text-xs text-[#68707C] truncate block mt-0.5">{currentUser.roleTitle}</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">Job Title</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
                placeholder="e.g. Senior Project Manager"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">Company / Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="e.g. Lattice Construction"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">Direct Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* HQ Location */}
          <div>
            <label className="block text-xs font-semibold text-[#68707C] mb-1.5">HQ / Office Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DA5B1] pointer-events-none" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY"
                className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-10 pr-3.5 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Industry Certifications */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-[#68707C] mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#1677FF]" />
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
                        ? 'bg-[#EAF3FF] border-[#1677FF] text-[#171A1F]'
                        : 'bg-[#F7F8FA] border-[#EAEDF1] text-[#68707C] hover:bg-[#F2F2F7]'
                    }`}
                  >
                    <span className="font-medium text-xs truncate pr-2">{cert}</span>
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 transition-colors ${
                      isChecked ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#DDE1E7] bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center gap-2.5 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] font-semibold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
