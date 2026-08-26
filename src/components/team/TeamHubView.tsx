import React, { useState } from 'react';
import { User } from '../../types';
import {
  Users, Plus, Search, Shield, Briefcase,
  HardHat, BarChart3, ChevronRight, Mail,
  Phone, Check, Crown, UserCheck
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
  joinedDate: string;
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  'Owner': Crown,
  'PM': Briefcase,
  'Finance': BarChart3,
  'Field': HardHat,
};

const ROLE_COLORS: Record<string, string> = {
  'Owner':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'PM':      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Finance': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Field':   'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  'Active':   'text-emerald-400',
  'Invited':  'text-amber-400',
  'Inactive': 'text-slate-500',
};

const MOCK_TEAM: TeamMember[] = [
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
    joinedDate: 'Jan 2024',
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
    joinedDate: 'Mar 2024',
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
    joinedDate: 'Feb 2024',
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
    joinedDate: 'May 2024',
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
    joinedDate: '—',
  },
];

type FilterType = 'All' | 'Owner' | 'PM' | 'Finance' | 'Field';

interface TeamHubViewProps {
  currentUser?: User;
}

export const TeamHubView: React.FC<TeamHubViewProps> = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  const filtered = MOCK_TEAM.filter(m => {
    const matchFilter = filter === 'All' || m.roleGroup === filter;
    const matchSearch = !search || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: MOCK_TEAM.length,
    active: MOCK_TEAM.filter(m => m.status === 'Active').length,
    invited: MOCK_TEAM.filter(m => m.status === 'Invited').length,
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Team</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage access & roles</p>
        </div>
        <button
          onClick={() => { setShowInviteSuccess(true); setTimeout(() => setShowInviteSuccess(false), 2500); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Invite</span>
        </button>
      </div>

      {/* Invite success */}
      {showInviteSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          Invite sent successfully!
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
          <span className="text-lg font-black text-white mt-0.5">{stats.total}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active</span>
          <span className="text-lg font-black text-emerald-400 mt-0.5">{stats.active}</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending</span>
          <span className="text-lg font-black text-amber-400 mt-0.5">{stats.invited}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="w-full h-10 bg-[#0A111F] border border-[#142036] rounded-2xl pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/60 transition-all"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {(['All', 'Owner', 'PM', 'Finance', 'Field'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === f
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                : 'bg-[#0B111E] text-slate-400 hover:text-white border border-[#142036]'
            }`}
          >
            {f === 'All' ? 'All Roles' : f}
          </button>
        ))}
      </div>

      {/* Team Member Cards */}
      <div className="flex flex-col gap-2.5">
        {filtered.map(member => {
          const RoleIcon = ROLE_ICONS[member.roleGroup] || UserCheck;
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
                    member.status === 'Active' ? 'bg-emerald-400' :
                    member.status === 'Invited' ? 'bg-amber-400' : 'bg-slate-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{member.name}</span>
                    {member.roleGroup === 'Owner' && (
                      <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />
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

              <div className="mt-3 pt-3 border-t border-[#142036] flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{member.projects} project{member.projects !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${STATUS_COLORS[member.status]}`}>{member.status}</span>
                  <span>Joined {member.joinedDate}</span>
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
            <p className="text-[10px] text-slate-400">{stats.active} of 10 allocated seats active</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-blue-400">{stats.active}/10</span>
          <div className="w-20 h-1 bg-[#0D1524] rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(stats.active / 10) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
