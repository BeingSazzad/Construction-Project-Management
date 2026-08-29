import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  Hash, Search, ArrowLeft, Send, Plus, Sparkles, X, 
  Calendar, CheckCheck, Paperclip, Check, UserPlus,
  Users, ChevronRight, Clock, ShieldCheck, AlertTriangle,
  MoreVertical, Bell, BellOff, Pin, Trash2, FileText
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

  // In-chat add member & 3-dot menu states
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleDeleteChannel = (discId: string) => {
    if (window.confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      setDiscussions(prev => prev.filter(d => d.id !== discId));
      setSelectedDisc(null);
      setIsChannelMenuOpen(false);
    }
  };

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

  // File attachment state
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    url: string;
    type: 'image' | 'document' | 'file';
    size: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const fileUrl = URL.createObjectURL(file);
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = fileSizeMb === '0.0' ? `${(file.size / 1024).toFixed(0)} KB` : `${fileSizeMb} MB`;

    setPendingFile({
      name: file.name,
      url: fileUrl,
      type: isImage ? 'image' : 'document',
      size: sizeStr
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !pendingFile) || !selectedDisc) return;

    const newMsg: ProjectChatMessage = {
      id: `msg-${Date.now()}`,
      projectId: selectedDisc.projectId,
      channelId: selectedDisc.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.roleTitle || 'Owner',
      senderAvatar: currentUser.avatar,
      text: inputText.trim() || (pendingFile ? `Shared ${pendingFile.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl: pendingFile?.url,
      attachmentName: pendingFile?.name,
      attachmentType: pendingFile?.type,
      attachmentSize: pendingFile?.size
    };

    onSendMessage(newMsg);

    const summaryText = inputText.trim() || `📎 ${pendingFile?.name || 'Attachment'}`;
    setDiscussions(prev => prev.map(d => 
      d.id === selectedDisc.id ? { ...d, lastMessage: summaryText, timestamp: 'Just now' } : d
    ));

    setInputText('');
    setPendingFile(null);
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

          {/* 3-Dot Executive Action Menu Trigger */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsChannelMenuOpen(prev => !prev)}
              className="w-8 h-8 rounded-xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Channel Options"
            >
              <MoreVertical className="w-4 h-4 text-slate-300" />
            </button>

            {/* Dropdown Menu Popover */}
            {isChannelMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsChannelMenuOpen(false)} 
                />
                <div className="absolute right-0 top-10 z-40 w-52 bg-[#091122] border border-[#1E2E4A] rounded-2xl shadow-2xl p-1.5 flex flex-col gap-0.5 animate-fade-in">
                  {/* Option 1: Add Member */}
                  <button
                    onClick={() => {
                      setIsChannelMenuOpen(false);
                      setIsAddMemberModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#142036] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <UserPlus className="w-4 h-4 text-blue-400" />
                    <span>+ Add Member</span>
                  </button>

                  {/* Option 2: View Channel Members */}
                  <button
                    onClick={() => {
                      setIsChannelMenuOpen(false);
                      setIsRosterModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#142036] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>View Members ({selectedDisc.members.length})</span>
                  </button>

                  {/* Option 3: Mute Notifications */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      setIsChannelMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#142036] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    {isMuted ? (
                      <>
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>Unmute Notifications</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4 text-slate-400" />
                        <span>Mute Channel</span>
                      </>
                    )}
                  </button>

                  {/* Option 4: Pinned Files */}
                  <button
                    onClick={() => {
                      setIsChannelMenuOpen(false);
                      alert("Showing 3 Pinned Documents & Drawings for #" + selectedDisc.channelName);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-[#142036] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Pin className="w-4 h-4 text-cyan-400" />
                    <span>Pinned Items (3)</span>
                  </button>

                  <div className="my-1 border-t border-[#142036]" />

                  {/* Option 5: Delete Channel */}
                  <button
                    onClick={() => handleDeleteChannel(selectedDisc.id)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Delete Channel</span>
                  </button>
                </div>
              </>
            )}
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

        {/* Modal: View Channel Members Roster */}
        {isRosterModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-[360px] bg-[#0A111F] border border-[#1E2E4A] rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Channel Roster ({selectedDisc.members.length})</span>
                </div>
                <button onClick={() => setIsRosterModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {selectedDisc.members.map(member => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A]" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">{member.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex-shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="w-full py-2 rounded-xl bg-[#142036] text-slate-300 text-xs font-bold hover:bg-[#1E2E4A] cursor-pointer"
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
                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Milestone Alert</span>
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

          {/* 💬 Rich Construction Team Conversation Thread */}
          
          {/* Message 1: Sazzad Chowdhury */}
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
                Good morning team! Plumbing rough-in inspection for Level 8 commercial floor is set for 9:00 AM today. Please make sure all pressure test gauges are active.
              </div>
            </div>
          </div>

          {/* Message 2: John Smith */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
              alt="John Smith"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">John Smith</span>
                <span className="text-[10px] font-bold text-blue-400">Superintendent</span>
                <span className="text-[10px] text-slate-500">10:18 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-slate-200 leading-relaxed shadow-sm">
                Understood Sazzad. Hydrostatic pressure test passed at 120 PSI. Field crew is on site with the city inspector right now.
              </div>
            </div>
          </div>

          {/* Message 3: Sarah Johnson */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Johnson"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Sarah Johnson</span>
                <span className="text-[10px] font-bold text-emerald-400">Lead PM</span>
                <span className="text-[10px] text-slate-500">10:22 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-slate-200 leading-relaxed shadow-sm">
                Great progress! Has the revised MEP coordination drawing v4 been uploaded for the ceiling grid clearance?
              </div>
            </div>
          </div>

          {/* Message 4: Alex Chen */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
              alt="Alex Chen"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Alex Chen</span>
                <span className="text-[10px] font-bold text-amber-400">Estimator</span>
                <span className="text-[10px] text-slate-500">10:27 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-slate-200 leading-relaxed shadow-sm">
                Yes Sarah, drawing v4 is uploaded in Documents. Budget impact is net zero — we offset the additional copper pipe fittings against the contingency reserve.
              </div>
            </div>
          </div>

          {/* Message 5: Carlos Ortiz */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Carlos Ortiz"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Carlos Ortiz</span>
                <span className="text-[10px] font-bold text-purple-400">Trade Lead</span>
                <span className="text-[10px] text-slate-500">10:32 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-slate-200 leading-relaxed shadow-sm">
                City inspector just signed off on the Level 8 plumbing rough-in permit! Green card signed. We can proceed with wall framing insulation tomorrow morning.
              </div>
            </div>
          </div>

          {/* Message 6: Sazzad Chowdhury */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sazzad Chowdhury"
              className="w-8 h-8 rounded-full object-cover border border-[#1E2E4A] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Sazzad Chowdhury</span>
                <span className="text-[10px] text-slate-500">10:35 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-[#0E172A] border border-[#1E2C48] text-xs text-white leading-relaxed shadow-sm">
                Excellent work team! Thanks for the quick turnaround Carlos & John. Let's prep the drywall crew for Friday start.
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
                  {m.text && (
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-tr-sm shadow-blue-900/30'
                          : 'bg-[#0E172A] border border-[#1E2C48] text-slate-200 rounded-tl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  )}

                  {/* Attachment rendering */}
                  {m.attachmentUrl && (
                    <div className="mt-1">
                      {m.attachmentType === 'image' ? (
                        <div className="relative group overflow-hidden rounded-2xl border border-[#1E2E4A] max-w-[220px] shadow-lg">
                          <img
                            src={m.attachmentUrl}
                            alt={m.attachmentName || 'Photo Attachment'}
                            className="w-full max-h-[160px] object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="p-2 bg-[#070D1A]/90 backdrop-blur-sm text-[10px] text-slate-300 font-medium truncate border-t border-[#1E2E4A] flex items-center justify-between">
                            <span className="truncate">{m.attachmentName || 'Photo'}</span>
                            {m.attachmentSize && <span className="text-slate-400 font-bold ml-1">{m.attachmentSize}</span>}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={m.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#091122] border border-[#1E2E4A] hover:border-blue-500/50 text-xs text-white transition-all shadow-md active:scale-95 group max-w-[240px]"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                              {m.attachmentName || 'Document'}
                            </p>
                            {m.attachmentSize && (
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{m.attachmentSize}</p>
                            )}
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {isMe && (
                    <div className="flex items-center gap-1 pr-1">
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] text-slate-500">Delivered</span>
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
          {/* File Attachment Preview Bar */}
          {pendingFile && (
            <div className="flex items-center justify-between p-2 mb-2 bg-[#091122] border border-[#1E2E4A] rounded-2xl text-xs text-slate-200 animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                {pendingFile.type === 'image' ? (
                  <img src={pendingFile.url} alt="Preview" className="w-9 h-9 rounded-xl object-cover border border-[#1E2E4A] flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{pendingFile.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{pendingFile.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingFile(null)}
                className="w-7 h-7 rounded-xl bg-[#141F33] hover:bg-[#1E2E4A] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xlsx,.dwg"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 rounded-2xl bg-[#090E1A] border border-[#1E2E4A] hover:border-blue-500/60 text-blue-400 hover:text-blue-300 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 active:scale-95 shadow-sm"
              title="Attach File, Photo or Document"
            >
              <Paperclip className="w-4 h-4 stroke-[2.5]" />
            </button>

            <input
              type="text"
              placeholder={pendingFile ? "Add a caption or send file..." : "Type message in project channel..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 bg-[#090E1A] border border-[#1E2E4A] focus:border-blue-500/70 rounded-2xl px-4 text-xs text-white outline-none placeholder-slate-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !pendingFile}
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
                          <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
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
