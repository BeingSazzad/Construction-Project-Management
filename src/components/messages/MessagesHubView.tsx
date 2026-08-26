import React, { useState } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  MessageSquare, Send, Hash, Users, ShieldAlert, 
  Search, ArrowLeft, Paperclip, CheckCheck, Sparkles, Plus, 
  Circle, ChevronRight, Phone
} from 'lucide-react';

interface MessagesHubViewProps {
  currentUser: User;
  projects: Project[];
  chatMessages: ProjectChatMessage[];
  onSendMessage: (msg: ProjectChatMessage) => void;
  onSelectProject?: (project: Project) => void;
}

interface ThreadItem {
  id: string;
  projectId: string;
  projectName: string;
  channelId: string;
  channelName: string;
  isDirect: boolean;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isSafety?: boolean;
}

const INITIAL_THREADS: ThreadItem[] = [
  {
    id: 'th-1',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    channelId: 'general',
    channelName: 'general-site-updates',
    isDirect: false,
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    participantRole: 'Lead Project Manager',
    lastMessage: 'City inspector arrived for Level 12 deck inspection.',
    timestamp: '10:45 AM',
    unreadCount: 2
  },
  {
    id: 'th-2',
    projectId: 'proj-2',
    projectName: 'Downtown Highrise',
    channelId: 'urgent',
    channelName: 'urgent-safety-alerts',
    isDirect: false,
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantRole: 'Superintendent',
    lastMessage: 'Crane inspection passed with zero safety violations.',
    timestamp: '09:15 AM',
    unreadCount: 0,
    isSafety: true
  },
  {
    id: 'th-3',
    projectId: 'proj-1',
    projectName: 'Riverside Office Complex',
    channelId: 'framing',
    channelName: 'framing-and-mep',
    isDirect: false,
    participantName: 'Apex Concrete LLC',
    participantAvatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80',
    participantRole: 'Concrete Trade Partner',
    lastMessage: 'Ready for Thursday 6:00 AM pour. 40 trucks confirmed.',
    timestamp: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'th-4',
    projectId: 'proj-3',
    projectName: 'Greenfield Hub',
    channelId: 'dm-sarah',
    channelName: 'Direct: Sarah Johnson',
    isDirect: true,
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    participantRole: 'Project Manager',
    lastMessage: 'Draw #4 packet is uploaded for your review.',
    timestamp: 'May 20',
    unreadCount: 0
  }
];

export const MessagesHubView: React.FC<MessagesHubViewProps> = ({
  currentUser,
  projects,
  chatMessages,
  onSendMessage
}) => {
  const [selectedThread, setSelectedThread] = useState<ThreadItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'channels' | 'direct'>('all');
  const [inputText, setInputText] = useState('');

  const filteredThreads = INITIAL_THREADS.filter(t => {
    if (filterType === 'channels' && t.isDirect) return false;
    if (filterType === 'direct' && !t.isDirect) return false;
    if (searchQuery.trim()) {
      return (
        t.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThread) return;

    const newMsg: ProjectChatMessage = {
      id: `msg-${Date.now()}`,
      projectId: selectedThread.projectId,
      channelId: selectedThread.channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.roleTitle,
      senderAvatar: currentUser.avatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  // 1. Thread Chat View (Inside Thread)
  if (selectedThread) {
    const threadMessages = chatMessages.filter(m => m.channelId === selectedThread.channelId);

    return (
      <div className="w-full flex flex-col gap-3 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in h-[calc(100vh-140px)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={() => setSelectedThread(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Messages</span>
          </button>
          
          <div className="text-right min-w-0">
            <h4 className="text-xs font-bold text-white truncate">
              {selectedThread.isDirect ? selectedThread.participantName : `#${selectedThread.channelName}`}
            </h4>
            <p className="text-[10px] text-blue-400 truncate">{selectedThread.projectName}</p>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 bg-[#070D1A] border border-[#142036] rounded-2xl p-4 overflow-y-auto flex flex-col gap-3 shadow-inner">
          <div className="text-center py-2">
            <span className="text-[10px] bg-[#050811] border border-[#142036] text-slate-400 px-2.5 py-1 rounded-full font-semibold">
              Today • Field Coordination Channel
            </span>
          </div>

          {/* Initial seed message */}
          <div className="flex items-start gap-2.5">
            <img
              src={selectedThread.participantAvatar}
              alt={selectedThread.participantName}
              className="w-8 h-8 rounded-full object-cover border border-[#142036]"
            />
            <div className="flex flex-col gap-1 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{selectedThread.participantName}</span>
                <span className="text-[10px] text-slate-500">{selectedThread.timestamp}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0E1A33] border border-[#1E325A] text-xs text-slate-200 leading-relaxed shadow-sm">
                {selectedThread.lastMessage}
              </div>
            </div>
          </div>

          {/* Render real-time sent messages */}
          {threadMessages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={m.senderAvatar}
                  alt={m.senderName}
                  className="w-8 h-8 rounded-full object-cover border border-[#142036]"
                />
                <div className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{m.senderName}</span>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#2563EB] text-white rounded-tr-none'
                        : 'bg-[#0E1A33] border border-[#1E325A] text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Type field update or message..."
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

  // 2. Master Channels & Discussions List
  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Field Discussions</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Project channels & direct coordination</p>
        </div>
        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold">
          4 Active
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search channels, trades, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3 text-xs text-white outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#070D1A] rounded-xl border border-[#142036]">
          {[
            { id: 'all', label: 'All Discussions' },
            { id: 'channels', label: 'Project Channels' },
            { id: 'direct', label: 'Direct Messages' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                filterType === f.id
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="flex flex-col gap-2.5">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => setSelectedThread(thread)}
            className="p-3.5 bg-[#070D1A] hover:bg-[#0C152B] border border-[#142036] hover:border-blue-500/40 rounded-2xl shadow-sm flex items-center justify-between gap-3 transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <img
                  src={thread.participantAvatar}
                  alt={thread.participantName}
                  className="w-11 h-11 rounded-full object-cover border border-[#142036]"
                />
                {thread.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#070D1A]">
                    {thread.unreadCount}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {thread.isDirect ? thread.participantName : `#${thread.channelName}`}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{thread.timestamp}</span>
                </div>
                
                <p className="text-[10px] text-blue-400 font-semibold truncate mt-0.5">
                  {thread.projectName}
                </p>

                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {thread.lastMessage}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0 transition-colors" />
          </div>
        ))}
      </div>

    </div>
  );
};
