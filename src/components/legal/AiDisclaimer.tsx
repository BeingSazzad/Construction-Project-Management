import React from 'react';
import { Sparkles } from 'lucide-react';
import { LegalPageTemplate } from './LegalPageTemplate';

interface AiDisclaimerProps {
  onBack: () => void;
}

export const AiDisclaimer: React.FC<AiDisclaimerProps> = ({ onBack }) => {
  return (
    <LegalPageTemplate
      onBack={onBack}
      icon={<Sparkles className="w-7 h-7" />}
      iconBg="from-purple-500/20 to-purple-600/5"
      iconBorder="border-purple-500/25"
      iconColor="text-purple-400"
      title="AI Disclaimer"
      updatedDate="Last updated: August 2026"
      sections={[
        {
          heading: 'AI-Powered Tools',
          body: 'Lattice uses artificial intelligence — including our assistant Latti and the BuildScope AI takeoff engine — to generate estimates, quantities, summaries, and insights.',
        },
        {
          heading: 'Output Limitations',
          body: 'AI outputs are predictive and based on the information available at the time. They may contain errors, omissions, or assumptions that do not reflect your specific project conditions, local codes, or market realities.',
        },
        {
          heading: 'Professional Review Required',
          body: 'All AI-generated estimates and takeoffs must be reviewed and verified by a qualified professional before being relied upon for bidding, purchasing, financing, or construction decisions.',
        },
        {
          heading: 'Your Responsibility',
          body: 'Lattice surfaces confidence indicators and assumptions where available. You are responsible for correcting inaccuracies and for final decisions made using AI-assisted outputs.',
        },
      ]}
    />
  );
};
