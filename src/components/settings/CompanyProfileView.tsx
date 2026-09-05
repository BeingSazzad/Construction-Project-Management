import React, { useState } from 'react';
import { User } from '../../types';
import { 
  ChevronLeft, Building, Phone, MapPin, 
  ShieldCheck, Crown, Check, Award
} from 'lucide-react';

interface CompanyProfileViewProps {
  currentUser: User;
  onBack: () => void;
  onSave?: (companyData: { company: string; phone: string; address: string; license: string }) => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  currentUser,
  onBack,
  onSave
}) => {
  const [companyName, setCompanyName] = useState(currentUser.company || 'Lattice Construction Group');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [address, setAddress] = useState('123 Main St, Suite 400');
  const [licenseNumber, setLicenseNumber] = useState('GC-12345');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        company: companyName,
        phone,
        address,
        license: licenseNumber
      });
    }
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
        <h1 className="text-sm font-bold text-[#171A1F] tracking-tight">Company & Organization</h1>
        <div className="w-12" />
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Company information updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* Company Information Form Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#EAEDF1]">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#1677FF]" />
              <h2 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Company Details
              </h2>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="e.g. Lattice Construction Group"
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Business Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Suite 400"
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* License # */}
          <div>
            <label className="block text-[12px] font-semibold text-[#68707C] mb-1">General Contractor License #</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="GC-12345"
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 text-xs text-[#171A1F] font-medium focus:border-[#1677FF] focus:bg-white focus:outline-none transition-colors"
            />
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
