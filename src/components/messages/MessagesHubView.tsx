import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  Hash, Search, ArrowLeft, Send, Plus, Sparkles, X, 
  Calendar, CheckCheck, Paperclip, Check, UserPlus,
  Users, ChevronRight, Clock, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface MessagesHubViewProps {
  currentUser: User;
  projects: Project[];
  chatMessages: ProjectChatMessage[];
  onSendMessage: (msg: ProjectChatMessage) => void;
  onSelectProject?: (project: Project) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface ProjectDiscussion {
  id: string;
  projectId: string;
  projectName: string;
  channelName: string;
  lastMessage: string;
  lastSender?: string;
  timestamp: string;
  unreadCount: number;
  members: TeamMember[];
}

const ALL_COMPANY_MEMBERS: TeamMember[] = [
  { id: 'm-1', name: 'Sarah Johnson', role: 'Lead Project Manager', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-2', name: 'Marcus Chen', role: 'Finance Controller', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-3', name: 'Jake Torres', role: 'Site Superintendent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-4', name: 'Apex Concrete LLC', role: 'Concrete Trade Partner', avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-5', name: 'Priya Nair', role: 'Project Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-6', name: 'Titan Steel Works', role: 'Structural Subcontractor', avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80' },
];

const INITIAL_DISCUSSIONS: ProjectDiscussion[] = [
  {
    id: 'disc-1',
    projectId: 'proj-001',
    projectName: 'Project 001',
    channelName: 'Project 001 Team',
    lastMessage: 'Hello project team, inspection ready.',
    lastSender: 'Sazzad Chowdhury',
    timestamp: '10:15 AM',
    unreadCount: 0,
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[1], ALL_COMPANY_MEMBERS[2]],
  },
  {
    id: 'disc-2',
    projectId: 'proj-2',
    projectName: 'Sample 1',
    channelName: 'St Pete project',
    lastMessage: 'New milestone: Framing Inspection Prep',
    lastSender: 'Latti AI',
    timestamp: 'Yesterday',
    unreadCount: 0,
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[2]],
  },
  {
    id: 'disc-3',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    channelName: 'Riverside General Site',
    lastMessage: 'City inspector arrived for Level 12 deck inspection.',
    lastSender: 'Sarah Johnson',
    timestamp: '10:45 AM',
    unreadCount: 2,
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[2], ALL_COMPANY_MEMBERS[3]],
  },
  {
    id: 'disc-4',
    projectId: 'proj-3',
    projectName: 'Greenfield Hub',
    channelName: 'Greenfield Project Team',
    lastMessage: 'Draw #4 packet is uploaded for your review.',
    lastSender: 'Sarah Johnson',
    timestamp: 'May 20',
    unreadCount: 0,
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[1]],
  }
];

export const MessagesHubView: React.FC<MessagesHubViewProps> = ({
  currentUser,
  projects,
  chatMessages,
  onSendMessage
}) => {
  const [discussions, setDiscussions] = useState<ProjectDiscussion[]>(INITIAL_DISCUSSIONS);
  const [selectedDisc, setSelectedDisc] = useState<ProjectDiscussion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  // Creation form state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [isManualMemberMode, setIsManualMemberMode] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['m-1', 'm-3']);

  // In-chat add member modal
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDisc) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedDisc, chatMessages]);

  const filtered = discussions.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.channelName.toLowerCase().includes(q) ||
      d.projectName.toLowerCase().includes(q) ||
      d.lastMessage.toLowerCase().includes(q)
    );
  });

  const toggleMemberSelection = (id: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedDisc) return;

    const newMsg: ProjectChatMessage = {
      id: `msg-${Date.now()}`,
      projectId: selectedDisc.projectId,
      channelId: selectedDisc.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.roleTitle || 'Owner',
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(newMsg);

    setDiscussions(prev => prev.map(d => 
      d.id === selectedDisc.id ? { ...d, lastMessage: inputText.trim(), timestamp: 'Just now' } : d
    ));

    setInputText('');
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const proj = projects.find(p => p.id === selectedProjectId) || projects[0];
    
    // If manual mode: use selected members; else default all project members
    const finalMembers = isManualMemberMode
      ? ALL_COMPANY_MEMBERS.filter(m => selectedMemberIds.includes(m.id))
      : ALL_COMPANY_MEMBERS.slice(0, 4);

    const newD: ProjectDiscussion = {
      id: `disc-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      channelName: newChannelName.trim(),
      lastMessage: 'Channel created. Project team connected.',
      timestamp: 'Just now',
      unreadCount: 0,
      members: finalMembers
    };

    setDiscussions(prev => [newD, ...prev]);
    setIsCreatingNew(false);
    setNewChannelName('');
    setIsManualMemberMode(false);
    setSelectedDisc(newD);
  };

  const handleAddMemberToCurrent = (member: TeamMember) => {
    if (!selectedDisc) return;
    if (selectedDisc.members.some(m => m.id === member.id)) return;

    const updatedMembers = [...selectedDisc.members, member];
    const updatedDisc = { ...selectedDisc, members: updatedMembers };

    setSelectedDisc(updatedDisc);
    setDiscussions(prev => prev.map(d => d.id === selectedDisc.id ? updatedDisc : d));
    setIsAddMemberModalOpen(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. Thread Chat View (Inside Discussion)
  // ─────────────────────────────────────────────────────────────
  if (selectedDisc) {
    const threadMessages = chatMessages.filter(m => m.channelId === selectedDisc.id);

    return (
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in bg-[#070A12] relative">
        
        {/* Sticky Chat Header */}
        <div className="sticky top-0 z-20 px-4 py-3 bg-[#070A12]/95 backdrop-blur-md border-b border-[#142036] flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSelectedDisc(null)}
              className="w-8 h-8 rounded-xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 flex-shrink-0"
              title="Back to discussions"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#3875F6] flex-shrink-0" />
                <h3 className="text-sm font-bold text-white truncate tracking-tight">
                  {selectedDisc.channelName}
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                <span>{selectedDisc.projectName}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-emerald-400">{selectedDisc.members.length} members</span>
              </p>
            </div>
          </div>

          {/* Quick Add Member Trigger Button */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-xs font-semibold text-blue-400 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Add member to channel"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="text-[10px]">Add Member</span>
            </button>
          </div>
        </div>

        {/* Modal: In-Chat Add Member */}
        {isAddMemberModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-[360px] bg-[#0A111F] border border-[#1E2E4A] rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
                <span className="text-xs font-bold text-white">Add Member to #{selectedDisc.channelName}</span>
                <button onClick={() => setIsAddMemberModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                {ALL_COMPANY_MEMBERS.map(member => {
                  const isAlreadyIn = selectedDisc.members.some(m => m.id === member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => !isAlreadyIn && handleAddMemberToCurrent(member)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        isAlreadyIn
                          ? 'bg-[#070D1A] border-[#142036] opacity-50 cursor-not-allowed'
                          : 'bg-[#0D172E] border-[#1E2E4A] hover:border-blue-500 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAlreadyIn ? 'bg-[#142036] text-slate-400' : 'bg-blue-600 text-white'
                      }`}>
                        {isAlreadyIn ? 'Added' : '+ Add'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-full py-2 rounded-xl bg-[#142036] text-slate-300 text-xs font-bold hover:bg-[#1E2E4A]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Chat Message Stream */}
        <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-4">
          
          {/* Date Divider Chip */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3 py-1 rounded-full bg-[#0D1526] border border-[#1E2E4A] text-[10px] font-bold text-slate-400 tracking-wide uppercase">
              Today • July 17, 2026
            </span>
          </div>

          {/* 🌟 Latti AI Automated Milestone Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0D1B36] via-[#091224] to-[#070D1A] border border-[#233A6B] p-4 shadow-lg shadow-blue-950/40">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E325A]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/50">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-white tracking-tight">Latti</span>
                  <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Milestone Alert</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">4:57 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-snug">
                  Plumbing Inspection Scheduled
                </p>
                <p className="text-[12px] text-slate-300 font-medium mt-0.5">
                  July 17 at 9:00 AM • Level 8 Commercial Floor
                </p>
              </div>
            </div>
          </div>

          {/* Seed Member Message 1 (Sazzad Chowdhury) */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sazzad Chowdhury"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Sazzad Chowdhury</span>
                <span className="text-[10px] text-slate-500">10:15 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-white leading-relaxed shadow-sm">
                Hello project team
              </div>
            </div>
          </div>

          {/* Real-time chat messages sent by user */}
          {threadMessages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2 max-w-[88%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {!isMe && (
                  <img
                    src={m.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={m.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
                  />
                )}
                <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[12px] font-bold text-slate-300">{isMe ? 'You' : m.senderName}</span>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-tr-sm shadow-blue-900/30'
                        : 'bg-[#0E172A] border border-[#1E2C48] text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  {isMe && (
                    <div className="flex items-center gap-1 pr-1">
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[9px] text-slate-500">Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Message Input Composer */}
        <div className="sticky bottom-0 z-20 p-3 bg-[#070A12]/95 backdrop-blur-md border-t border-[#142036]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message in project channel..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 bg-[#090E1A] border border-[#1E2E4A] focus:border-blue-500/70 rounded-2xl px-4 text-xs text-white outline-none placeholder-slate-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-11 h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-30 disabled:hover:bg-[#2563EB] text-white flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Master Discussions List (Channels Overview)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* Header matching Website: "Messages" / "Project discussions" with "+" button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Project discussions</p>
        </div>
        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Channel</span>
        </button>
      </div>

      {/* New Discussion Creation Form (Dual Mode: Auto Project Team OR Manual Member Picker) */}
      {isCreatingNew && (
        <form onSubmit={handleCreateDiscussion} className="p-4 rounded-2xl bg-[#0A111F] border border-[#1E2E4A] flex flex-col gap-3.5 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
            <span className="text-xs font-bold text-white">New Project Discussion</span>
            <button type="button" onClick={() => setIsCreatingNew(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discussion / Channel Name</label>
            <input
              type="text"
              placeholder="e.g. St Pete Project Team"
              value={newChannelName}
              onChange={e => setNewChannelName(e.target.value)}
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Project</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
              size="md"
            />
          </div>

          {/* Toggle: Automatic vs Manual Member Selection */}
          <div className="pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070D1A] border border-[#142036]">
              <div>
                <p className="text-xs font-bold text-white">Manual Member Selection</p>
                <p className="text-[10px] text-slate-400">
                  {isManualMemberMode ? 'Pick specific team members' : 'Auto-add entire project team'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualMemberMode(!isManualMemberMode)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isManualMemberMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#142036] text-slate-300 hover:text-white'
                }`}
              >
                {isManualMemberMode ? 'Active' : '+ Customize'}
              </button>
            </div>

            {/* Manual Members Checkbox list (if enabled) */}
            {isManualMemberMode && (
              <div className="flex flex-col gap-1.5 mt-2.5 max-h-36 overflow-y-auto pr-1 animate-fade-in">
                {ALL_COMPANY_MEMBERS.map(member => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleMemberSelection(member.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0E1B38] border-blue-500/50 text-white'
                          : 'bg-[#070D1A] border-[#142036] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-white truncate">{member.name}</p>
                          <p className="text-[9px] text-slate-400 truncate">{member.role}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#142036]">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 h-8 rounded-xl border border-[#1A263B] text-slate-400 text-xs font-semibold hover:bg-[#142036]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 h-8 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow active:scale-95"
            >
              Create Discussion
            </button>
          </div>
        </form>
      )}

      {/* Search discussions... input matching website */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 bg-[#0A111F] border border-[#142036] focus:border-blue-500/70 rounded-2xl pl-10 pr-4 text-xs text-white outline-none placeholder-slate-500 transition-all shadow-sm"
        />
      </div>

      {/* Discussions Channel List */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((disc) => (
          <div
            key={disc.id}
            onClick={() => setSelectedDisc(disc)}
            className="p-4 bg-[#0A111F] hover:bg-[#0E182E] border border-[#142036] hover:border-blue-500/40 rounded-2xl shadow-sm flex items-start gap-3 transition-all cursor-pointer group active:scale-[0.99]"
          >
            {/* Hashtag Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#0D172E] border border-[#1E2F54] flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-sm">
              <Hash className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {disc.channelName}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{disc.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] text-blue-400 font-semibold truncate">
                  {disc.projectName}
                </span>
                <span className="text-[10px] text-slate-500">• {disc.members.length} members</span>
              </div>

              <p className="text-[12px] text-slate-400 truncate mt-1">
                {disc.lastMessage}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors flex-shrink-0 self-center" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-500 text-center">
            <Hash className="w-8 h-8 opacity-30" />
            <p className="text-xs font-semibold">No discussions found</p>
          </div>
        )}
      </div>

    </div>
  );
};
