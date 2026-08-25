import React, { useState } from 'react';
import { Project, ProjectChatMessage, User } from '../../types';
import { 
  MessageSquare, Send, Hash, Users, ShieldAlert, 
  Paperclip, Image as ImageIcon, CheckCheck, Sparkles 
} from 'lucide-react';

interface ProjectMessagesTabProps {
  project: Project;
  messages: ProjectChatMessage[];
  currentUser: User;
  onSendMessage?: (message: ProjectChatMessage) => void;
}

export const ProjectMessagesTab: React.FC<ProjectMessagesTabProps> = ({
  project,
  messages,
  currentUser,
  onSendMessage
}) => {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [inputText, setInputText] = useState('');

  const channels = [
    { id: 'general', name: 'general-site-updates', icon: Hash, desc: 'Project wide coordination' },
    { id: 'framing', name: 'framing-and-mep', icon: Hash, desc: 'Structure, electrical, HVAC coordination' },
    { id: 'inspections', name: 'inspections-permits', icon: Hash, desc: 'City inspector visits & code sign-offs' },
    { id: 'urgent', name: 'urgent-safety-alerts', icon: ShieldAlert, desc: 'Critical field notices', badge: 'Safety' },
  ];

  const channelMessages = messages.filter(m => m.channelId === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ProjectChatMessage = {
      id: `msg-${Date.now()}`,
      projectId: project.id,
      channelId: activeChannel,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.roleTitle,
      senderAvatar: currentUser.avatar,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (onSendMessage) {
      onSendMessage(newMsg);
    }
    setInputText('');
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-24 font-sans h-[calc(100vh-210px)] min-h-[500px]">
      {/* Top Channels Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChannel === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                  : 'bg-[#0D1422] border-[#1A263B] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>#{ch.name}</span>
              {ch.badge && (
                <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded font-bold border border-red-500/30">
                  {ch.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Frame */}
      <div className="flex-1 rounded-2xl bg-[#080D18] border border-[#162033] flex flex-col overflow-hidden shadow-lg">
        {/* Channel Banner */}
        <div className="px-4 py-2.5 bg-[#0D1422] border-b border-[#162033] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">#{channels.find(c => c.id === activeChannel)?.name}</span>
            <span className="text-[11px] text-slate-400">
              • {channels.find(c => c.id === activeChannel)?.desc}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Field Team Connected</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {channelMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
              <MessageSquare className="w-8 h-8 text-slate-600" />
              <span>This channel is quiet. Start the conversation with the project team below!</span>
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-[#1F2E45] flex-shrink-0"
                  />
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.senderRole}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-[#0F172A] text-slate-200 rounded-tl-none border border-[#1E293B]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#0D1422] border-t border-[#162033] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name}...`}
            className="flex-1 bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
