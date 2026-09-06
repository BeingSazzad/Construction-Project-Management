import React from 'react';
import { 
  X, Phone, Mail, Building2, ShieldCheck, MapPin, CheckCircle2, 
  Clock, HardHat, Calendar, MessageSquare, ExternalLink, Briefcase
} from 'lucide-react';

export interface EmployeeProfileData {
  id: string;
  name: string;
  role: string;
  designation?: string;
  company: string;
  phone: string;
  email: string;
  avatar: string;
  type?: 'gc' | 'trade';
  isOnSite?: boolean;
  projectName?: string;
  sinceDate?: string;
  address?: string;
}

interface EmployeeProfileModalProps {
  member: EmployeeProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTeam?: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  member,
  isOpen,
  onClose,
  onNavigateToTeam
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Team Member Profile
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pt-1">
          <div className="relative mb-3">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#1677FF]/20"
            />
            {member.isOnSite ? (
              <span 
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white shadow-xs" 
                title="Currently On Site" 
              />
            ) : (
              <span 
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#94A3B8] border-2 border-white shadow-xs" 
                title="Office / Remote" 
              />
            )}
          </div>

          <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
            {member.name}
          </h3>
          <p className="text-xs font-semibold text-[#1677FF] mt-0.5">
            {member.designation || member.role}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>{member.company}</span>
          </p>

          {/* Status Badge */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
              member.isOnSite 
                ? 'bg-[#E9F9F3] text-[#10A976]' 
                : 'bg-[#F1F5F9] text-[#64748B]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${member.isOnSite ? 'bg-[#10A976] animate-pulse' : 'bg-[#94A3B8]'}`} />
              {member.isOnSite ? 'Active On-Site' : 'Off-Site / Remote'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF3FF] text-[#1677FF]">
              {member.type === 'trade' ? 'Trade Partner' : 'GC Leadership'}
            </span>
          </div>
        </div>

        {/* Quick Contact Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a 
            href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
            className="h-10 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Member</span>
          </a>
          <a 
            href={`mailto:${member.email}`}
            className="h-10 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E2E8F0] hover:border-[#1677FF]/30 text-[#0F172A] hover:text-[#1677FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>

        {/* Specifications / Detail Rows */}
        <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] flex flex-col gap-2.5 text-xs">
          {/* Designation */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Briefcase className="w-3.5 h-3.5 text-[#1677FF] shrink-0" />
              <span className="font-medium">Designation</span>
            </div>
            <span className="font-semibold text-[#0F172A] truncate max-w-[200px]">
              {member.designation || member.role}
            </span>
          </div>

          {/* Project Role */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 text-[#64748B]">
              <HardHat className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="font-medium">Project Role</span>
            </div>
            <span className="font-semibold text-[#0F172A] truncate max-w-[190px]">
              {member.role}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Phone className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="font-medium">Direct Phone</span>
            </div>
            <span className="font-semibold text-[#0F172A] font-mono">{member.phone}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Mail className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="font-medium">Work Email</span>
            </div>
            <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">{member.email}</span>
          </div>
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 shrink-0 mt-0.5 text-[#64748B]">
              <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="font-medium">Work Address</span>
            </div>
            <span className="font-semibold text-[#0F172A] text-right leading-snug">
              {member.address || '401 E Jackson St, Tampa, FL'}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Building2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <span className="font-medium">Current Project</span>
            </div>
            <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">
              {member.projectName || 'Active Project Workspace'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#64748B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10A976] shrink-0" />
              <span className="font-medium">Site Assignment</span>
            </div>
            <span className="font-semibold text-[#10A976] flex items-center gap-1">
              <span>Verified Access</span>
            </span>
          </div>
        </div>

        {/* View in Project Team Tab Button */}
        {onNavigateToTeam && (
          <button
            onClick={() => {
              onClose();
              onNavigateToTeam();
            }}
            className="w-full py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1677FF] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>View in Project Team Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
