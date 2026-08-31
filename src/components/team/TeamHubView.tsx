import React, { useState } from 'react';
import { User } from '../../types';
import {
  Users, Plus, Search, Shield, Briefcase,
  HardHat, BarChart3, ChevronRight, Mail,
  Phone, Check, Crown, UserCheck, X, CheckCircle2,
  MessageSquare, Award, AlertTriangle, MapPin, Calendar,
  ExternalLink, Building2
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
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
  hireDate: string;
}

const ROLE_COLORS: Record<string, string> = {
  'Owner':   'bg-blue-600/20 text-[#60A5FA] border-blue-500/30 font-bold',
  'PM':      'bg-blue-500/10 text-blue-300 border-blue-500/20 font-semibold',
  'Finance': 'bg-[#122444] text-blue-300 border-blue-400/20 font-semibold',
  'Field':   'bg-[#0F1C36] text-amber-300 border-amber-500/30 font-semibold',
};

const PRESENCE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'On Site':   { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'In Office': { bg: 'bg-blue-500/10 border-blue-500/20',       text: 'text-blue-400',    dot: 'bg-blue-400' },
  'Remote':    { bg: 'bg-purple-500/10 border-purple-500/20',   text: 'text-purple-400',  dot: 'bg-purple-400' },
  'Off Duty':  { bg: 'bg-slate-500/10 border-slate-500/20',     text: 'text-slate-400',   dot: 'bg-slate-500' },
};

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't-1',
    name: 'Avery Marsh',
    role: 'Principal General Contractor & Owner',
    department: 'Executive Management',
    roleGroup: 'Owner',
    email: 'avery@averymarsh.com',
    phone: '+1 (720) 555-0111',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'In Office',
    assignedProjects: ['Riverside Office Complex', '104 Ocean Drive', 'Highland Park Modern', 'Aspen Creek Estate'],
    certifications: ['Class A General Contractor License', 'OSHA 30', 'LEED AP BD+C'],
    emergencyContact: { name: 'Elena Marsh', relation: 'Spouse', phone: '+1 (720) 555-0199' },
    location: 'Denver HQ',
    hireDate: 'Jan 2018'
  },
  {
    id: 't-2',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    department: 'Project Operations',
    roleGroup: 'PM',
    email: 'sarah.j@averymarsh.com',
    phone: '+1 (720) 555-0122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'On Site',
    assignedProjects: ['Riverside Office Complex', '104 Ocean Drive', 'Highland Park Modern'],
    certifications: ['PMP® Certified', 'OSHA 30 Construction', 'Procore Certified: PM'],
    emergencyContact: { name: 'Mark Johnson', relation: 'Spouse', phone: '+1 (720) 555-0188' },
    location: 'Riverside Field Trailer',
    hireDate: 'Mar 2021'
  },
  {
    id: 't-3',
    name: 'Marcus Chen',
    role: 'Chief Financial Controller',
    department: 'Finance & Accounting',
    roleGroup: 'Finance',
    email: 'marcus.c@averymarsh.com',
    phone: '+1 (720) 555-0133',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'In Office',
    assignedProjects: ['Riverside Office Complex', '104 Ocean Drive', 'Highland Park Modern', 'Aspen Creek Estate'],
    certifications: ['CPA Certified', 'CCIFP (Construction Financial Pro)', 'AIA G702/G703 Specialist'],
    emergencyContact: { name: 'Vivian Chen', relation: 'Spouse', phone: '+1 (720) 555-0177' },
    location: 'Denver HQ',
    hireDate: 'Jun 2020'
  },
  {
    id: 't-4',
    name: 'Jake Torres',
    role: 'Senior Site Superintendent',
    department: 'Field Operations',
    roleGroup: 'Field',
    email: 'jake.t@averymarsh.com',
    phone: '+1 (720) 555-0144',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    presence: 'On Site',
    assignedProjects: ['104 Ocean Drive', 'Riverside Office Complex'],
    certifications: ['OSHA 30 Construction Safety', 'CPR & First Aid Trainer', 'Rigging & Signalperson Level 2', 'Stormwater BMP Inspector'],
    emergencyContact: { name: 'Carmen Torres', relation: 'Spouse', phone: '+1 (720) 555-0166' },
    location: '104 Ocean Drive Site',
    hireDate: 'Feb 2019'
  },
  {
    id: 't-5',
    name: 'Priya Nair',
    role: 'Assistant Project Manager',
    department: 'Project Operations',
    roleGroup: 'PM',
    email: 'priya.n@averymarsh.com',
    phone: '+1 (720) 555-0155',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Invited',
    presence: 'Off Duty',
    assignedProjects: ['Aspen Creek Estate'],
    certifications: ['OSHA 10 Construction', 'CAPM Certified', 'Autodesk Construction Cloud'],
    emergencyContact: { name: 'Rohan Nair', relation: 'Brother', phone: '+1 (720) 555-0150' },
    location: 'Pending Onboarding',
    hireDate: 'Scheduled Sep 2026'
  },
];

type FilterType = 'All' | 'Owner' | 'PM' | 'Finance' | 'Field';

interface TeamHubViewProps {
  currentUser?: User;
}

export const TeamHubView: React.FC<TeamHubViewProps> = () => {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleGroup, setInviteRoleGroup] = useState<'PM' | 'Finance' | 'Field'>('PM');
  const [inviteRoleTitle, setInviteRoleTitle] = useState('Project Manager');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteDepartment, setInviteDepartment] = useState('Project Operations');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const filtered = team.filter(m => {
    const matchFilter = filter === 'All' || m.roleGroup === filter;
    const matchSearch = !search || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.certifications.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const stats = {
    total: team.length,
    active: team.filter(m => m.status === 'Active').length,
    onSite: team.filter(m => m.presence === 'On Site').length,
    inOffice: team.filter(m => m.presence === 'In Office').length,
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `t-${Date.now()}`,
      name: inviteName.trim(),
      role: inviteRoleTitle,
      department: inviteDepartment,
      roleGroup: inviteRoleGroup,
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Invited',
      presence: 'Off Duty',
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

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white tracking-tight">Team Directory</h1>
          <p className="text-[11px] text-slate-400 font-medium">Company staff, roles & field assignments</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-900/40 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Invitation successfully sent!</span>
        </div>
      )}

      {/* ── KPI Stats Bar ── */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036] flex flex-col justify-between h-[68px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</span>
          <span className="text-base font-black text-white tabular-nums">{stats.total}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036] flex flex-col justify-between h-[68px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">On Site</span>
          <span className="text-base font-black text-emerald-400 tabular-nums">{stats.onSite}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036] flex flex-col justify-between h-[68px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Office</span>
          <span className="text-base font-black text-blue-400 tabular-nums">{stats.inOffice}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036] flex flex-col justify-between h-[68px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
          <span className="text-base font-black text-white tabular-nums">{stats.active}</span>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, role, or certification..."
          className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500/70 rounded-xl pl-9 pr-8 text-xs text-white placeholder-slate-500 outline-none transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Role Filter Tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {(['All', 'Owner', 'PM', 'Finance', 'Field'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
              filter === f
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                : 'bg-[#060B17] border-[#142036] text-slate-400 hover:text-white hover:border-[#1E2C48]'
            }`}
          >
            {f === 'All' ? 'All Roles' : f}
          </button>
        ))}
      </div>

      {/* ── Team Member Cards (High Quality Product Design) ── */}
      <div className="flex flex-col gap-2.5">
        {filtered.map(member => {
          const presenceStyle = PRESENCE_COLORS[member.presence] || PRESENCE_COLORS['In Office'];
          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] hover:border-[#1E3050] transition-all cursor-pointer group active:scale-[0.99] flex flex-col gap-2.5 shadow-sm"
            >
              {/* Member Main Row */}
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0 mt-0.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#1A263B]"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#060B17] ${
                    member.status === 'Active' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{member.name}</span>
                      {member.roleGroup === 'Owner' && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    {/* Presence Pill */}
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${presenceStyle.bg} ${presenceStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${presenceStyle.dot}`} />
                      {member.presence}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium truncate leading-tight">{member.role}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{member.department}</p>
                </div>
              </div>

              {/* Quick Contact & Action Bar (1-Tap Direct Action) */}
              <div className="flex items-center justify-between pt-2 border-t border-[#142036]/70 text-[11px]">
                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 text-slate-300 hover:text-blue-400 text-[10px] font-semibold transition-colors"
                    title={`Call ${member.phone}`}
                  >
                    <Phone className="w-3 h-3 text-blue-400" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 text-slate-300 hover:text-blue-400 text-[10px] font-semibold transition-colors"
                    title={`Email ${member.email}`}
                  >
                    <Mail className="w-3 h-3 text-blue-400" />
                    <span>Email</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <Briefcase className="w-3 h-3 text-blue-400" />
                  <span>{member.assignedProjects.length} project{member.assignedProjects.length !== 1 ? 's' : ''}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors ml-0.5" />
                </div>
              </div>

              {/* Certifications Badge Row */}
              {member.certifications.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Award className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <div className="flex gap-1 overflow-hidden">
                    {member.certifications.slice(0, 2).map((cert, idx) => (
                      <span key={idx} className="text-[9px] font-medium bg-[#0A1328] border border-[#1A2744] text-slate-400 px-1.5 py-0.5 rounded-md truncate max-w-[140px]">
                        {cert}
                      </span>
                    ))}
                    {member.certifications.length > 2 && (
                      <span className="text-[9px] font-semibold text-slate-500">
                        +{member.certifications.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-500">
            <Users className="w-8 h-8 opacity-30" />
            <p className="text-xs font-semibold">No team members found</p>
          </div>
        )}
      </div>

      {/* ── Seat Usage Footer ── */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs font-bold text-white">Lattice Enterprise Seats</p>
            <p className="text-[10px] text-slate-400">{team.length} of 10 allocated seats active</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-blue-400">{team.length}/10</span>
          <div className="w-20 h-1.5 bg-[#0A1328] rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(team.length / 10) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ─── 10-YR PRODUCT DESIGNER STANDARD: MEMBER PROFILE MODAL ─── */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in font-sans"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="w-full max-w-[430px] bg-[#070C18] border border-[#142036] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 max-h-[88vh] overflow-y-auto shadow-2xl shadow-blue-950/40 text-slate-100 animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto -mt-1 sm:hidden" />

            {/* Profile Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#1A263B]"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#070C18] ${
                    selectedMember.status === 'Active' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white truncate">{selectedMember.name}</h3>
                    {selectedMember.roleGroup === 'Owner' && (
                      <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-blue-400 font-bold truncate mt-0.5">{selectedMember.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{selectedMember.department} · {selectedMember.location}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-[#0A1328] border border-[#1A2744] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Grid (1-Tap Call, Email, Message) */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${selectedMember.phone}`}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 text-slate-200 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold">Call Phone</span>
              </a>
              <a
                href={`mailto:${selectedMember.email}`}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 text-slate-200 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold">Send Email</span>
              </a>
              <button
                onClick={() => alert(`Opening Lattice Direct Chat with ${selectedMember.name}...`)}
                className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] hover:border-purple-500/40 text-slate-200 hover:text-purple-400 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold">Direct Chat</span>
              </button>
            </div>

            {/* Direct Contact & Details Box */}
            <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-2.5 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Direct Phone:</span>
                <a href={`tel:${selectedMember.phone}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                  {selectedMember.phone}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Work Email:</span>
                <a href={`mailto:${selectedMember.email}`} className="font-bold text-white hover:text-blue-400 transition-colors truncate max-w-[220px]">
                  {selectedMember.email}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Station:</span>
                <span className="font-semibold text-slate-200">{selectedMember.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Joined Lattice:</span>
                <span className="font-semibold text-slate-200">{selectedMember.hireDate}</span>
              </div>
            </div>

            {/* Active Project Assignments */}
            <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Projects</h4>
                <span className="text-[10px] font-bold text-blue-400">{selectedMember.assignedProjects.length} Active</span>
              </div>
              
              {selectedMember.assignedProjects.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-1">No active projects assigned.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {selectedMember.assignedProjects.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#0A1328] border border-[#1A2744]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-white truncate">{p}</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex-shrink-0">
                        Assigned
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Safety & Compliance Certifications */}
            <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety & Professional Qualifications</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.certifications.map((c, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-200 bg-[#0A1328] border border-[#1A2744] px-2.5 py-1 rounded-xl">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{selectedMember.emergencyContact.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{selectedMember.emergencyContact.relation}</p>
                </div>
                <a
                  href={`tel:${selectedMember.emergencyContact.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{selectedMember.emergencyContact.phone}</span>
                </a>
              </div>
            </div>

            {/* Role & Access Tier Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-[#142036] text-xs">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${ROLE_COLORS[selectedMember.roleGroup]}`}>
                Tier: {selectedMember.roleGroup}
              </span>
              <button
                onClick={() => alert(`Editing permissions for ${selectedMember.name}...`)}
                className="px-3 py-1.5 rounded-xl bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 text-slate-300 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
              >
                Manage Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INVITE TEAM MEMBER MODAL ─── */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white">Invite Team Member</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Add a new staff member to company directory</p>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full h-10 bg-[#060B17] border border-[#142036] rounded-xl px-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500/70"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Work Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. david.v@averymarsh.com"
                  className="w-full h-10 bg-[#060B17] border border-[#142036] rounded-xl px-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500/70"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Direct Phone</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={e => setInvitePhone(e.target.value)}
                  placeholder="+1 (720) 555-0199"
                  className="w-full h-10 bg-[#060B17] border border-[#142036] rounded-xl px-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500/70"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Role & Permissions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PM', label: 'PM', title: 'Project Manager', dept: 'Project Operations' },
                    { id: 'Field', label: 'Field', title: 'Site Superintendent', dept: 'Field Operations' },
                    { id: 'Finance', label: 'Finance', title: 'Finance Controller', dept: 'Finance & Accounting' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setInviteRoleGroup(r.id as any);
                        setInviteRoleTitle(r.title);
                        setInviteDepartment(r.dept);
                      }}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all border cursor-pointer ${
                        inviteRoleGroup === r.id
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-[#060B17] border-[#142036] text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0E1A33] text-slate-400 font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inviteName.trim() || !inviteEmail.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-md shadow-blue-900/30"
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
