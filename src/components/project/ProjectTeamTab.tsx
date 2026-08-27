import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  Phone, MessageSquare, Plus, UserPlus, 
  HardHat, Shield, Check, X
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

const DEFAULT_PROJECT_STAFF: ProjectStaff[] = [
  // General Contractor / Project Leadership
  {
    id: 'ps-1',
    name: 'Sarah Johnson',
    role: 'Lead Project Manager',
    company: 'Avery & Marsh GC',
    phone: '+1 (555) 345-6789',
    email: 'sarah.j@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: true
  },
  {
    id: 'ps-2',
    name: 'John Smith',
    role: 'Lead Field Superintendent',
    company: 'Avery & Marsh GC',
    phone: '+1 (555) 567-8901',
    email: 'john.s@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: true
  },
  {
    id: 'ps-3',
    name: 'Emily Brown',
    role: 'Site Safety Officer',
    company: 'Avery & Marsh GC',
    phone: '+1 (555) 789-0123',
    email: 'emily.b@averymarsh.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    type: 'gc',
    isOnSite: false
  },
  // Subcontractor Trade Foremen
  {
    id: 'ps-4',
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
    id: 'ps-5',
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
    id: 'ps-6',
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

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ project }) => {
  const [staffList, setStaffList] = useState<ProjectStaff[]>(DEFAULT_PROJECT_STAFF);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New assignment form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const gcTeam = staffList.filter(s => s.type === 'gc');
  const tradeTeam = staffList.filter(s => s.type === 'trade');
  const onSiteCount = staffList.filter(s => s.isOnSite).length;

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const newPerson: ProjectStaff = {
      id: `ps-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      company: newCompany.trim() || project?.name || 'On-site Trade',
      phone: newPhone.trim() || '+1 (555) 000-0000',
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@project.com`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type: 'trade',
      isOnSite: true
    };

    setStaffList(prev => [...prev, newPerson]);
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setNewPhone('');
    setIsAssignModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in pb-24">
      
      {/* ─── 1. COMPACT ROSTER HEADER ─── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">On-Site Project Roster</h2>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {onSiteCount} of {staffList.length} currently on site
          </p>
        </div>

        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="h-8 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Assign Person</span>
        </button>
      </div>

      {/* ─── 2. GC PROJECT LEADERSHIP SECTION ─── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Project Leadership
          </span>
          <span className="text-[10px] text-slate-500 font-medium">General Contractor</span>
        </div>

        <div className="flex flex-col gap-2">
          {gcTeam.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3 shadow-sm hover:border-[#1E325A] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#1E2E4A]"
                  />
                  {member.isOnSite && (
                    <span 
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070D1A]" 
                      title="Currently on site"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                  </div>
                  <p className="text-[11px] text-blue-400 font-medium truncate mt-0.5">{member.role}</p>
                </div>
              </div>

              {/* Direct 1-Tap Quick Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${member.phone}`}
                  className="w-8 h-8 rounded-lg bg-[#0E1A33] hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-[#1E2E4A] cursor-pointer"
                  title={`Call ${member.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. TRADE FOREMEN & SITE LEADS SECTION ─── */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Subcontractor Site Leads
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Trade Foremen</span>
        </div>

        <div className="flex flex-col gap-2">
          {tradeTeam.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3 shadow-sm hover:border-[#1E325A] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#1E2E4A]"
                  />
                  {member.isOnSite && (
                    <span 
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070D1A]" 
                      title="Currently on site"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">{member.role}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{member.company}</p>
                </div>
              </div>

              {/* Direct 1-Tap Quick Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`tel:${member.phone}`}
                  className="w-8 h-8 rounded-lg bg-[#0E1A33] hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-[#1E2E4A] cursor-pointer"
                  title={`Call ${member.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. ASSIGN PERSON MODAL ─── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-xs font-bold text-white">Assign Person to {project?.name || 'Project'}</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">On-Site Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Foreman"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Subcontractor / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Electrical LLC"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Direct Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
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
          </div>
        </div>
      )}

    </div>
  );
};
