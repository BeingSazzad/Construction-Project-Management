import React from 'react';
import { ChevronLeft, ShieldCheck, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          <h1 className="text-base font-extrabold text-white">Privacy Policy</h1>
          <p className="text-[11px] text-slate-400">Enterprise Data Protection • SOC 2 Certified</p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B] space-y-4 text-xs leading-relaxed text-slate-300">
        <div>
          <h2 className="text-sm font-bold text-white mb-1">1. Information We Collect</h2>
          <p>
            When using the Lattice platform, we collect operational data necessary to manage construction projects: project schedules, CSI MasterFormat budget line items, subcontractor company profiles, site photos with GPS coordinates, punch list inspection logs, and user login credentials.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">2. How We Use Jobsite Telemetry</h2>
          <p>
            Field data, weather sensor feeds, and progress photos are processed strictly to calculate project milestone schedules, predict budget cost-to-complete forecasts, and assist your team through the Latti AI Assistant. We do not sell or monetize client construction telemetry.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">3. Enterprise Security & Encryption</h2>
          <p>
            All drawings, contracts, invoices, and site photos are encrypted in transit using TLS 1.3 and stored at rest using AES-256 encryption. Our infrastructure complies with SOC 2 Type II, ISO 27001, and GDPR standards.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">4. Subcontractor & Field Data Protection</h2>
          <p>
            Subcontractors only have access to documents, punch items, and schedule tasks directly assigned to their company. Confidential commercial pricing, overhead rates, and owner invoices remain isolated and visible only to authorized Finance Managers and Owners.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">5. Data Retention & Deletion</h2>
          <p>
            Clients maintain full control over project archives. Upon project completion or contract termination, project managers may export complete PDF project handoff dossiers and request permanent deletion of jobsite records.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white mb-1">6. Data Protection Officer</h2>
          <p>
            For privacy inquiries, GDPR data requests, or security documentation, contact our Data Protection Officer at privacy@latticebuild.com.
          </p>
        </div>
      </div>
    </div>
  );
};
