import React, { useState } from 'react';
import {
  Users, Plus, Search, Shield, ChevronRight, Mail,
  Phone, Crown, X, CheckCircle2, MessageSquare, Building2,
  UserMinus, ShieldCheck, AlertTriangle, ChevronLeft, ChevronDown,
  Briefcase, DollarSign, HardHat, MapPin, Calendar
} from 'lucide-react';
import { UserRole } from '../../types';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation?: string;
  department: string;
  roleGroup: 'Owner' | 'PM' | 'Finance' | 'Field';
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Invited' | 'Inactive';
  presence: 'On Site' | 'In Office' | 'Remote' | 'Off Duty';
  assignedProjects: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  location: string;
  address?: string;
  hireDate: string;
}

const ROLE_COLORS: Record<string, string> = {
  'Owner':   'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/30 font-bold',
  'PM':      'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/20 font-semibold',
  'Finance': 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  'Field':   'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
};

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't-1',
    name: 'Avery Scott',
    role: 'Principal General Contractor & Owner',
    designation: 'Managing Principal & Founder',
    department: 'Executive Management',
    roleGroup: 'Owner',
    email: 'avery@averymarsh.com',
    phone: '+1 (720) 555-0111',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'In Office',
    assignedProjects: ['Snell Isle Residence', '104 Ocean Drive', 'Highland Park Modern', 'Aspen Creek Estate'],
    certifications: ['Class A General Contractor License', 'OSHA 30', 'LEED AP BD+C'],
    emergencyContact: { name: 'Elena Scott', relation: 'Spouse', phone: '+1 (720) 555-0199' },
    location: 'Tampa HQ',
    address: '401 E Jackson St, Suite 2200, Tampa, FL 33602',
    hireDate: 'Jan 2018'
  },
  {
    id: 't-2',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    designation: 'Lead Project Manager',
    department: 'Project Operations',
    roleGroup: 'PM',
    email: 'sarah.j@averymarsh.com',
    phone: '+1 (720) 555-0122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'On Site',
    assignedProjects: ['Snell Isle Residence', '104 Ocean Drive'],
    certifications: ['PMP® Certified', 'OSHA 30 Construction', 'Procore Certified: PM'],
    emergencyContact: { name: 'Mark Johnson', relation: 'Spouse', phone: '+1 (720) 555-0188' },
    location: 'Snell Isle Field Trailer',
    address: '1840 Brightwaters Blvd NE, Tampa, FL 33704',
    hireDate: 'Mar 2021'
  },
  {
    id: 't-3',
    name: 'Marcus Chen',
    role: 'Chief Financial Controller',
    designation: 'Chief Financial Controller',
    department: 'Finance & Accounting',
    roleGroup: 'Finance',
    email: 'marcus.c@averymarsh.com',
    phone: '+1 (720) 555-0133',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'In Office',
    assignedProjects: ['Snell Isle Residence', '104 Ocean Drive', 'Highland Park Modern', 'Aspen Creek Estate'],
    certifications: ['CPA Certified', 'CCIFP (Construction Financial Pro)', 'AIA G702/G703 Specialist'],
    emergencyContact: { name: 'Vivian Chen', relation: 'Spouse', phone: '+1 (720) 555-0177' },
    location: 'Tampa HQ',
    address: '401 E Jackson St, Suite 2200, Tampa, FL 33602',
    hireDate: 'Jun 2020'
  },
  {
    id: 't-4',
    name: 'John Smith',
    role: 'Lead Field Superintendent',
    designation: 'Lead Field Superintendent',
    department: 'Field Operations',
    roleGroup: 'Field',
    email: 'john.s@averymarsh.com',
    phone: '+1 (720) 555-0144',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'On Site',
    assignedProjects: ['Snell Isle Residence'],
    certifications: ['OSHA 30', 'SWPPP Stormwater Inspector', 'First Aid / CPR'],
    emergencyContact: { name: 'Mary Smith', relation: 'Spouse', phone: '+1 (720) 555-0166' },
    location: 'Snell Isle Field Trailer',
    address: '1840 Brightwaters Blvd NE, Tampa, FL 33704',
    hireDate: 'Aug 2019'
  }
];

type FilterType = 'All' | 'Owner' | 'PM' | 'Finance' | 'Field';

interface TeamHubViewProps {
  currentRole?: UserRole;
  onBack?: () => void;
}

export const TeamHubView: React.FC<TeamHubViewProps> = ({ currentRole = 'admin', onBack }) => {
  const isOwner = currentRole === 'admin';
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [filter, setFilter] = useState<FilterType>('All');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRoleGroup, setInviteRoleGroup] = useState<'PM' | 'Field' | 'Finance' | 'Owner'>('PM');
  const [inviteRoleTitle, setInviteRoleTitle] = useState('Project Manager');
  const [inviteDepartment, setInviteDepartment] = useState('Project Operations');

  const filtered = team.filter(m => {
    const matchRole = filter === 'All' || m.roleGroup === filter;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = {
    total: team.length,
    owner: team.filter(m => m.roleGroup === 'Owner').length,
    pm: team.filter(m => m.roleGroup === 'PM').length,
    finance: team.filter(m => m.roleGroup === 'Finance').length,
    field: team.filter(m => m.roleGroup === 'Field').length
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `t-${Date.now()}`,
      name: inviteName.trim(),
      role: inviteRoleTitle,
      department: inviteDepartment,
      roleGroup: inviteRoleGroup as 'Owner' | 'PM' | 'Finance' | 'Field',
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      presence: 'In Office',
      assignedProjects: [],
      certifications: ['OSHA 10 (Pending)'],
      emergencyContact: { name: 'N/A', relation: 'Contact', phone: '+1 (555) 000-0000' },
      location: 'Pending Onboarding',
      hireDate: 'Pending'
    };

    setTeam(prev => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member from Lattice? This action cannot be undone.')) {
      setTeam(prev => prev.filter(m => m.id !== memberId));
      setSelectedMember(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const handleMakeAdmin = (memberId: string, memberName: string) => {
    if (window.confirm(`Promote ${memberName} to Admin (Owner) role? They will have full company-wide access.`)) {
      setTeam(prev => prev.map(m => m.id === memberId
        ? { ...m, roleGroup: 'Owner', role: 'Company Administrator' }
        : m
      ));
      setSelectedMember(prev => prev ? { ...prev, roleGroup: 'Owner', role: 'Company Administrator' } : null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };
  if (selectedMember) {
    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] animate-fade-in">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMember(null)}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-[#0F172A] tracking-tight">Member Profile</h1>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30">
            Tier: {selectedMember.roleGroup}
          </span>
        </div>

        {/* Hero Card with Integrated Quick Action Trio */}
        <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden">
          {/* Top Profile Summary */}
          <div className="p-4 flex items-center gap-3.5">
            <img
              src={selectedMember.avatar}
              alt={selectedMember.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8F0] shadow-xs flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-[#0F172A] truncate">{selectedMember.name}</h2>
                {selectedMember.roleGroup === 'Owner' && (
                  <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#1677FF] font-semibold truncate mt-0.5">
                {selectedMember.designation || selectedMember.role}
              </p>
              <p className="text-[11px] text-[#64748B] font-medium truncate mt-0.5">{selectedMember.department} · {selectedMember.location}</p>
            </div>
          </div>

          {/* Integrated Action Toolbar (Unified Single Strip, Zero Card Bloat) */}
          <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]/70 grid grid-cols-3 divide-x divide-[#F1F5F9]">
            <a
              href={`tel:${selectedMember.phone}`}
              className="py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#1677FF] hover:bg-white transition-all group active:bg-[#F1F5F9]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-[#1677FF] group-hover:scale-105 transition-transform flex-shrink-0 shadow-2xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold">Call</span>
            </a>

            <a
              href={`mailto:${selectedMember.email}`}
              className="py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#1677FF] hover:bg-white transition-all group active:bg-[#F1F5F9]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-[#1677FF] group-hover:scale-105 transition-transform flex-shrink-0 shadow-2xs">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold">Email</span>
            </a>

            <button
              onClick={() => alert(`Opening Lattice Direct Chat with ${selectedMember.name}...`)}
              className="py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#1677FF] hover:bg-white transition-all cursor-pointer group active:bg-[#F1F5F9]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-[#1677FF] group-hover:scale-105 transition-transform flex-shrink-0 shadow-2xs">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold">Message</span>
            </button>
          </div>
        </div>

        {/* Contact Information (Level 2 List Group) */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-1">Contact Information</p>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#F1F5F9]">
            {/* Designation */}
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Briefcase className="w-4 h-4 text-[#1677FF] shrink-0" />
                <span className="text-[#64748B] font-medium">Designation</span>
              </div>
              <span className="font-bold text-[#0F172A] truncate max-w-[200px]">
                {selectedMember.designation || selectedMember.role}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-[#64748B] font-medium">Direct Phone</span>
              </div>
              <a href={`tel:${selectedMember.phone}`} className="font-bold text-[#1677FF] hover:underline">
                {selectedMember.phone}
              </a>
            </div>
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-[#64748B] font-medium">Work Email</span>
              </div>
              <a href={`mailto:${selectedMember.email}`} className="font-semibold text-[#0F172A] hover:text-[#1677FF] transition-colors truncate max-w-[200px]">
                {selectedMember.email}
              </a>
            </div>
            <div className="px-4 py-3 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-[#64748B] font-medium">Office / Work Address</span>
              </div>
              <span className="font-semibold text-[#0F172A] text-right leading-snug">
                {selectedMember.address || `${selectedMember.location}, Tampa, FL`}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-[#64748B] font-medium">Current Station</span>
              </div>
              <span className="font-semibold text-[#0F172A]">{selectedMember.location}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-[#64748B] font-medium">Joined Lattice</span>
              </div>
              <span className="font-semibold text-[#0F172A]">{selectedMember.hireDate}</span>
            </div>
          </div>
        </div>

        {/* Assigned Projects (Level 2 List Group) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Assigned Projects</p>
            <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">{selectedMember.assignedProjects.length} Active</span>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#F1F5F9]">
            {selectedMember.assignedProjects.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#64748B] italic">No active projects assigned.</div>
            ) : (
              selectedMember.assignedProjects.map((p, idx) => (
                <div key={idx} className="px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
                    <span className="font-semibold text-[#0F172A] truncate">{p}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] border border-[#1677FF]/25 px-2 py-0.5 rounded-md flex-shrink-0">
                    Assigned
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-1">Emergency Contact</p>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">{selectedMember.emergencyContact.name}</p>
              <p className="text-[11px] text-[#64748B] font-medium">{selectedMember.emergencyContact.relation}</p>
            </div>
            <a
              href={`tel:${selectedMember.emergencyContact.phone}`}
              className="px-3 py-1.5 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] hover:bg-[#dbeafe] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{selectedMember.emergencyContact.phone}</span>
            </a>
          </div>
        </div>

        {/* Owner-Only Admin Actions */}
        {isOwner && selectedMember.id !== 't-1' && (
          <div className="flex gap-2 pt-2">
            {selectedMember.roleGroup !== 'Owner' && (
              <button
                onClick={() => handleMakeAdmin(selectedMember.id, selectedMember.name)}
                className="flex-1 h-10 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#dbeafe] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Make Admin</span>
              </button>
            )}
            <button
              onClick={() => handleRemoveMember(selectedMember.id)}
              className="flex-1 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] animate-fade-in relative">

      {/* ── Top Header Bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 shadow-xs"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="text-base font-bold text-[#0F172A] tracking-tight">Team Directory</h1>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Invite</span>
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Action completed successfully!</span>
        </div>
      )}

      {/* ── Interactive KPI Stats Bar (Unified Filter) ── */}
      <div className="p-2 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
        <div className="grid grid-cols-5 gap-1">
          {/* Total / All */}
          <button
            onClick={() => setFilter('All')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
              filter === 'All'
                ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 transition-all ${
              filter === 'All' ? 'bg-[#1677FF] text-white' : 'bg-white border border-[#E2E8F0] text-[#1677FF]'
            }`}>
              <Users className="w-3 h-3" />
            </div>
            <span className="text-xs font-black tabular-nums text-[#0F172A]">{stats.total}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">All</span>
          </button>

          {/* Owner */}
          <button
            onClick={() => setFilter('Owner')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
              filter === 'Owner'
                ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 transition-all ${
              filter === 'Owner' ? 'bg-[#1677FF] text-white' : 'bg-white border border-[#E2E8F0] text-amber-500'
            }`}>
              <Crown className="w-3 h-3" />
            </div>
            <span className="text-xs font-black tabular-nums text-[#0F172A]">{stats.owner}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">Owner</span>
          </button>

          {/* PM */}
          <button
            onClick={() => setFilter('PM')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
              filter === 'PM'
                ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 transition-all ${
              filter === 'PM' ? 'bg-[#1677FF] text-white' : 'bg-white border border-[#E2E8F0] text-[#1677FF]'
            }`}>
              <Briefcase className="w-3 h-3" />
            </div>
            <span className="text-xs font-black tabular-nums text-[#0F172A]">{stats.pm}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">PM</span>
          </button>

          {/* Finance */}
          <button
            onClick={() => setFilter('Finance')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
              filter === 'Finance'
                ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 transition-all ${
              filter === 'Finance' ? 'bg-[#1677FF] text-white' : 'bg-white border border-[#E2E8F0] text-emerald-600'
            }`}>
              <DollarSign className="w-3 h-3" />
            </div>
            <span className="text-xs font-black tabular-nums text-[#0F172A]">{stats.finance}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">Finance</span>
          </button>

          {/* Field */}
          <button
            onClick={() => setFilter('Field')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
              filter === 'Field'
                ? 'bg-[#EAF3FF] border border-[#1677FF]/30 text-[#1677FF] shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 transition-all ${
              filter === 'Field' ? 'bg-[#1677FF] text-white' : 'bg-white border border-[#E2E8F0] text-[#1677FF]'
            }`}>
              <HardHat className="w-3 h-3" />
            </div>
            <span className="text-xs font-black tabular-nums text-[#0F172A]">{stats.field}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">Field</span>
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search team member by name or role..."
          className="w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl pl-9 pr-8 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors shadow-xs font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Team Member List Group (No Card Bloat) ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#F1F5F9]">
        {filtered.map(member => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F1F5F9] flex items-center justify-between gap-3"
          >
            {/* Left: Avatar + Name & Role */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">
                    {member.name}
                  </span>
                  {member.roleGroup === 'Owner' && (
                    <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-[#64748B] font-medium truncate leading-tight">
                  {member.role}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-all flex-shrink-0" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-[#64748B] p-8">
            <Users className="w-8 h-8 text-[#94A3B8]" />
            <p className="text-xs font-semibold text-[#0F172A]">No team members found</p>
          </div>
        )}
      </div>

      {/* ── Seat Usage Footer ── */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1677FF]" />
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Lattice Enterprise Seats</p>
            <p className="text-[10px] text-[#64748B]">{team.length} of 10 allocated seats active</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-[#1677FF]">{team.length}/10</span>
          <div className="w-20 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#1677FF] rounded-full" style={{ width: `${(team.length / 10) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ─── INVITE TEAM MEMBER MODAL ─── */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[390px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Invite Team Member</h3>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Work Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. david.v@averymarsh.com"
                  className="w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Direct Phone</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={e => setInvitePhone(e.target.value)}
                  placeholder="+1 (720) 555-0199"
                  className="w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Role</label>
                <div className="relative">
                  <select
                    value={inviteRoleGroup}
                    onChange={(e) => {
                      const val = e.target.value as 'PM' | 'Field' | 'Finance' | 'Owner';
                      setInviteRoleGroup(val);
                      if (val === 'PM') {
                        setInviteRoleTitle('Project Manager');
                        setInviteDepartment('Project Operations');
                      } else if (val === 'Field') {
                        setInviteRoleTitle('Site Superintendent');
                        setInviteDepartment('Field Operations');
                      } else if (val === 'Finance') {
                        setInviteRoleTitle('Finance Controller');
                        setInviteDepartment('Finance & Accounting');
                      } else if (val === 'Owner') {
                        setInviteRoleTitle('Company Administrator');
                        setInviteDepartment('Executive Management');
                      }
                    }}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl pl-3.5 pr-9 text-xs font-semibold text-[#0F172A] outline-none appearance-none cursor-pointer transition-colors shadow-2xs"
                  >
                    <option value="PM">Project Manager (PM)</option>
                    <option value="Field">Site Superintendent (Field)</option>
                    <option value="Finance">Finance Controller (Finance)</option>
                    {isOwner && <option value="Owner">Admin / Owner (Full Access)</option>}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9] mt-1">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-[#0F172A] font-bold hover:bg-[#E2E8F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inviteName.trim() || !inviteEmail.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#1677FF] text-white font-bold hover:bg-[#0F5FD7] disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
