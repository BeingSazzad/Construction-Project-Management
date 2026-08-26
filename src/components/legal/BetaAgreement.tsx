import React from 'react';
import { FlaskConical } from 'lucide-react';
import { LegalPageTemplate } from './LegalPageTemplate';

interface BetaAgreementProps {
  onBack: () => void;
}

export const BetaAgreement: React.FC<BetaAgreementProps> = ({ onBack }) => {
  return (
    <LegalPageTemplate
      onBack={onBack}
      icon={<FlaskConical className="w-7 h-7" />}
      iconBg="from-cyan-500/20 to-cyan-600/5"
      iconBorder="border-cyan-500/25"
      iconColor="text-cyan-400"
      title="Beta Agreement"
      updatedDate="Last updated: August 2026"
      sections={[
        {
          heading: 'Beta Access',
          body: 'You are participating in the Lattice closed beta. Beta features are under active development and may change, break, or be removed without notice.',
        },
        {
          heading: 'No Guarantee of Pricing',
          body: 'During the beta, you may have access to features at no cost or with expanded limits. This access is not a guarantee of future pricing or feature availability.',
        },
        {
          heading: 'Feedback Obligation',
          body: 'You agree to provide feedback on your experience and to report bugs or issues through Lattice support. Your feedback helps us improve the platform.',
        },
        {
          heading: 'Risk Acknowledgement',
          body: 'Beta participants should not rely on the platform for business-critical workflows without maintaining independent backups and records. We are not liable for data loss or disruptions during the beta period.',
        },
      ]}
    />
  );
};
