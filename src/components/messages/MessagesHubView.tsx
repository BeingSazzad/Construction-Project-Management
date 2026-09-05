import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  Hash, Search, ArrowLeft, Send, Plus, Sparkles, X, 
  Calendar, CheckCheck, Paperclip, Check, UserPlus,
  Users, ChevronRight, Clock, ShieldCheck, AlertTriangle,
  MoreVertical, Bell, BellOff, Pin, Trash2, FileText,
  UserMinus, MoreHorizontal, Shield, MessageSquare
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
  { id: 'm-1', name: 'John Smith', role: 'Lead Field Superintendent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-2', name: 'Emily Brown', role: 'Site Safety Officer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-3', name: 'Carlos Ortiz', role: 'Earthwork Site Foreman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-4', name: 'Dave Miller', role: 'Structural Concrete Lead', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-5', name: 'Sarah Johnson', role: 'Lead Project Manager', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-6', name: 'Marcus Chen', role: 'Finance Controller', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-7', name: 'Apex Concrete LLC', role: 'Concrete Trade Partner', avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-8', name: 'Priya Nair', role: 'Project Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-9', name: 'Josh Spencer', role: 'Project Engineer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { id: 'm-10', name: 'Titan Steel Works', role: 'Structural Subcontractor', avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80' },
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
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[1], ALL_COMPANY_MEMBERS[2], ALL_COMPANY_MEMBERS[3]],
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
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[4], ALL_COMPANY_MEMBERS[5]],
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
    members: [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[1], ALL_COMPANY_MEMBERS[4], ALL_COMPANY_MEMBERS[6]],
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
    members: [ALL_COMPANY_MEMBERS[4], ALL_COMPANY_MEMBERS[5], ALL_COMPANY_MEMBERS[7]],
  }
];

export const MessagesHubView: React.FC<MessagesHubViewProps> = ({
  currentUser,
  projects,
  chatMessages,
  onSendMessage,
  onSelectProject
}) => {
  const [discussions, setDiscussions] = useState<ProjectDiscussion[]>(INITIAL_DISCUSSIONS);
  const [selectedDisc, setSelectedDisc] = useState<ProjectDiscussion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  
  // Advanced Multi-Select Members for New Channel
  const [isManualMemberMode, setIsManualMemberMode] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([ALL_COMPANY_MEMBERS[0].id]);

  // In-Chat Executive Action Menu States
  const [isChannelMenuOpen, setIsChannelMenuOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [addMemberSearchQuery, setAddMemberSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [memberOptionMenuId, setMemberOptionMenuId] = useState<string | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<{
    name: string;
    url: string;
    type: 'image' | 'document';
    size: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedDisc]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !pendingFile) || !selectedDisc) return;

    const newMsg: ProjectChatMessage = {
      id: `chat-${Date.now()}`,
      projectId: selectedDisc.projectId || 'proj-1',
      channelId: selectedDisc.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.roleTitle || 'Owner & Principal',
      text: inputText.trim() || undefined,
      timestamp: 'Just now',
      attachmentName: pendingFile?.name,
      attachmentUrl: pendingFile?.url,
      attachmentType: pendingFile?.type,
      attachmentSize: pendingFile?.size,
    };

    onSendMessage(newMsg);

    // Update Discussion's lastMessage
    setDiscussions(prev => prev.map(d => {
      if (d.id === selectedDisc.id) {
        return {
          ...d,
          lastMessage: pendingFile ? `[Attachment: ${pendingFile.name}]` : inputText.trim(),
          lastSender: currentUser.name,
          timestamp: 'Just now',
        };
      }
      return d;
    }));

    setInputText('');
    setPendingFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const previewUrl = URL.createObjectURL(file);
    const sizeKb = (file.size / 1024).toFixed(0);

    setPendingFile({
      name: file.name,
      url: previewUrl,
      type: isImg ? 'image' : 'document',
      size: `${sizeKb} KB`
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const proj = projects.find(p => p.id === selectedProjectId) || projects[0];
    
    // Choose members based on mode
    let membersToAdd: TeamMember[] = [];
    if (isManualMemberMode && selectedMemberIds.length > 0) {
      membersToAdd = ALL_COMPANY_MEMBERS.filter(m => selectedMemberIds.includes(m.id));
    } else {
      membersToAdd = [ALL_COMPANY_MEMBERS[0], ALL_COMPANY_MEMBERS[4], ALL_COMPANY_MEMBERS[1]];
    }

    const newDisc: ProjectDiscussion = {
      id: `disc-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      channelName: newChannelName.trim(),
      lastMessage: 'Channel created. Start the conversation!',
      lastSender: currentUser.name,
      timestamp: 'Just now',
      unreadCount: 0,
      members: membersToAdd,
    };

    setDiscussions([newDisc, ...discussions]);
    setSelectedDisc(newDisc);
    setIsCreatingNew(false);
    setNewChannelName('');
    setIsManualMemberMode(false);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  // Add member directly to currently open channel
  const handleAddMemberToCurrent = (member: TeamMember) => {
    if (!selectedDisc) return;
    if (selectedDisc.members.some(m => m.id === member.id)) return;

    const updatedMembers = [...selectedDisc.members, member];
    const updatedDisc = { ...selectedDisc, members: updatedMembers };

    setSelectedDisc(updatedDisc);
    setDiscussions(prev => prev.map(d => d.id === selectedDisc.id ? updatedDisc : d));
    setIsAddMemberModalOpen(false);
  };

  // Remove member directly from currently open channel
  const handleRemoveMemberFromCurrent = (memberId: string, memberName: string) => {
    if (!selectedDisc) return;
    const updatedMembers = selectedDisc.members.filter(m => m.id !== memberId);
    const updatedDisc = { ...selectedDisc, members: updatedMembers };

    setSelectedDisc(updatedDisc);
    setDiscussions(prev => prev.map(d => d.id === selectedDisc.id ? updatedDisc : d));
    setMemberOptionMenuId(null);
  };

  const handleDeleteChannel = (discId: string) => {
    if (confirm("Are you sure you want to delete this channel?")) {
      setDiscussions(prev => prev.filter(d => d.id !== discId));
      setSelectedDisc(null);
      setIsChannelMenuOpen(false);
    }
  };

  const filtered = discussions.filter(d => 
    d.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────
  // 1. Thread Chat View (Inside Discussion)
  // ─────────────────────────────────────────────────────────────
  if (selectedDisc) {
    const threadMessages = chatMessages.filter(m => m.channelId === selectedDisc.id);

    return (
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in bg-transparent relative">
        
        {/* Sticky Chat Header */}
        <div className="sticky top-0 z-20 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-[#EAEDF1] flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => setSelectedDisc(null)}
              className="w-8 h-8 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 flex-shrink-0"
              title="Back to discussions"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
                <h3 className="text-sm font-bold text-[#171A1F] truncate tracking-tight">
                  {selectedDisc.channelName}
                </h3>
              </div>
              <p 
                onClick={() => {
                  setMemberSearchQuery('');
                  setIsRosterModalOpen(true);
                }}
                className="text-[10px] text-[#68707C] font-medium truncate flex items-center gap-1.5 mt-0.5 cursor-pointer hover:text-[#1677FF] transition-colors"
                title="Click to view & manage channel members"
              >
                <span>{selectedDisc.projectName}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-emerald-700 font-semibold underline decoration-emerald-500/40 underline-offset-2">
                  {selectedDisc.members.length} members
                </span>
              </p>
            </div>
          </div>

          {/* Top Right Action Buttons: [+ Add Member] & [ ⋮ ] */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                setAddMemberSearchQuery('');
                setIsAddMemberModalOpen(true);
              }}
              className="h-7 px-2.5 bg-[#1677FF] hover:bg-[#0958D9] active:scale-95 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Add member to channel"
            >
              <UserPlus className="w-3 h-3" />
              <span>+ Add Member</span>
            </button>

            {/* 3-Dot Executive Action Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsChannelMenuOpen(prev => !prev)}
                className="w-7 h-7 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
                title="Channel Options"
              >
                <MoreVertical className="w-3.5 h-3.5 text-[#68707C]" />
              </button>

              {/* Dropdown Menu Popover */}
              {isChannelMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsChannelMenuOpen(false)} 
                  />
                  <div className="absolute right-0 top-9 z-40 w-52 bg-white border border-[#DDE1E7] rounded-2xl shadow-xl p-1.5 flex flex-col gap-0.5 animate-fade-in">
                    {/* Option 1: Add Member */}
                    <button
                      onClick={() => {
                        setIsChannelMenuOpen(false);
                        setAddMemberSearchQuery('');
                        setIsAddMemberModalOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A1F] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <UserPlus className="w-4 h-4 text-[#1677FF]" />
                      <span>+ Add Member</span>
                    </button>

                    {/* Option 2: View Channel Members */}
                    <button
                      onClick={() => {
                        setIsChannelMenuOpen(false);
                        setMemberSearchQuery('');
                        setIsRosterModalOpen(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A1F] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>View Members ({selectedDisc.members.length})</span>
                    </button>

                    {/* Option 3: Mute Notifications */}
                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        setIsChannelMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A1F] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      {isMuted ? (
                        <>
                          <Bell className="w-4 h-4 text-amber-600" />
                          <span>Unmute Notifications</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 text-[#68707C]" />
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
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#171A1F] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <Pin className="w-4 h-4 text-cyan-600" />
                      <span>Pinned Items (3)</span>
                    </button>

                    <div className="my-1 border-t border-[#EAEDF1]" />

                    {/* Option 5: Delete Channel */}
                    <button
                      onClick={() => handleDeleteChannel(selectedDisc.id)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Delete Channel</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal: In-Chat Add Member */}
        {isAddMemberModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="w-full max-w-[370px] bg-white border border-[#DDE1E7] rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#1677FF]" />
                  <span className="text-xs font-bold text-[#171A1F]">Add Member</span>
                </div>
                <button 
                  onClick={() => setIsAddMemberModalOpen(false)} 
                  className="w-6 h-6 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Bar inside Add Member */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9DA5B1]" />
                <input
                  type="text"
                  value={addMemberSearchQuery}
                  onChange={e => setAddMemberSearchQuery(e.target.value)}
                  placeholder="Search colleagues..."
                  className="w-full h-8 pl-8 pr-2.5 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
                />
              </div>

              {/* Member List */}
              <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                {ALL_COMPANY_MEMBERS
                  .filter(m => !addMemberSearchQuery || m.name.toLowerCase().includes(addMemberSearchQuery.toLowerCase()) || m.role.toLowerCase().includes(addMemberSearchQuery.toLowerCase()))
                  .map(member => {
                    const isAlreadyIn = selectedDisc.members.some(m => m.id === member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => !isAlreadyIn && handleAddMemberToCurrent(member)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isAlreadyIn
                            ? 'bg-[#F7F8FA] border-[#EAEDF1] opacity-60'
                            : 'bg-white border-[#DDE1E7] hover:border-[#1677FF] cursor-pointer active:scale-[0.99] shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-[#EAEDF1] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#171A1F] truncate">{member.name}</p>
                            <p className="text-[10px] text-[#68707C] truncate">{member.role}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={isAlreadyIn}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAlreadyIn) handleAddMemberToCurrent(member);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors flex-shrink-0 ${
                            isAlreadyIn 
                              ? 'bg-[#F2F2F7] text-[#68707C] border border-[#DDE1E7]' 
                              : 'bg-[#1677FF] hover:bg-[#0958D9] text-white shadow-xs cursor-pointer'
                          }`}
                        >
                          {isAlreadyIn ? (
                            <>
                              <Check className="w-3 h-3 text-[#68707C]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>+ Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-full py-2 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal: View & Manage Channel Members Roster */}
        {isRosterModalOpen && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAEDF1]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171A1F] leading-tight">Members</h4>
                    <p className="text-[10px] text-[#68707C] font-medium">#{selectedDisc.channelName} · {selectedDisc.members.length} members</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsRosterModalOpen(false);
                    setMemberOptionMenuId(null);
                  }} 
                  className="w-6 h-6 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9DA5B1]" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={e => setMemberSearchQuery(e.target.value)}
                    placeholder="Search members..."
                    className="w-full h-8 pl-8 pr-2.5 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsRosterModalOpen(false);
                    setAddMemberSearchQuery('');
                    setIsAddMemberModalOpen(true);
                  }}
                  className="h-8 px-2.5 bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs flex-shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add</span>
                </button>
              </div>

              {/* Members List */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-64 pr-1">
                {selectedDisc.members
                  .filter(m => !memberSearchQuery || m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.role.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                  .map(member => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex items-center justify-between gap-2 shadow-xs relative group hover:border-[#DDE1E7] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-[#EAEDF1]" />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#171A1F] truncate">{member.name}</p>
                          <p className="text-[10px] text-[#68707C] font-medium truncate">{member.role}</p>
                        </div>
                      </div>

                      {/* Right Action: [Remove] button & [⋮] menu */}
                      <div className="relative flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleRemoveMemberFromCurrent(member.id, member.name)}
                          className="h-7 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          title={`Remove ${member.name} from channel`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>

                        <button
                          onClick={() => setMemberOptionMenuId(memberOptionMenuId === member.id ? null : member.id)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
                          title="Member actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {memberOptionMenuId === member.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setMemberOptionMenuId(null)} 
                            />
                            <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-[#DDE1E7] rounded-xl shadow-2xl p-1 flex flex-col gap-0.5 animate-fade-in text-xs">
                              <button
                                onClick={() => {
                                  setMemberOptionMenuId(null);
                                  alert(`Direct messaging ${member.name}...`);
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg text-[#171A1F] hover:bg-[#F7F8FA] flex items-center gap-2 text-left cursor-pointer font-medium"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-[#1677FF]" />
                                <span>Direct Message</span>
                              </button>
                              <button
                                onClick={() => handleRemoveMemberFromCurrent(member.id, member.name)}
                                className="w-full px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left cursor-pointer font-bold"
                              >
                                <UserMinus className="w-3.5 h-3.5 text-rose-600" />
                                <span>Remove Member</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsRosterModalOpen(false);
                  setMemberOptionMenuId(null);
                }}
                className="w-full py-2 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] text-xs font-bold cursor-pointer transition-colors mt-1"
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
            <span className="px-3 py-1 rounded-full bg-white border border-[#DDE1E7] text-[10px] font-bold text-[#68707C] tracking-wide uppercase shadow-xs">
              Today • July 17, 2026
            </span>
          </div>

          {/* Latti AI Automated Milestone Card */}
          <div className="relative rounded-2xl bg-[#EAF3FF] border border-blue-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-200/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1677FF] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#171A1F] tracking-tight">Latti</span>
                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#1677FF] px-1.5 py-0.5 rounded">Milestone Alert</span>
                </div>
              </div>
              <span className="text-[10px] text-[#68707C] font-medium">4:57 AM</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-[#1677FF] flex-shrink-0 mt-0.5 shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#171A1F] leading-snug">
                  Plumbing Inspection Scheduled
                </p>
                <p className="text-[12px] text-[#68707C] font-medium mt-0.5">
                  July 17 at 9:00 AM • Level 8 Commercial Floor
                </p>
              </div>
            </div>
          </div>

          {/* Message 1 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sazzad Chowdhury"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">Sazzad Chowdhury</span>
                <span className="text-[10px] text-[#9DA5B1]">10:15 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
                Good morning team! Plumbing rough-in inspection for Level 8 commercial floor is set for 9:00 AM today. Please make sure all pressure test gauges are active.
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
              alt="John Smith"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">John Smith</span>
                <span className="text-[10px] font-bold text-[#1677FF]">Superintendent</span>
                <span className="text-[10px] text-[#9DA5B1]">10:18 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
                Understood Sazzad. Hydrostatic pressure test passed at 120 PSI. Field crew is on site with the city inspector right now.
              </div>
            </div>
          </div>

          {/* Message 3 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Johnson"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">Sarah Johnson</span>
                <span className="text-[10px] font-bold text-emerald-700">Lead PM</span>
                <span className="text-[10px] text-[#9DA5B1]">10:22 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
                Great progress! Has the revised MEP coordination drawing v4 been uploaded for the ceiling grid clearance?
              </div>
            </div>
          </div>

          {/* Message 4 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
              alt="Alex Chen"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">Alex Chen</span>
                <span className="text-[10px] font-bold text-amber-700">Estimator</span>
                <span className="text-[10px] text-[#9DA5B1]">10:27 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
                Yes Sarah, drawing v4 is uploaded in Documents. Budget impact is net zero — we offset the additional copper pipe fittings against the contingency reserve.
              </div>
            </div>
          </div>

          {/* Message 5 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Carlos Ortiz"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">Carlos Ortiz</span>
                <span className="text-[10px] font-bold text-purple-700">Trade Lead</span>
                <span className="text-[10px] text-[#9DA5B1]">10:32 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
                City inspector just signed off on the Level 8 plumbing rough-in permit! Green card signed. We can proceed with wall framing insulation tomorrow morning.
              </div>
            </div>
          </div>

          {/* Message 6 */}
          <div className="flex items-start gap-2.5 max-w-[88%]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sazzad Chowdhury"
              className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171A1F]">Sazzad Chowdhury</span>
                <span className="text-[10px] text-[#9DA5B1]">10:35 AM</span>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-[#DDE1E7] text-xs text-[#171A1F] leading-relaxed shadow-xs">
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
                    className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0 mt-1"
                  />
                )}
                <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[12px] font-bold text-[#68707C]">{isMe ? 'You' : m.senderName}</span>
                    <span className="text-[10px] text-[#9DA5B1]">{m.timestamp}</span>
                  </div>
                  {m.text && (
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#1677FF] text-white rounded-tr-sm'
                          : 'bg-white border border-[#DDE1E7] text-[#171A1F] rounded-tl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  )}

                  {/* Attachment rendering */}
                  {m.attachmentUrl && (
                    <div className="mt-1">
                      {m.attachmentType === 'image' ? (
                        <div className="relative group overflow-hidden rounded-2xl border border-[#DDE1E7] max-w-[220px] shadow-xs">
                          <img
                            src={m.attachmentUrl}
                            alt={m.attachmentName || 'Photo Attachment'}
                            className="w-full max-h-[160px] object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="p-2 bg-white/95 backdrop-blur-sm text-[10px] text-[#171A1F] font-medium truncate border-t border-[#EAEDF1] flex items-center justify-between">
                            <span className="truncate">{m.attachmentName || 'Photo'}</span>
                            {m.attachmentSize && <span className="text-[#68707C] font-bold ml-1">{m.attachmentSize}</span>}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={m.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF] text-xs text-[#171A1F] transition-all shadow-xs active:scale-95 group max-w-[240px]"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-blue-200 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
                              {m.attachmentName || 'Document'}
                            </p>
                            {m.attachmentSize && (
                              <p className="text-[10px] text-[#68707C] font-medium mt-0.5">{m.attachmentSize}</p>
                            )}
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {isMe && (
                    <div className="flex items-center gap-1 pr-1">
                      <CheckCheck className="w-3.5 h-3.5 text-[#1677FF]" />
                      <span className="text-[10px] text-[#9DA5B1]">Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Message Input Composer */}
        <div className="sticky bottom-0 z-20 p-3 bg-white/95 backdrop-blur-md border-t border-[#EAEDF1]">
          {/* File Attachment Preview Bar */}
          {pendingFile && (
            <div className="flex items-center justify-between p-2 mb-2 bg-[#F7F8FA] border border-[#DDE1E7] rounded-2xl text-xs text-[#171A1F] animate-fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                {pendingFile.type === 'image' ? (
                  <img src={pendingFile.url} alt="Preview" className="w-9 h-9 rounded-xl object-cover border border-[#DDE1E7] flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-blue-200 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#171A1F] truncate">{pendingFile.name}</p>
                  <p className="text-[10px] text-[#68707C] font-semibold">{pendingFile.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingFile(null)}
                className="w-7 h-7 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
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
              className="w-11 h-11 rounded-2xl bg-[#F7F8FA] border border-[#DDE1E7] hover:border-[#1677FF] text-[#68707C] hover:text-[#1677FF] flex items-center justify-center cursor-pointer transition-all flex-shrink-0 active:scale-95 shadow-xs"
              title="Attach File, Photo or Document"
            >
              <Paperclip className="w-4 h-4 stroke-[2.5]" />
            </button>

            <input
              type="text"
              placeholder={pendingFile ? "Add a caption or send file..." : "Type message in project channel..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-2xl px-4 text-xs text-[#171A1F] outline-none placeholder-[#9DA5B1] transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !pendingFile}
              className="w-11 h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-all flex-shrink-0"
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#171A1F] tracking-tight">Messages</h1>
          <p className="text-xs text-[#68707C] font-medium mt-0.5">Project discussions</p>
        </div>
        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Channel</span>
        </button>
      </div>

      {/* New Discussion Creation Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateDiscussion} className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3.5 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
            <span className="text-xs font-bold text-[#171A1F]">New Project Discussion</span>
            <button type="button" onClick={() => setIsCreatingNew(false)} className="text-[#68707C] hover:text-[#171A1F]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider block mb-1">Discussion / Channel Name</label>
            <input
              type="text"
              placeholder="e.g. St Pete Project Team"
              value={newChannelName}
              onChange={e => setNewChannelName(e.target.value)}
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl px-3 text-xs text-[#171A1F] outline-none placeholder-[#9DA5B1]"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider block mb-1">Select Project</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map(p => ({ value: p.id, label: p.name }))}
              size="md"
            />
          </div>

          {/* Toggle: Automatic vs Manual Member Selection */}
          <div className="pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
              <div>
                <p className="text-xs font-bold text-[#171A1F]">Manual Member Selection</p>
                <p className="text-[10px] text-[#68707C]">
                  {isManualMemberMode ? 'Pick specific team members' : 'Auto-add entire project team'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualMemberMode(!isManualMemberMode)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isManualMemberMode
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : 'bg-white text-[#171A1F] border border-[#DDE1E7] hover:bg-[#F2F2F7]'
                }`}
              >
                {isManualMemberMode ? 'Active' : '+ Customize'}
              </button>
            </div>

            {/* Manual Members Checkbox list */}
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
                          ? 'bg-[#EAF3FF] border-[#1677FF] text-[#171A1F]'
                          : 'bg-white border-[#DDE1E7] text-[#68707C] hover:bg-[#F7F8FA]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-[#171A1F] truncate">{member.name}</p>
                          <p className="text-[10px] text-[#68707C] truncate">{member.role}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#DDE1E7] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 h-8 rounded-xl border border-[#DDE1E7] text-[#68707C] text-xs font-semibold hover:bg-[#F2F2F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 h-8 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs active:scale-95"
            >
              Create Discussion
            </button>
          </div>
        </form>
      )}

      {/* Search discussions input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9DA5B1] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-2xl pl-10 pr-4 text-xs text-[#171A1F] outline-none placeholder-[#9DA5B1] transition-all shadow-xs"
        />
      </div>

      {/* Discussions Channel List */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((disc) => (
          <div
            key={disc.id}
            onClick={() => setSelectedDisc(disc)}
            className="p-4 bg-white hover:bg-[#F7F8FA] border border-[#DDE1E7] hover:border-[#1677FF] rounded-2xl shadow-xs flex items-start gap-3 transition-all cursor-pointer group active:scale-[0.99]"
          >
            {/* Hashtag Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-blue-200 flex items-center justify-center text-[#1677FF] flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
              <Hash className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                  {disc.channelName}
                </h3>
                <span className="text-[10px] text-[#9DA5B1] font-medium flex-shrink-0">{disc.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] text-[#1677FF] font-semibold truncate">
                  {disc.projectName}
                </span>
                <span className="text-[10px] text-[#68707C]">• {disc.members.length} members</span>
              </div>

              <p className="text-[12px] text-[#68707C] truncate mt-1">
                {disc.lastMessage}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-[#9DA5B1] group-hover:text-[#171A1F] transition-colors flex-shrink-0 self-center" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-[#68707C] text-center">
            <Hash className="w-8 h-8 opacity-30" />
            <p className="text-xs font-semibold">No discussions found</p>
          </div>
        )}
      </div>

    </div>
  );
};
