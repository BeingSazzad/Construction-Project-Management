import React from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';

interface SubscriptionTermsProps {
  onBack: () => void;
}

export const SubscriptionTerms: React.FC<SubscriptionTermsProps> = ({ onBack }) => {
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
          <h1 className="text-base font-extrabold text-white">Subscription Terms</h1>
          <p className="text-[11px] text-slate-400">Last updated: August 2026</p>
        </div>
      </div>

      <div className="bg-[#0D1422] border border-[#1A263B] rounded-2xl p-4 space-y-4 text-xs leading-relaxed text-slate-300">
        <p>
          Lattice is offered through recurring subscription plans billed monthly or annually via Base44 Payments. Plan features, included limits, and pricing are described on our pricing page.
        </p>
        <p>
          Paid plans begin with a free trial where offered. Trials convert to paid subscriptions at the end of the trial period unless cancelled. You may cancel anytime; cancellation takes effect at the end of the current billing period.
        </p>
        <p>
          Plan changes (upgrades or downgrades) take effect according to the billing schedule shown at the time of change. Refunds, where applicable, are handled at Lattice's discretion in line with applicable law.
        </p>
        <p>
          Certain advanced actions consume credits. Credit usage and limits are described in the platform. Unused credits may expire according to your plan's terms.
        </p>
        <p className="text-slate-400 border-t border-[#1A263B] pt-3">
          Last updated: August 2026. Questions? <span className="text-blue-400 font-semibold">Contact Lattice support.</span>
        </p>
      </div>
    </div>
  );
};
