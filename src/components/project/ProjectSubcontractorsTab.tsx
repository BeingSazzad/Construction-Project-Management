import React from 'react';
import { Project, Subcontractor } from '../../types';
import { Phone, Mail, ShieldCheck, Users, HardHat, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectSubcontractorsTabProps {
  project: Project;
  subcontractors: Subcontractor[];
}

export const ProjectSubcontractorsTab: React.FC<ProjectSubcontractorsTabProps> = ({
  project,
  subcontractors
}) => {
  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
          Active Trade Partners ({subcontractors.length})
        </h3>
        <span className="text-xs text-cyan-400 font-bold">100% Insured</span>
      </div>

      <div className="flex flex-col gap-3">
        {subcontractors.map((sub) => (
          <div
            key={sub.id}
            className="card-dark p-4 border-[#1F2E47] bg-[#111827] hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={sub.avatar}
                  alt={sub.companyName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#23334F]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{sub.companyName}</h4>
                  <p className="text-[11px] text-cyan-400 font-medium">{sub.trade}</p>
                </div>
              </div>
              <StatusBadge status={sub.status} size="xs" />
            </div>

            <div className="grid grid-cols-2 gap-2 my-2.5 p-2.5 bg-[#0B101D] rounded-xl border border-[#172238] text-xs">
              <div>
                <span className="text-xs text-slate-400 font-medium">Lead Contact:</span>
                <p className="font-semibold text-slate-200 mt-0.5">{sub.contactName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Workers on Site:</span>
                <p className="font-bold text-emerald-400 mt-0.5">{sub.workersOnSite} Crew Members</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1C2A44] text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <a href={`tel:${sub.phone}`} className="flex items-center gap-1 text-slate-300 hover:text-cyan-400">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>Call</span>
                </a>
                <a href={`mailto:${sub.email}`} className="flex items-center gap-1 text-slate-300 hover:text-cyan-400">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>Email</span>
                </a>
              </div>

              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{sub.complianceRating}% Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
