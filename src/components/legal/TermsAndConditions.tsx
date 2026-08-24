import React from 'react';
import { ChevronLeft, ShieldCheck, FileText } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen bg-[#070A12] text-slate-200 p-5 font-sans pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#162033]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#0D1422] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-white">Terms of Service</h1>
          <p className="text-[11px] text-slate-400">Last updated: May 2025 • Version 3.4</p>
        </div>
      </div>

      {/* Terms Content Body */}
      <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B] space-y-4 text-xs leading-relaxed text-slate-300">
        <div>
          <h2 className="text-sm font-bold text-white mb-1">1. SaaS Platform License</h2>
          <p>
            Lattice Technologies Inc. ("Lattice") grants your construction organization a non-exclusive, non-transferable enterprise subscription license to access the Lattice Construction Management Suite, including project scheduling, budget analytics, submittals, and field telemetry.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">2. Project Plans & BIM Intellectual Property</h2>
          <p>
            All architectural drawings, structural CAD files, BIM models, daily field logs, and site photos uploaded to Lattice remain the exclusive intellectual property of the subscribing client and its licensed trade partners. Lattice does not claim ownership over any client design documents.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">3. Field Safety & Engineering Disclaimer</h2>
          <p>
            Lattice and its Latti AI Assistant provide construction scheduling projections, risk detection, and budget variance estimates for operational assistance only. Platform recommendations do not replace licensed Professional Engineer (PE) structural reviews, municipal building inspector approvals, or OSHA compliance determinations.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">4. Subcontractor Access & Role Permissions</h2>
          <p>
            Organization administrators are solely responsible for assigning authorized user roles (Company Owner, Project Manager, Finance Manager, Field Superintendent) and managing subcontractor access permissions to proprietary trade pricing and project records.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">5. SLA & Data Reliability</h2>
          <p>
            Lattice commits to a 99.9% platform availability SLA with continuous cloud backup, offline mobile synchronization for field photos, and SOC 2 Type II certified data encryption in transit (TLS 1.3) and at rest (AES-256).
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">6. Contact & Legal Notices</h2>
          <p>
            For legal notices, compliance audits, or enterprise MSA inquiries, contact legal@latticebuild.com or write to Lattice Technologies Inc., 450 Lexington Ave, Suite 2400, New York, NY 10017.
          </p>
        </div>
      </div>
    </div>
  );
};
