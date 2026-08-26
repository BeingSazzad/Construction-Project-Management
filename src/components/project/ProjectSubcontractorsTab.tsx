import React from 'react';
import { Project, Subcontractor } from '../../types';
import { Phone, Mail, ShieldCheck, Users, HardHat, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Compliance Badge */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Trade Subcontractors</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{subcontractors.length} Active Trade Partners</p>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Insured</span>
        </span>
      </div>

      {/* 2. Subcontractor Cards */}
      <div className="flex flex-col gap-3">
        {subcontractors.map((sub) => (
          <div
            key={sub.id}
            className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all shadow-sm flex flex-col gap-3 group"
          >
            {/* Top Row: Avatar + Company + Trade + Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={sub.avatar}
                  alt={sub.companyName}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=150&auto=format&fit=crop&q=80';
                  }}
                  className="w-11 h-11 rounded-xl object-cover border border-[#1E2C48] flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {sub.companyName}
                  </h4>
                  <p className="text-xs text-blue-400 font-medium truncate mt-0.5">{sub.trade}</p>
                </div>
              </div>

              <StatusBadge status={sub.status} size="xs" />
            </div>

            {/* Middle Grid: Lead Contact & Crew Count */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#050811] rounded-xl border border-[#142036] text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead Contact</span>
                <p className="font-semibold text-slate-200 mt-0.5 truncate">{sub.contactName}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">On Site</span>
                <p className="font-bold text-emerald-400 mt-0.5 truncate">{sub.workersOnSite} Crew Members</p>
              </div>
            </div>

            {/* Bottom Row: Quick Call & Verification Score */}
            <div className="flex items-center justify-between pt-1 border-t border-[#121B2D] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${sub.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1A33] border border-[#1E325A] text-blue-400 hover:text-white hover:bg-blue-600 transition-all font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Trade</span>
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sub.complianceRating}% COI Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
