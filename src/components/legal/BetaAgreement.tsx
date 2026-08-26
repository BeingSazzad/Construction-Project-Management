import React from 'react';
import { ChevronLeft, FlaskConical } from 'lucide-react';

interface BetaAgreementProps {
  onBack: () => void;
}

export const BetaAgreement: React.FC<BetaAgreementProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen bg-[#070A12] text-slate-200 p-5 font-sans pb-24 max-w-[430px] mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#162033]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#0D1422] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-white">Beta Agreement</h1>
          <p className="text-[11px] text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      <div className="bg-[#0D1422] border border-[#1A263B] rounded-2xl p-4 space-y-4 text-xs leading-relaxed text-slate-300">
        <p>
          You are participating in the Lattice closed beta. Beta features are under active development and may change, break, or be removed without notice.
        </p>
        <p>
          During the beta, you may have access to features at no cost or with expanded limits. This access is not a guarantee of future pricing or feature availability.
        </p>
        <p>
          You agree to provide feedback on your experience and to report bugs or issues through Lattice support. Your feedback helps us improve the platform.
        </p>
        <p>
          Beta participants should not rely on the platform for business-critical workflows without maintaining independent backups and records. We are not liable for data loss or disruptions during the beta period.
        </p>
        <p className="text-slate-400 border-t border-[#1A263B] pt-3">
          Last updated: August 2026. Questions? <span className="text-blue-400 font-semibold">Contact Lattice support.</span>
        </p>
      </div>
    </div>
  );
};
