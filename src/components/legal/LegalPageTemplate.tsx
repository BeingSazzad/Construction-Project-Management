import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface LegalSection {
  heading?: string;
  body: string;
}

interface LegalPageTemplateProps {
  onBack: () => void;
  icon: React.ReactNode;
  title: string;
  updatedDate: string;
  sections: LegalSection[];
  iconBg?: string;
  iconBorder?: string;
  iconColor?: string;
}

export const LegalPageTemplate: React.FC<LegalPageTemplateProps> = ({
  onBack,
  icon,
  title,
  updatedDate,
  sections,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#F2F2F7] font-sans pb-24 max-w-[430px] mx-auto animate-fade-in">

      {/* Sticky top bar — title shown here only */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[#DDE1E7] shadow-sm">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-all active:scale-95 flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-[#171A1F] truncate">{title}</span>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 flex flex-col gap-4">

        {/* Small icon + date — no duplicate title */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] flex-shrink-0">
            {icon}
          </div>
          <p className="text-xs text-[#68707C] font-medium">{updatedDate}</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-[#DDE1E7] bg-white shadow-sm">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className={`px-4 py-4 text-xs leading-relaxed text-[#68707C] ${
                idx !== sections.length - 1 ? 'border-b border-[#EAEDF1]' : ''
              }`}
            >
              {section.heading && (
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="w-5 h-5 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[10px] font-bold text-[#1677FF] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-[#171A1F] leading-tight">{section.heading}</h3>
                </div>
              )}
              <p className={section.heading ? 'text-[#68707C] pl-7' : 'text-[#68707C]'}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-[#68707C]">
          <span>Questions?</span>
          <a href="mailto:support@latticebuild.com" className="text-[#1677FF] font-semibold hover:underline">
            Contact support
          </a>
        </div>

      </div>
    </div>
  );
};
