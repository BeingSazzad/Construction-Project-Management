import React from 'react';
import { FileText } from 'lucide-react';
import { LegalPageTemplate } from './LegalPageTemplate';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <LegalPageTemplate
      onBack={onBack}
      icon={<FileText className="w-7 h-7" />}
      title="Terms of Service"
      updatedDate="Last updated: August 2026"
      sections={[
        {
          heading: 'Platform Access',
          body: 'Welcome to Lattice. By accessing or using the Lattice platform, you agree to these Terms of Service. Lattice provides construction management, estimating, and AI-assisted tools for custom home builders and remodelers.',
        },
        {
          heading: 'Your Responsibilities',
          body: 'You are responsible for the accuracy of the project data, plans, and inputs you provide. Lattice\'s estimates, takeoffs, and analyses are provided to assist your professional judgment and are not a substitute for licensed engineering, architectural, or legal advice.',
        },
        {
          heading: 'Acceptable Use',
          body: 'You agree not to misuse the platform, attempt unauthorized access, or upload content you do not have the rights to use. We may suspend or terminate accounts that violate these terms.',
        },
        {
          heading: 'Limitation of Liability',
          body: 'Lattice is provided on an "as is" basis. To the maximum extent permitted by law, Lattice is not liable for indirect, incidental, or consequential damages arising from use of the platform or reliance on its outputs.',
        },
      ]}
    />
  );
};
