import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { LegalPageTemplate } from './LegalPageTemplate';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <LegalPageTemplate
      onBack={onBack}
      icon={<ShieldCheck className="w-7 h-7" />}
      iconBg="from-emerald-500/20 to-emerald-600/5"
      iconBorder="border-emerald-500/25"
      iconColor="text-emerald-400"
      title="Privacy Policy"
      updatedDate="Last updated: August 2026"
      sections={[
        {
          heading: 'What We Collect',
          body: 'Lattice collects the information you provide when you create an account, set up your company, and use our tools — including company name, region, project data, plans, budgets, and field reports.',
        },
        {
          heading: 'How We Use Your Data',
          body: 'We use this data to provide and improve the platform, generate estimates and reports, and personalize your experience. Your project data belongs to your company and is isolated from other organizations on the platform.',
        },
        {
          heading: 'Data Sharing',
          body: 'We do not sell your personal information. We may share data with service providers who help us operate the platform under appropriate confidentiality obligations.',
        },
        {
          heading: 'Your Rights',
          body: 'You may request access to, correction of, or deletion of your data by contacting Lattice support. We retain data for as long as your account is active and for a reasonable period thereafter as required by law.',
        },
      ]}
    />
  );
};
