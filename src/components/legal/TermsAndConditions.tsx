import React from 'react';
import { ChevronLeft, FileText } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
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
          <h1 className="text-base font-extrabold text-white">Terms of Service</h1>
          <p className="text-[11px] text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      <div className="bg-[#0D1422] border border-[#1A263B] rounded-2xl p-4 space-y-4 text-xs leading-relaxed text-slate-300">
        <p>
          Welcome to Lattice. By accessing or using the Lattice platform, you agree to these Terms of Service. Lattice provides construction management, estimating, and AI-assisted tools for custom home builders and remodelers.
        </p>
        <p>
          You are responsible for the accuracy of the project data, plans, and inputs you provide. Lattice's estimates, takeoffs, and analyses are provided to assist your professional judgment and are not a substitute for licensed engineering, architectural, or legal advice.
        </p>
        <p>
          You agree not to misuse the platform, attempt unauthorized access, or upload content you do not have the rights to use. We may suspend or terminate accounts that violate these terms.
        </p>
        <p>
          Lattice is provided on an "as is" basis. To the maximum extent permitted by law, Lattice is not liable for indirect, incidental, or consequential damages arising from use of the platform or reliance on its outputs.
        </p>
        <p className="text-slate-400 border-t border-[#1A263B] pt-3">
          Last updated: August 2026. Questions? <span className="text-blue-400 font-semibold">Contact Lattice support.</span>
        </p>
      </div>
    </div>
  );
};
