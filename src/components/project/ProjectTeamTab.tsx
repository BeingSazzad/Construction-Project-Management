import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  Phone, UserPlus, Crown, Search, X, UserCheck, Trash2, MoreVertical
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
    company: 'Lattice Construction',
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
    company: 'Lattice Construction',
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
    company: 'Lattice Construction',
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
    company: 'Lattice Construction',
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
  }
];

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = () => {
  const [assignedStaff, setAssignedStaff] = useState<ProjectStaff[]>([
    COMPANY_DIRECTORY[0], // Lead PM
    COMPANY_DIRECTORY[1], // Superintendent
    COMPANY_DIRECTORY[4], // Earthwork
    COMPANY_DIRECTORY[5], // Concrete
  ]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'directory' | 'invite'>('directory');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for external invites
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteType, setInviteType] = useState<'gc' | 'trade'>('trade');

  // Identify Lead PM
  const leadPM = assignedStaff.find(s => s.role.toLowerCase().includes('lead') || s.role.toLowerCase().includes('manager')) || assignedStaff[0] || {
    id: 'emp-0',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    company: 'Lattice Construction',
    phone: '+1 (555) 345-6789',
    email: 'sarah.j@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    type: 'gc',
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
      role: inviteRole.trim() || (inviteType === 'gc' ? 'Field Coordinator' : 'Trade Foreman'),
      company: inviteType === 'gc' ? 'Lattice Construction' : (inviteCompany.trim() || 'Subcontractor Partner'),
      phone: invitePhone.trim() || '+1 (555) 000-0000',
      email: inviteEmail.trim() || 'trade@partner.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      type: inviteType,
      isOnSite: true
    };

    setAssignedStaff(prev => [...prev, newStaff]);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteCompany('');
    setInviteType('trade');
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
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Project Team</h2>
          <p className="text-xs text-[#68707C] mt-0.5">Assigned On-Site & GC Leadership</p>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setModalTab('directory');
            setIsAssignModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* ─── 2. PROJECT LEADERSHIP (Lead PM Card) ─── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1677FF] uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Project Lead</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            🟢 Active Lead
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={leadPM.avatar}
                alt={leadPM.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#1677FF] shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#171A1F] truncate">{leadPM.name}</h3>
              <p className="text-xs text-[#1677FF] font-semibold truncate mt-0.5">
                {leadPM.role}
              </p>
            </div>
          </div>

          <a
            href={`tel:${leadPM.phone}`}
            className="w-9 h-9 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform flex-shrink-0"
            title={`Call ${leadPM.name}`}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* ─── 3. ASSIGNED PROJECT STAFF & SUB FOREMEN ─── */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold text-[#68707C] uppercase tracking-wider">
            Team & Trade Foremen ({otherStaff.length})
          </span>
          <span className="text-[12px] text-[#68707C] font-medium">
            {assignedStaff.filter(s => s.isOnSite).length} On-Site Today
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {otherStaff.map((staff) => (
            <div
              key={staff.id}
              className="p-3 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 flex items-center justify-between gap-3 shadow-xs transition-all relative"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#DDE1E7]"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    staff.isOnSite ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#171A1F] truncate">{staff.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      staff.type === 'gc'
                        ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {staff.type === 'gc' ? 'GC' : 'Sub'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#68707C] font-medium mt-0.5 truncate">
                    {staff.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* 3-Dot More Action Button */}
                <button
                  type="button"
                  onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                  className="w-8 h-8 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] border border-[#DDE1E7] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
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
                    <div className="absolute right-3 top-12 w-48 bg-white border border-[#DDE1E7] rounded-xl shadow-xl p-1 z-30 flex flex-col gap-0.5 animate-fade-in text-[#171A1F]">
                      <a
                        href={`tel:${staff.phone}`}
                        onClick={() => setActiveMenuId(null)}
                        className="w-full text-left px-3 py-2 rounded-lg text-[#171A1F] hover:bg-[#F2F2F7] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#1677FF]" />
                        <span>Call Staff</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          toggleOnSite(staff.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-[#171A1F] hover:bg-[#F2F2F7] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{staff.isOnSite ? 'Mark Off Site' : 'Mark On Site'}</span>
                      </button>

                      {staff.type === 'gc' && (
                        <button
                          type="button"
                          onClick={() => {
                            handleMakeLead(staff);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>Make Project Lead</span>
                        </button>
                      )}

                      <div className="h-px bg-[#EAEDF1] my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveStaff(staff.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-3.5 text-[#171A1F] scrollbar-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                    Add Team Member
                  </h3>
                  <p className="text-xs text-[#68707C] font-medium mt-0.5 truncate">
                    Select from Company Directory or Invite
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Switch: Company Directory vs Invite External */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F2F2F7] rounded-xl border border-[#DDE1E7]">
              <button
                type="button"
                onClick={() => setModalTab('directory')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  modalTab === 'directory'
                    ? 'bg-white text-[#171A1F] shadow-xs'
                    : 'text-[#68707C] hover:text-[#171A1F] font-semibold'
                }`}
              >
                Company Directory ({COMPANY_DIRECTORY.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('invite')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  modalTab === 'invite'
                    ? 'bg-white text-[#171A1F] shadow-xs'
                    : 'text-[#68707C] hover:text-[#171A1F] font-semibold'
                }`}
              >
                Invite New Person
              </button>
            </div>

            {modalTab === 'directory' ? (
              <div className="flex flex-col gap-2.5">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#68707C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, role, or trade..."
                    className="w-full h-9 bg-white border border-[#DDE1E7] rounded-xl pl-8 pr-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                {/* Member List */}
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-0.5">
                  {availableDirectoryMembers.length === 0 ? (
                    <p className="text-xs text-[#68707C] py-4 text-center">No company members match search.</p>
                  ) : (
                    availableDirectoryMembers.map((member) => {
                      const isAlreadyAssigned = assignedStaff.some(s => s.id === member.id);

                      return (
                        <div
                          key={member.id}
                          className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex items-center justify-between gap-2.5 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#171A1F] truncate">{member.name}</h4>
                              <p className="text-xs text-[#68707C] truncate">{member.role} · {member.company}</p>
                            </div>
                          </div>

                          {isAlreadyAssigned ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                              Assigned
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAssignFromDirectory(member)}
                              className="px-2.5 py-1 rounded-lg bg-[#1677FF] hover:bg-[#0958D9] text-white text-[12px] font-bold cursor-pointer shadow-xs active:scale-95 transition-all flex-shrink-0 flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
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
                  <label className="text-[12px] text-[#68707C] block mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full h-9 bg-white border border-[#DDE1E7] rounded-lg px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                {/* Affiliation / Member Type Selector */}
                <div>
                  <label className="text-[12px] text-[#68707C] block mb-1 font-semibold">Affiliation / Team Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setInviteType('gc')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        inviteType === 'gc'
                          ? 'bg-[#EAF3FF] border-[#1677FF] text-[#1677FF] shadow-xs'
                          : 'bg-white border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F]'
                      }`}
                    >
                      <span>🏢 GC (In-House)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteType('trade')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        inviteType === 'trade'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                          : 'bg-white border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F]'
                      }`}
                    >
                      <span>🔨 Sub (Trade)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-[#68707C] block mb-1 font-semibold">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder={inviteType === 'gc' ? 'e.g. Field Superintendent' : 'e.g. Concrete Lead'}
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-9 bg-white border border-[#DDE1E7] rounded-lg px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-[12px] text-[#68707C] block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    placeholder="trade@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-9 bg-white border border-[#DDE1E7] rounded-lg px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEDF1] mt-1">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F2F2F7] text-[#171A1F] text-xs font-semibold cursor-pointer hover:bg-[#EAEDF1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer"
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
