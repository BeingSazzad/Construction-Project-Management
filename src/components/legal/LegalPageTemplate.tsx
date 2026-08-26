import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface LegalSection {
  heading?: string;
  body: string;
}

interface LegalPageTemplateProps {
  onBack: () => void;
  icon: React.ReactNode;
  iconBg: string;      // e.g. 'from-blue-500/20 to-blue-600/5'
  iconBorder: string;  // e.g. 'border-blue-500/30'
  iconColor: string;   // e.g. 'text-blue-400'
  title: string;
  updatedDate: string;
  sections: LegalSection[];
}

export const LegalPageTemplate: React.FC<LegalPageTemplateProps> = ({
  onBack,
  icon,
  iconBg,
  iconBorder,
  iconColor,
  title,
  updatedDate,
  sections,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#070A12] font-sans pb-24 max-w-[430px] mx-auto">
      
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-[#070A12]/95 backdrop-blur-md px-5 py-3 flex items-center gap-3 border-b border-[#142036]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#0D1422] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-white truncate">{title}</span>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* Hero block */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className={`w-16 h-16 rounded-3xl bg-gradient-to-b ${iconBg} border ${iconBorder} flex items-center justify-center shadow-lg`}>
            <div className={`${iconColor} w-7 h-7`}>{icon}</div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1">{updatedDate}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#1A263B] to-transparent" />

        {/* Content sections */}
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-[#142036] bg-[#0A1020]">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className={`px-4 py-4 text-xs leading-relaxed text-slate-300 ${
                idx !== sections.length - 1 ? 'border-b border-[#142036]' : ''
              }`}
            >
              {section.heading && (
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-[#142036] flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-white leading-tight">{section.heading}</h3>
                </div>
              )}
              <p className={section.heading ? 'text-slate-400 pl-7' : 'text-slate-300'}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer contact */}
        <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] text-slate-500">
          <span>Questions?</span>
          <span className="text-blue-400 font-semibold">Contact Lattice support</span>
        </div>

      </div>
    </div>
  );
};
