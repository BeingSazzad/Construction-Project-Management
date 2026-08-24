import React, { useState } from 'react';
import { Project, User } from '../../types';
import { Button } from '../common/Button';
import { 
  Users, HardHat, Phone, Mail, Plus, 
  MessageSquare, Clock, ShieldCheck, CheckCircle2, FileText, Send 
} from 'lucide-react';

interface ProjectTeamTabProps {
  project: Project;
  onInviteMember?: () => void;
}

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({
  project
}) => {
  const [notes, setNotes] = useState([
    {
      id: 'n-1',
      author: 'Sarah Johnson (Senior PM)',
      role: 'Project Manager',
      timestamp: 'Today, 8:30 AM',
      text: 'Pre-pour inspection scheduled for Level 12 deck at 10:00 AM with municipal inspector. Ready-mix trucks dispatched.',
      priority: 'high'
    },
    {
      id: 'n-2',
      author: 'John Smith (Superintendent)',
      role: 'Site Lead',
      timestamp: 'Yesterday, 4:15 PM',
      text: 'Rebar chair clearance verified on south shear wall. 2 rebar bundles hoisted to Level 12 perimeter.',
      priority: 'normal'
    },
    {
      id: 'n-3',
      author: 'Marco Rossi (Concrete Sub)',
      role: 'Trade Foreman',
      timestamp: 'May 18, 2025',
      text: 'Pump truck #2 hydraulic line replaced and certified ready for 450 CY continuous pour.',
      priority: 'normal'
    }
  ]);

  const [newNote, setNewNote] = useState('');

  const teamMembers = [
    {
      id: 'tm-1',
      name: 'Sarah Johnson',
      role: 'Senior Project Manager',
      trade: 'Avery & Marsh',
      email: 'sarah.j@averymarsh.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'On Site'
    },
    {
      id: 'tm-2',
      name: 'John Smith',
      role: 'Lead Superintendent',
      trade: 'Field Operations',
      email: 'john.smith@averymarsh.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'On Site'
    },
    {
      id: 'tm-3',
      name: 'Mike Davis',
      role: 'QA/QC Site Engineer',
      trade: 'Engineering',
      email: 'mike.davis@averymarsh.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: 'tm-4',
      name: 'Emily Brown',
      role: 'Field Safety Officer',
      trade: 'Safety Compliance',
      email: 'emily.b@averymarsh.com',
      phone: '+1 (555) 789-0123',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'On Site'
    }
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNotes(prev => [
      {
        id: `n-${Date.now()}`,
        author: 'Sarah Johnson (Senior PM)',
        role: 'Project Manager',
        timestamp: 'Just now',
        text: newNote.trim(),
        priority: 'normal'
      },
      ...prev
    ]);
    setNewNote('');
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Project Team Members */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Project Leadership & Site Team ({teamMembers.length})
          </h3>
          <span className="text-xs text-blue-400 font-semibold">3 on site today</span>
        </div>

        <div className="flex flex-col gap-2">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="card-dark p-3 flex items-center justify-between border-[#1A2436] bg-[#0D131F]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#1E293B] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {member.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`tel:${member.phone}`}
                  className="w-7 h-7 rounded-lg bg-[#111827] border border-[#1F2E47] text-slate-300 hover:text-white flex items-center justify-center"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="w-7 h-7 rounded-lg bg-[#111827] border border-[#1F2E47] text-slate-300 hover:text-white flex items-center justify-center"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Notes & Daily Field Coordination */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Project Log & Coordination Notes
          </h3>
          <span className="text-xs text-slate-400">Live Stream</span>
        </div>

        {/* Input box to add a quick project note */}
        <form onSubmit={handleAddNote} className="mb-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add project coordination note or field directive..."
              className="w-full h-11 bg-[#0D131F] border border-[#1A2436] rounded-xl pl-3 pr-11 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Notes stream */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="card-dark p-3 bg-[#0D131F] border-[#1A2436] text-xs flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{note.author}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{note.role}</span>
                </div>
                <span className="text-slate-500">{note.timestamp}</span>
              </div>

              <p className="text-slate-200 leading-relaxed bg-[#080D17] p-2.5 rounded-lg border border-[#141E2F]">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
