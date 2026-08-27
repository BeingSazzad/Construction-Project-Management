import React, { useState } from 'react';
import { User } from '../../types';
import {
  Users, Plus, Search, Shield, Briefcase,
  HardHat, BarChart3, ChevronRight, Mail,
  Phone, Check, Crown, UserCheck, X, CheckCircle2
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleGroup: 'Owner' | 'PM' | 'Finance' | 'Field';
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Invited' | 'Inactive';
  projects: number;
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  'Owner': Crown,
  'PM': Briefcase,
  'Finance': BarChart3,
  'Field': HardHat,
};

const ROLE_COLORS: Record<string, string> = {
  'Owner':   'bg-blue-600/20 text-[#60A5FA] border-blue-500/30 font-bold',
  'PM':      'bg-blue-500/10 text-blue-300 border-blue-500/20 font-semibold',
  'Finance': 'bg-[#122444] text-blue-300 border-blue-400/20 font-semibold',
  'Field':   'bg-[#0F1C36] text-slate-300 border-[#1E325A] font-semibold',
};

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't-1',
    name: 'Avery Marsh',
    role: 'Company Owner',
    roleGroup: 'Owner',
    email: 'avery@averymarsh.com',
    phone: '+1 (720) 555-0111',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    projects: 4,
  },
  {
    id: 't-2',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    roleGroup: 'PM',
    email: 'sarah.j@averymarsh.com',
    phone: '+1 (720) 555-0122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    projects: 3,
  },
  {
    id: 't-3',
    name: 'Marcus Chen',
    role: 'Finance Controller',
    roleGroup: 'Finance',
    email: 'marcus.c@averymarsh.com',
    phone: '+1 (720) 555-0133',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    projects: 4,
  },
  {
    id: 't-4',
    name: 'Jake Torres',
    role: 'Site Superintendent',
    roleGroup: 'Field',
    email: 'jake.t@averymarsh.com',
    phone: '+1 (720) 555-0144',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    projects: 2,
  },
  {
    id: 't-5',
    name: 'Priya Nair',
    role: 'Project Manager',
    roleGroup: 'PM',
    email: 'priya.n@averymarsh.com',
    phone: '+1 (720) 555-0155',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Invited',
    projects: 0,
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
  
  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleGroup, setInviteRoleGroup] = useState<'PM' | 'Finance' | 'Field'>('PM');
  const [inviteRoleTitle, setInviteRoleTitle] = useState('Project Manager');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const filtered = team.filter(m => {
    const matchFilter = filter === 'All' || m.roleGroup === filter;
    const matchSearch = !search || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: team.length,
    active: team.filter(m => m.status === 'Active').length,
    invited: team.filter(m => m.status === 'Invited').length,
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `t-${Date.now()}`,
      name: inviteName.trim(),
      role: inviteRoleTitle,
      roleGroup: inviteRoleGroup,
      email: inviteEmail.trim(),
      phone: '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Invited',
      projects: 0,
    };

    setTeam(prev => [...prev, newMember]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Team</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Manage access & roles</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/40 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Invite</span>
        </button>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Invitation successfully sent!</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
          <span className="text-lg font-black text-white mt-0.5">{stats.total}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active</span>
          <span className="text-lg font-black text-emerald-400 mt-0.5">{stats.active}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Invited</span>
          <span className="text-lg font-black text-blue-400 mt-0.5">{stats.invited}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="w-full h-11 bg-[#0A111F] border border-[#142036] focus:border-blue-500/70 rounded-2xl pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-colors"
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

      {/* Role Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {(['All', 'Owner', 'PM', 'Finance', 'Field'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
              filter === f
                ? 'bg-[#2563EB] border-blue-500 text-white shadow-sm'
                : 'bg-[#0A111F] border-[#142036] text-slate-400 hover:text-white hover:border-[#1E2C48]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Team Member Cards */}
      <div className="flex flex-col gap-2.5">
        {filtered.map(member => {
          return (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-[#1E2C48] transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#1A263B]"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A111F] ${
                    member.status === 'Active' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{member.name}</span>
                    {member.roleGroup === 'Owner' && (
                      <Crown className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[member.roleGroup]}`}>
                      {member.roleGroup}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">{member.role}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#142036] flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>{member.projects} project{member.projects !== 1 ? 's' : ''} assigned</span>
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-500">
            <Users className="w-8 h-8 opacity-30" />
            <p className="text-sm font-semibold">No team members found</p>
          </div>
        )}
      </div>

      {/* Seat usage footer */}
      <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-[11px] font-bold text-white">Seat Usage</p>
            <p className="text-[10px] text-slate-400">{stats.active + stats.invited} of 10 allocated seats used</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-blue-400">{stats.active + stats.invited}/10</span>
          <div className="w-20 h-1 bg-[#0D1524] rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${((stats.active + stats.invited) / 10) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ─── INVITE TEAM MEMBER MODAL ─── */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white">Invite Team Member</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Send an invitation to join Avery Marsh</p>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full h-11 bg-[#0A111F] border border-[#142036] rounded-xl px-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500/70"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Work Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. david.v@averymarsh.com"
                  className="w-full h-11 bg-[#0A111F] border border-[#142036] rounded-xl px-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500/70"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Role & Permissions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PM', label: 'PM', title: 'Project Manager' },
                    { id: 'Field', label: 'Field', title: 'Site Superintendent' },
                    { id: 'Finance', label: 'Finance', title: 'Finance Controller' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setInviteRoleGroup(r.id as any);
                        setInviteRoleTitle(r.title);
                      }}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all border cursor-pointer ${
                        inviteRoleGroup === r.id
                          ? 'bg-[#2563EB] border-blue-500 text-white'
                          : 'bg-[#0A111F] border-[#142036] text-slate-400 hover:text-white'
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
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] disabled:opacity-40 cursor-pointer active:scale-95 transition-all shadow-md"
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
