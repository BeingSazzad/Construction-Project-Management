import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  Phone, Plus, UserPlus, HardHat, Shield, 
  Crown, Search, X, Check, Mail, UserCheck, Trash2, MoreVertical
} from 'lucide-react';

interface ProjectTeamTabProps {
  project?: Project;
}

interface ProjectStaff {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  avatar: string;
  type: 'gc' | 'trade';
  isOnSite: boolean;
}

// Available Company Directory Members in the system
const COMPANY_DIRECTORY: ProjectStaff[] = [
  {
    id: 'emp-1',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 345-6789',
    email: 'sarah.j@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: true
  },
  {
    id: 'emp-2',
    name: 'John Smith',
    role: 'Lead Field Superintendent',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 567-8901',
    email: 'john.s@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: true
  },
  {
    id: 'emp-3',
    name: 'Emily Brown',
    role: 'Site Safety Officer',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 789-0123',
    email: 'emily.b@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: false
  },
  {
    id: 'emp-4',
    name: 'Marcus Chen',
    role: 'Finance Controller',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 456-7890',
    email: 'marcus.c@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: false
  },
  {
    id: 'emp-5',
    name: 'Carlos Ortiz',
    role: 'Earthwork Site Foreman',
    company: 'Earthworks Pro LLC',
    phone: '+1 (555) 234-5678',
    email: 'carlos@earthworkspro.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'trade',
    isOnSite: true
  },
  {
    id: 'emp-6',
    name: 'Dave Miller',
    role: 'Structural Concrete Lead',
    company: 'Concrete Solutions Inc.',
    phone: '+1 (555) 345-8901',
    email: 'dave.m@concretesolutions.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'trade',
    isOnSite: true
  },
  {
    id: 'emp-7',
    name: 'Rob Jenkins',
    role: 'MEP Electrical Foreman',
    company: 'Prime MEP & Electric',
    phone: '+1 (555) 456-9012',
    email: 'rob.j@primemep.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    type: 'trade',
    isOnSite: false
  },
  {
    id: 'emp-8',
    name: 'Priya Nair',
    role: 'Assistant Project Manager',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 901-2345',
    email: 'priya.n@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: false
  }
];

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ project }) => {
  // Assigned staff for this active project (starts with lead PM + initial on-site staff)
  const [assignedStaff, setAssignedStaff] = useState<ProjectStaff[]>([
    COMPANY_DIRECTORY[0], // Lead PM Sarah Johnson
    COMPANY_DIRECTORY[1], // Field Super John Smith
    COMPANY_DIRECTORY[2], // Safety Emily Brown
    COMPANY_DIRECTORY[4], // Earthwork Carlos
    COMPANY_DIRECTORY[5], // Concrete Dave
  ]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'directory' | 'invite'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Invite new external form state
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Trade Subcontractor Lead');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');

  // Lead Project Manager is always the primary lead
  const leadPM = assignedStaff.find(s => s.role.toLowerCase().includes('lead project manager')) || {
    id: 'lead-1',
    name: project?.projectManager.name || 'Sarah Johnson',
    role: 'Lead Project Manager',
    company: 'Avery & Marsh Construction',
    phone: '+1 (555) 345-6789',
    email: 'lead.pm@averymarsh.com',
    avatar: project?.projectManager.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    type: 'gc' as const,
    isOnSite: true
  };

  const otherStaff = assignedStaff.filter(s => s.id !== leadPM.id);

  // Toggle on-site status
  const toggleOnSite = (staffId: string) => {
    setAssignedStaff(prev => prev.map(s => s.id === staffId ? { ...s, isOnSite: !s.isOnSite } : s));
  };

  // Remove staff from project
  const handleRemoveStaff = (staffId: string) => {
    if (window.confirm("Are you sure you want to remove this member from this project?")) {
      setAssignedStaff(prev => prev.filter(s => s.id !== staffId));
    }
  };

  // Set selected staff as Lead PM
  const handleMakeLead = (newLead: ProjectStaff) => {
    if (window.confirm(`Are you sure you want to make ${newLead.name} the Lead Project Manager for this project?`)) {
      setAssignedStaff(prev => {
        return prev.map(s => {
          if (s.id === newLead.id) {
            return { ...s, role: 'Lead Project Manager' };
          }
          if (s.role === 'Lead Project Manager') {
            return { ...s, role: 'Project Manager' };
          }
          return s;
        });
      });
    }
  };

  // Add from company directory with 1 click
  const handleAssignFromDirectory = (member: ProjectStaff) => {
    if (assignedStaff.some(s => s.id === member.id)) {
      alert(`${member.name} is already assigned to this project.`);
      return;
    }
    setAssignedStaff(prev => [...prev, member]);
    setIsAssignModalOpen(false);
  };

  // Invite new external member submit
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const newStaff: ProjectStaff = {
      id: `ext-${Date.now()}`,
      name: inviteName.trim(),
      role: inviteRole,
      company: inviteCompany.trim() || 'Subcontractor Partner',
      phone: invitePhone.trim() || '+1 (555) 000-0000',
      email: inviteEmail.trim() || 'trade@partner.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      type: 'trade',
      isOnSite: true
    };

    setAssignedStaff(prev => [...prev, newStaff]);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteCompany('');
    setIsAssignModalOpen(false);
  };

  // Filter company directory for modal search
  const availableDirectoryMembers = COMPANY_DIRECTORY.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.company.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Project Team</h2>
          <p className="text-xs text-slate-400 mt-0.5">Assigned On-Site & GC Leadership</p>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setModalTab('directory');
            setIsAssignModalOpen(true);
          }}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* ─── 2. PROJECT LEADERSHIP (Lead PM Card) ─── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Project Lead</span>
          </div>
          <span className="text-[12px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            🟢 Active Lead
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#1E2E4A] flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={leadPM.avatar}
                alt={leadPM.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#070D1A] rounded-full" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{leadPM.name}</h3>
              <p className="text-xs text-blue-400 font-semibold truncate mt-0.5">
                {leadPM.role}
              </p>
            </div>
          </div>

          <a
            href={`tel:${leadPM.phone}`}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-transform flex-shrink-0"
            title={`Call ${leadPM.name}`}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ─── 3. ASSIGNED PROJECT STAFF & SUB FOREMEN ─── */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Team & Trade Foremen ({otherStaff.length})
          </span>
          <span className="text-[12px] text-slate-400 font-medium">
            {assignedStaff.filter(s => s.isOnSite).length} On-Site Today
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {otherStaff.map((staff) => (
            <div
              key={staff.id}
              className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-[#1E2E4A] flex items-center justify-between gap-3 shadow-sm transition-all relative"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#1A263E]"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#070D1A] ${
                    staff.isOnSite ? 'bg-emerald-500' : 'bg-slate-500'
                  }`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{staff.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      staff.type === 'gc'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {staff.type === 'gc' ? 'GC' : 'Sub'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5 truncate">
                    {staff.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* 3-Dot More Action Button */}
                <button
                  type="button"
                  onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                  className="w-8 h-8 rounded-lg bg-[#0E1A33] hover:bg-[#14264A] text-slate-400 border border-[#1E325A] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                  title="More Actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu Overlay */}
                {activeMenuId === staff.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-20 cursor-default" 
                      onClick={() => setActiveMenuId(null)} 
                    />
                    <div className="absolute right-3 top-12 w-44 bg-[#0A111F] border border-[#1E2D4A] rounded-xl shadow-xl p-1 z-30 flex flex-col gap-0.5 animate-fade-in">
                      {/* Direct Call Option */}
                      <a
                        href={`tel:${staff.phone}`}
                        onClick={() => setActiveMenuId(null)}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#142036] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-400" />
                        <span>Call Staff</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          toggleOnSite(staff.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#142036] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{staff.isOnSite ? 'Mark Off Site' : 'Mark On Site'}</span>
                      </button>

                      {staff.type === 'gc' && (
                        <button
                          type="button"
                          onClick={() => {
                            handleMakeLead(staff);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-[#142036] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>Make Project Lead</span>
                        </button>
                      )}

                      <div className="h-px bg-[#142036] my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveStaff(staff.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove from Project</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. SMART ASSIGN TEAM MEMBER MODAL ─── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[400px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Add Team Member to Project</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">Select from Company Directory or Invite</p>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Switch: Company Directory vs Invite External */}
            <div className="flex items-center gap-1.5 p-1 bg-[#050811] rounded-xl border border-[#142036]">
              <button
                type="button"
                onClick={() => setModalTab('directory')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  modalTab === 'directory'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white font-semibold'
                }`}
              >
                Company Directory ({COMPANY_DIRECTORY.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('invite')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  modalTab === 'invite'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white font-semibold'
                }`}
              >
                Invite New Person
              </button>
            </div>

            {modalTab === 'directory' ? (
              <div className="flex flex-col gap-2.5">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, or trade..."
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-8 pr-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                {/* Member List */}
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-0.5">
                  {availableDirectoryMembers.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No company members match search.</p>
                  ) : (
                    availableDirectoryMembers.map((member) => {
                      const isAlreadyAssigned = assignedStaff.some(s => s.id === member.id);

                      return (
                        <div
                          key={member.id}
                          className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex items-center justify-between gap-2.5 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#1A263E] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{member.role} · {member.company}</p>
                            </div>
                          </div>

                          {isAlreadyAssigned ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex-shrink-0">
                              Assigned
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAssignFromDirectory(member)}
                              className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-bold cursor-pointer shadow-sm active:scale-95 transition-all flex-shrink-0 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Assign</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Invite New External Member Form */
              <form onSubmit={handleInviteSubmit} className="flex flex-col gap-2.5 text-xs">
                <div>
                  <label className="text-[12px] text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[12px] text-slate-400 block mb-1">On-Site Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical Foreman"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>


                <div>
                  <label className="text-[12px] text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="trade@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Add to Roster
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
