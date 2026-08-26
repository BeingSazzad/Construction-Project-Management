import React from 'react';
import { CreditCard } from 'lucide-react';
import { LegalPageTemplate } from './LegalPageTemplate';

interface SubscriptionTermsProps {
  onBack: () => void;
}

export const SubscriptionTerms: React.FC<SubscriptionTermsProps> = ({ onBack }) => {
  return (
    <LegalPageTemplate
      onBack={onBack}
      icon={<CreditCard className="w-7 h-7" />}
      title="Subscription Terms"
      updatedDate="Last updated: August 2026"
      sections={[
        {
          heading: 'Billing & Plans',
          body: 'Lattice is offered through recurring subscription plans billed monthly or annually via Base44 Payments. Plan features, included limits, and pricing are described on our pricing page.',
        },
        {
          heading: 'Trials & Cancellation',
          body: 'Paid plans begin with a free trial where offered. Trials convert to paid subscriptions at the end of the trial period unless cancelled. You may cancel anytime; cancellation takes effect at the end of the current billing period.',
        },
        {
          heading: 'Plan Changes & Refunds',
          body: 'Plan changes (upgrades or downgrades) take effect according to the billing schedule shown at the time of change. Refunds, where applicable, are handled at Lattice\'s discretion in line with applicable law.',
        },
        {
          heading: 'Credits',
          body: 'Certain advanced actions consume credits. Credit usage and limits are described in the platform. Unused credits may expire according to your plan\'s terms.',
        },
      ]}
    />
  );
};
