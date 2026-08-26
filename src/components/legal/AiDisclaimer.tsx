import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';

interface AiDisclaimerProps {
  onBack: () => void;
}

export const AiDisclaimer: React.FC<AiDisclaimerProps> = ({ onBack }) => {
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
          <h1 className="text-base font-extrabold text-white">AI Disclaimer</h1>
          <p className="text-[11px] text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      <div className="bg-[#0D1422] border border-[#1A263B] rounded-2xl p-4 space-y-4 text-xs leading-relaxed text-slate-300">
        <p>
          Lattice uses artificial intelligence — including our assistant Latti and the BuildScope AI takeoff engine — to generate estimates, quantities, summaries, and insights.
        </p>
        <p>
          AI outputs are predictive and based on the information available at the time. They may contain errors, omissions, or assumptions that do not reflect your specific project conditions, local codes, or market realities.
        </p>
        <p>
          All AI-generated estimates and takeoffs must be reviewed and verified by a qualified professional before being relied upon for bidding, purchasing, financing, or construction decisions.
        </p>
        <p>
          Lattice surfaces confidence indicators and assumptions where available. You are responsible for correcting inaccuracies and for final decisions made using AI-assisted outputs.
        </p>
        <p className="text-slate-400 border-t border-[#1A263B] pt-3">
          Last updated: August 2026. Questions? <span className="text-blue-400 font-semibold">Contact Lattice support.</span>
        </p>
      </div>
    </div>
  );
};
