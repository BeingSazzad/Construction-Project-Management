import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  Users, Phone, Search, UserPlus, ArrowLeft, Check, ShieldCheck, Mail
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ProjectTeamTabProps {
  project?: Project;
  onInviteMember?: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'PM' | 'Finance' | 'Field';
  phone: string;
  email: string;
  avatar: string;
  assignedProjects: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Johnson',
    role: 'Senior Project Manager',
    category: 'PM',
    phone: '+1 (555) 345-6789',
    email: 'sarah.j@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedProjects: 'Riverside Office Complex'
  },
  {
    id: 'tm-2',
    name: 'Michael Chang',
    role: 'Director of Project Finance',
    category: 'Finance',
    phone: '+1 (555) 456-7890',
    email: 'michael.c@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedProjects: 'Downtown Highrise, Riverside'
  },
  {
    id: 'tm-3',
    name: 'John Smith',
    role: 'Lead Field Superintendent',
    category: 'Field',
    phone: '+1 (555) 567-8901',
    email: 'john.s@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedProjects: 'Riverside Office Complex'
  },
  {
    id: 'tm-4',
    name: 'Mike Davis',
    role: 'QA/QC Site Engineer',
    category: 'Field',
    phone: '+1 (555) 678-9012',
    email: 'mike.d@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedProjects: 'Greenfield Hub'
  },
  {
    id: 'tm-5',
    name: 'Emily Brown',
    role: 'Field Safety Officer',
    category: 'Field',
    phone: '+1 (555) 789-0123',
    email: 'emily.b@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedProjects: 'Downtown Highrise'
  }
];

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({
  project
}) => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'PM' | 'Finance' | 'Field'>('All');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Project Manager (PM)');
  const [assignedProject, setAssignedProject] = useState(project?.name || 'Riverside Office Complex');

  const filteredMembers = members.filter(m => {
    if (roleFilter !== 'All' && m.category !== roleFilter) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !m.role.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      role,
      category: role.includes('Finance') ? 'Finance' : role.includes('PM') ? 'PM' : 'Field',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignedProjects: assignedProject
    };

    setMembers(prev => [newMember, ...prev]);
    setName('');
    setEmail('');
    setPhone('');
    setIsInviteOpen(false);
  };

  // Dedicated Full-Page Invite View
  if (isInviteOpen) {
    return (
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={() => setIsInviteOpen(false)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Team</span>
          </button>
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            Invite Member
          </span>
        </div>

        <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
          <div className="pb-3 border-b border-[#142036] mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                Add Team Member
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Assign roles, permissions & project access
              </p>
            </div>
          </div>

          <form onSubmit={handleInviteSubmit} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. David Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Work Email *</label>
              <input
                type="email"
                required
                placeholder="david.m@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Direct Mobile Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Assigned Role</label>
              <CustomSelect
                value={role}
                onChange={setRole}
                options={[
                  'Senior Project Manager (PM)',
                  'Director of Project Finance',
                  'Lead Field Superintendent',
                  'QA/QC Site Engineer',
                  'Field Safety Officer'
                ]}
                size="md"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Primary Project Assignment</label>
              <input
                type="text"
                value={assignedProject}
                onChange={(e) => setAssignedProject(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 h-10 rounded-xl border border-[#142036] bg-[#050811] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Team Count */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Team Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {members.length} Active Staff Members
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-9 px-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search staff, role, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {['All', 'PM', 'Finance', 'Field'].map((cat) => (
            <button
              key={cat}
              onClick={() => setRoleFilter(cat as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === cat
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
              }`}
            >
              {cat === 'All' ? 'All Roles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Team Member Cards */}
      <div className="flex flex-col gap-2.5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-3.5 bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 rounded-2xl shadow-sm flex items-center justify-between gap-3 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-11 h-11 rounded-full object-cover border border-[#142036] shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {member.name}
                </h3>
                <p className="text-[11px] text-blue-400 font-semibold truncate mt-0.5">
                  {member.role}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {member.assignedProjects}
                </p>
              </div>
            </div>

            <a
              href={`tel:${member.phone}`}
              className="w-9 h-9 rounded-xl bg-[#0E1A33] border border-[#1E325A] hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
              title="Call directly"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};
