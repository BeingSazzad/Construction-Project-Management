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
  const [companyName, setCompanyName] = useState(currentUser.company || 'Avery & Marsh Construction Group');
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
        <h1 className="text-sm font-bold text-white tracking-tight">Company & Organization</h1>
        <div className="w-12" />
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Company information updated!</span>
        </div>
      )}

      {/* Custom Report Branding Card */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Custom Report Branding</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Upload your company logo to brand exported PDF reports. Available on <strong className="text-white">Lattice Pro</strong> and higher plans.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Upgrade to Pro to customize exported PDF reports with your company logo.')}
          className="mt-1 w-full sm:w-auto self-start px-3.5 py-1.5 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Upgrade to Unlock</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* Company Information Form Card */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between pb-1 border-b border-[#142036]">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Company Details
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              <Award className="w-3 h-3" />
              <span>Score: 40/100</span>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="e.g. Avery & Marsh Construction Group"
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Business Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Suite 400"
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white font-medium focus:border-[#2563EB] focus:outline-none transition-colors"
            />
          </div>

          {/* License # */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">General Contractor License #</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="GC-12345"
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
