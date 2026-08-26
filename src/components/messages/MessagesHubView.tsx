import React, { useState } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  Hash, Search, ArrowLeft, Send, Plus, Sparkles, X, CheckCircle2
} from 'lucide-react';

interface MessagesHubViewProps {
  currentUser: User;
  projects: Project[];
  chatMessages: ProjectChatMessage[];
  onSendMessage: (msg: ProjectChatMessage) => void;
  onSelectProject?: (project: Project) => void;
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
}

const INITIAL_DISCUSSIONS: ProjectDiscussion[] = [
  {
    id: 'disc-1',
    projectId: 'proj-001',
    projectName: 'Project 001',
    channelName: 'Project 001 Team',
    lastMessage: 'Hello project team',
    lastSender: 'Sazzad Chowdhury',
    timestamp: '10:15 AM',
    unreadCount: 0,
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
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');

  const filtered = discussions.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.channelName.toLowerCase().includes(q) ||
      d.projectName.toLowerCase().includes(q) ||
      d.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedDisc) return;

    const newMsg: ProjectChatMessage = {
      id: `msg-${Date.now()}`,
      projectId: selectedDisc.projectId,
      channelId: selectedDisc.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.roleTitle,
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(newMsg);

    // update last message in discussion list
    setDiscussions(prev => prev.map(d => 
      d.id === selectedDisc.id ? { ...d, lastMessage: inputText.trim(), timestamp: 'Just now' } : d
    ));

    setInputText('');
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const proj = projects.find(p => p.id === selectedProjectId) || projects[0];
    const newD: ProjectDiscussion = {
      id: `disc-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      channelName: newChannelName.trim(),
      lastMessage: 'Discussion channel created',
      timestamp: 'Just now',
      unreadCount: 0
    };

    setDiscussions(prev => [newD, ...prev]);
    setIsCreatingNew(false);
    setNewChannelName('');
    setSelectedDisc(newD);
  };

  // 1. Thread Chat View (Inside Discussion)
  if (selectedDisc) {
    const threadMessages = chatMessages.filter(m => m.channelId === selectedDisc.id);

    return (
      <div className="w-full flex flex-col gap-3 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in h-[calc(100vh-140px)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={() => setSelectedDisc(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discussions</span>
          </button>
          
          <div className="text-right min-w-0">
            <div className="flex items-center gap-1 justify-end">
              <Hash className="w-3.5 h-3.5 text-[#3875F6]" />
              <h4 className="text-xs font-bold text-white truncate">
                {selectedDisc.channelName}
              </h4>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{selectedDisc.projectName}</p>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 bg-[#070D1A] border border-[#142036] rounded-2xl p-4 overflow-y-auto flex flex-col gap-3 shadow-inner">
          
          {/* Latti AI Automated Milestone Card (Exactly matching web reference) */}
          <div className="p-3.5 rounded-2xl bg-[#0B1528] border border-[#1E2E4A] flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-blue-400">Latti</span>
              </div>
              <span className="text-[10px] text-slate-500">4:57 AM</span>
            </div>
            <p className="text-xs font-semibold text-white leading-snug">
              🗓️ New milestone: Plumbing Inspection — July 17 at 9:00 AM — 2026-07-17
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Scheduled for 9:00 AM. High priority.
            </p>
          </div>

          {/* Seed member messages */}
          <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#142036] flex flex-col gap-1 max-w-[85%] self-start">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-300">Sazzad Chowdhury</span>
              <span className="text-[10px] text-slate-500">10:15 AM</span>
            </div>
            <p className="text-xs text-white">Hello project team</p>
          </div>

          {/* Real-time chat messages */}
          {threadMessages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`p-3 rounded-2xl flex flex-col gap-1 max-w-[85%] shadow-sm ${
                  isMe
                    ? 'bg-[#2563EB] text-white self-end rounded-tr-none'
                    : 'bg-[#090E1A] border border-[#142036] text-slate-200 self-start rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[11px] font-bold ${isMe ? 'text-blue-100' : 'text-slate-300'}`}>
                    {m.senderName}
                  </span>
                  <span className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                    {m.timestamp}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{m.text}</p>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Type message in project channel..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 h-11 bg-[#070D1A] border border-[#142036] rounded-2xl px-4 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // 2. Master Discussions List (Exact 1:1 match with live Lattice website)
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
          className="w-9 h-9 rounded-xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
          title="New Discussion"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* New Discussion Creator Inline Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateDiscussion} className="p-4 rounded-2xl bg-[#0A111F] border border-[#1E2E4A] flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Start New Project Discussion</span>
            <button type="button" onClick={() => setIsCreatingNew(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Channel Name</label>
            <input
              type="text"
              placeholder="e.g. Electrical & Plumbing Subteam"
              value={newChannelName}
              onChange={e => setNewChannelName(e.target.value)}
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Attach to Project</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl px-3 text-xs text-white outline-none focus:border-blue-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 h-8 rounded-xl border border-[#1A263B] text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 h-8 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow active:scale-95"
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
          className="w-full h-11 bg-[#070D1A] border border-[#142036] rounded-2xl pl-10 pr-4 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-all"
        />
      </div>

      {/* Discussions Channel List (Exact match with website) */}
      <div className="flex flex-col gap-2">
        {filtered.map((disc) => (
          <div
            key={disc.id}
            onClick={() => setSelectedDisc(disc)}
            className="p-3.5 bg-[#070D1A] hover:bg-[#0C152B] border border-[#142036] hover:border-blue-500/40 rounded-2xl shadow-sm flex items-start gap-3 transition-all cursor-pointer group active:scale-[0.99]"
          >
            {/* Hashtag Icon */}
            <div className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E2E4A] flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Hash className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {disc.channelName}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{disc.timestamp}</span>
              </div>
              
              <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">
                {disc.projectName}
              </p>

              <p className="text-[11px] text-slate-500 truncate mt-1">
                {disc.lastMessage}
              </p>
            </div>

            {disc.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-1">
                {disc.unreadCount}
              </span>
            )}
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
